import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface for Job data
export interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  phone: string;
  company?: string;
  description?: string;
  jobType?: string;
  category?: string;
  bookmarked?: boolean;
}

// Interface for context
interface JobContextType {
  jobs: Job[];
  bookmarkedJobs: Job[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMoreJobs: boolean;
  fetchJobs: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  bookmarkJob: (job: Job) => Promise<void>;
  removeBookmark: (jobId: string) => Promise<void>;
  isBookmarked: (jobId: string) => boolean;
}

// Create context with default values
const JobContext = createContext<JobContextType>({
  jobs: [],
  bookmarkedJobs: [],
  loading: false,
  error: null,
  page: 1,
  hasMoreJobs: true,
  fetchJobs: async () => {},
  fetchNextPage: async () => {},
  bookmarkJob: async () => {},
  removeBookmark: async () => {},
  isBookmarked: () => false,
});

// Try to open SQLite database, otherwise we'll use AsyncStorage as fallback
let db: SQLite.WebSQLDatabase | null = null;
let usingSQLite = false;

try {
  db = SQLite.openDatabase('jobs.db');
  usingSQLite = true;
  console.log('Using SQLite for storage');
} catch (err) {
  console.warn('SQLite not available, using AsyncStorage fallback', err);
  usingSQLite = false;
}

// Provider component
export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMoreJobs, setHasMoreJobs] = useState<boolean>(true);

  // Initialize database and load bookmarked jobs
  useEffect(() => {
    if (usingSQLite && db) {
      // Using SQLite
      try {
        db.transaction(tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS bookmarked_jobs (id TEXT PRIMARY KEY, data TEXT);',
            [],
            () => {
              console.log('Database and table initialized');
              loadBookmarkedJobs();
            },
            (_, error) => {
              console.error('Error creating table:', error);
              return false;
            }
          );
        });
      } catch (err) {
        console.error('Error initializing SQLite:', err);
      }
    } else {
      // Using AsyncStorage fallback
      loadBookmarkedJobs();
    }
  }, []);

  // Load bookmarked jobs from storage
  const loadBookmarkedJobs = () => {
    if (usingSQLite && db) {
      // Using SQLite
      try {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM bookmarked_jobs;',
            [],
            (_, { rows }) => {
              const loadedJobs: Job[] = [];
              for (let i = 0; i < rows.length; i++) {
                const jobData = JSON.parse(rows.item(i).data);
                loadedJobs.push({ ...jobData, bookmarked: true });
              }
              setBookmarkedJobs(loadedJobs);
            },
            (_, error) => {
              console.error('Error loading bookmarked jobs:', error);
              return false;
            }
          );
        });
      } catch (err) {
        console.error('Error loading bookmarked jobs from SQLite:', err);
      }
    } else {
      // Using AsyncStorage fallback
      AsyncStorage.getItem('bookmarkedJobs')
        .then(jsonValue => {
          if (jsonValue) {
            const loadedJobs = JSON.parse(jsonValue);
            setBookmarkedJobs(loadedJobs.map((job: Job) => ({ ...job, bookmarked: true })));
          }
        })
        .catch(err => {
          console.error('Error loading bookmarked jobs from AsyncStorage:', err);
        });
    }
  };

  // Transform API job data to our Job interface
  const transformJob = (job: any, index: number): Job => {
    try {
      // Ensure ID is always a string for consistent comparison
      let jobId: string;
      if (job.id) {
        jobId = String(job.id).trim();
      } else if (job.title) {
        jobId = `job-${job.title.replace(/\s+/g, '-').toLowerCase()}-${index}`;
      } else {
        jobId = `job-${index}-${Date.now()}`;
      }
      
      // Extract fields from the Lokal job API format
      return {
        id: jobId,
        title: job.title || 'Untitled Job',
        location: (job.primary_details && job.primary_details.Place) || 
                job.job_location_slug || 
                'Location not specified',
        salary: (job.primary_details && job.primary_details.Salary) || 
               'Salary not specified',
        phone: job.whatsapp_no || 
              (job.contact_preference && job.contact_preference.whatsapp_link && 
               job.contact_preference.whatsapp_link.includes('tel:') ? 
               job.contact_preference.whatsapp_link.split('tel:')[1] : 
               (job.button_text && job.button_text.includes('Call') && job.custom_link && 
                job.custom_link.includes('tel:') ? 
                job.custom_link.split('tel:')[1] : 'Phone not available')),
        company: job.company_name || '',
        description: job.other_details || 
                    (job.contentV3 && job.contentV3.V3 && 
                     job.contentV3.V3.find((item: any) => 
                       item.field_key === "Other details" || 
                       item.field_name === " ఇతర వివరాలు"
                     )?.field_value) || 
                    (job.content && typeof job.content === 'string' ? job.content : ''),
        jobType: (job.primary_details && job.primary_details.Job_Type) || 
                job.job_hours || 
                (job.primary_details && job.primary_details.Other_details) ||
                (job.contentV3 && job.contentV3.V3 && 
                 job.contentV3.V3.find((item: any) => 
                   item.field_key === "Job Category" || 
                   item.field_name === "జాబ్ కేటగిరి"
                 )?.field_value) || 
                '',
        category: job.job_category || 
                 (job.contentV3 && job.contentV3.V3 && 
                  job.contentV3.V3.find((item: any) => 
                    item.field_key === "Job Category" || 
                    item.field_name === "జాబ్ కేటగిరి"
                  )?.field_value) || 
                 '',
      };
    } catch (err) {
      console.error(`Error transforming job ${index}:`, err);
      // Return a fallback job object if transformation fails
      return {
        id: `job-${index}-${Date.now()}`,
        title: job.title || 'Untitled Job',
        location: 'Error parsing location',
        salary: 'Error parsing salary',
        phone: 'Error parsing phone',
        company: job.company_name || '',
        description: 'Error parsing job details',
      };
    }
  };

  // Fetch jobs from Lokal API
  const fetchJobs = async (force = false) => {
    // Always show loading state when fetching
    setLoading(true);
    
    // Skip fetching if we have jobs already and not forcing a refresh
    if (jobs.length > 0 && !force) {
      console.log('Using existing jobs, skipping fetch');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Fetching jobs from API...');
      
      const response = await fetch('https://testapi.getlokalapp.com/common/jobs?page=1');
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('API response received:', 
        Object.keys(data).length > 0 ? 
        `Contains ${Object.keys(data).length} top-level keys: ${Object.keys(data).join(', ')}` : 
        'Empty response');
      
      // Check if response contains a 'results' array as per the provided example
      let jobsData = [];
      if (data.results && Array.isArray(data.results)) {
        console.log(`Found results array with ${data.results.length} jobs`);
        jobsData = data.results;
      } else if (Array.isArray(data)) {
        console.log(`Response is an array with ${data.length} jobs`);
        jobsData = data;
      } else {
        console.log('Response format is unexpected, trying to extract job data');
        jobsData = data.data || data.jobs || data.items || [];
      }
      
      // Log first job ID format for debugging
      if (jobsData.length > 0) {
        console.log('First job ID type:', typeof jobsData[0].id);
        console.log('First job ID value:', jobsData[0].id);
      }
      
      // Transform jobs using our helper function
      const transformedJobs = jobsData.map((job, index) => transformJob(job, index));
      
      console.log(`Transformed ${transformedJobs.length} jobs`);
      
      // Log the first few job IDs after transformation
      if (transformedJobs.length > 0) {
        console.log('First 3 job IDs after transformation:',
          transformedJobs.slice(0, 3).map(job => job.id));
      }
      
      setJobs(transformedJobs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching jobs:', errorMessage);
      setError(`Failed to fetch jobs: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch next page of jobs
  const fetchNextPage = async () => {
    if (loading || !hasMoreJobs) return;
    
    const nextPage = page + 1;
    setLoading(true);
    
    console.log(`Fetching next page of jobs: https://testapi.getlokalapp.com/common/jobs?page=${nextPage}`);
    
    try {
      const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${nextPage}`);
      
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Next page API raw response:', JSON.stringify(data).substring(0, 200) + '...');
      
      // Check if data has results array (from the sample provided)
      let jobsData = [];
      if (data && Array.isArray(data.results)) {
        console.log('API returned data.results array');
        jobsData = data.results;
      } else if (data && Array.isArray(data)) {
        console.log('API returned array directly');
        jobsData = data;
      } else if (data && Array.isArray(data.data)) {
        console.log('API returned data.data array');
        jobsData = data.data;
      } else if (data && Array.isArray(data.jobs)) {
        console.log('API returned data.jobs array');
        jobsData = data.jobs;
      } else {
        console.warn('Could not find jobs array in next page API response');
        // For next page, we don't add fallback data if none found
        jobsData = [];
      }
      
      if (jobsData.length > 0) {
        console.log(`Successfully parsed ${jobsData.length} more jobs from API (page ${nextPage})`);
        
        // Transform job data to match our interface
        const processedJobs = jobsData.map((job, index) => {
          const offset = jobs.length;
          return transformJob(job, offset + index);
        });
        
        console.log(`Processed ${processedJobs.length} jobs with validated IDs for page ${nextPage}`);
        
        // Mark jobs as bookmarked if they exist in bookmarked jobs
        const newJobs = processedJobs.map((job: Job) => ({
          ...job,
          bookmarked: bookmarkedJobs.some(bookmarkedJob => bookmarkedJob.id === job.id)
        }));
        
        setJobs(prevJobs => [...prevJobs, ...newJobs]);
        setPage(nextPage);
        setHasMoreJobs(processedJobs.length > 0);
      } else {
        console.log('No more jobs available in API');
        setHasMoreJobs(false);
      }
    } catch (err) {
      console.error('Error fetching next page of jobs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setHasMoreJobs(false);
    } finally {
      setLoading(false);
    }
  };

  // Bookmark a job
  const bookmarkJob = async (job: Job) => {
    const updatedJob = { ...job, bookmarked: true };
    
    if (usingSQLite && db) {
      // Using SQLite
      try {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT OR REPLACE INTO bookmarked_jobs (id, data) VALUES (?, ?);',
            [job.id, JSON.stringify(job)],
            () => {
              // Update state
              setBookmarkedJobs(prev => [...prev.filter(j => j.id !== job.id), updatedJob]);
              
              // Update jobs array
              setJobs(prev => 
                prev.map(j => j.id === job.id ? { ...j, bookmarked: true } : j)
              );
            },
            (_, error) => {
              console.error('Error bookmarking job:', error);
              return false;
            }
          );
        });
      } catch (err) {
        console.error('Error in bookmarkJob with SQLite:', err);
      }
    } else {
      // Using AsyncStorage fallback
      try {
        const newBookmarkedJobs = [...bookmarkedJobs.filter(j => j.id !== job.id), updatedJob];
        await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(newBookmarkedJobs));
        
        // Update state
        setBookmarkedJobs(newBookmarkedJobs);
        
        // Update jobs array
        setJobs(prev => 
          prev.map(j => j.id === job.id ? { ...j, bookmarked: true } : j)
        );
      } catch (err) {
        console.error('Error in bookmarkJob with AsyncStorage:', err);
      }
    }
  };

  // Remove bookmark
  const removeBookmark = async (jobId: string) => {
    if (usingSQLite && db) {
      // Using SQLite
      try {
        db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM bookmarked_jobs WHERE id = ?;',
            [jobId],
            () => {
              // Update state
              setBookmarkedJobs(prev => prev.filter(job => job.id !== jobId));
              
              // Update jobs array
              setJobs(prev => 
                prev.map(job => job.id === jobId ? { ...job, bookmarked: false } : job)
              );
            },
            (_, error) => {
              console.error('Error removing bookmark:', error);
              return false;
            }
          );
        });
      } catch (err) {
        console.error('Error in removeBookmark with SQLite:', err);
      }
    } else {
      // Using AsyncStorage fallback
      try {
        const newBookmarkedJobs = bookmarkedJobs.filter(job => job.id !== jobId);
        await AsyncStorage.setItem('bookmarkedJobs', JSON.stringify(newBookmarkedJobs));
        
        // Update state
        setBookmarkedJobs(newBookmarkedJobs);
        
        // Update jobs array
        setJobs(prev => 
          prev.map(job => job.id === jobId ? { ...job, bookmarked: false } : job)
        );
      } catch (err) {
        console.error('Error in removeBookmark with AsyncStorage:', err);
      }
    }
  };

  // Check if a job is bookmarked
  const isBookmarked = (jobId: string): boolean => {
    return bookmarkedJobs.some(job => job.id === jobId);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        bookmarkedJobs,
        loading,
        error,
        page,
        hasMoreJobs,
        fetchJobs,
        fetchNextPage,
        bookmarkJob,
        removeBookmark,
        isBookmarked,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

// Custom hook to use the job context
export const useJobs = () => useContext(JobContext);

// Add default export of the provider component
export default JobProvider; 