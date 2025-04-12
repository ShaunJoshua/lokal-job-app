# Lokal Job App

A React Native Expo app for browsing and bookmarking jobs.

## Features

- View available jobs from the API
- Infinite scrolling for loading more jobs
- Bookmark jobs for offline viewing
- View detailed job information
- Call employers directly from the app
- Dark mode support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app on your mobile device for testing

## Installation

1. Clone the repository or download the source code

2. Navigate to the project directory:
```bash
cd lokal-job-app
```

3. Install dependencies:
```bash
npm install
```

## Running the App

To start the development server:

```bash
npx expo start
```

This will display a QR code that you can scan with the Expo Go app on your mobile device to run the app.

### Running on simulators/emulators

- For iOS simulator:
```bash
npm run ios
```

- For Android emulator:
```bash
npm run android
```

## Project Structure

```
lokal-job-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx         # Jobs screen
│   │   ├── bookmarks.tsx     # Bookmarks screen
│   │   └── _layout.tsx       # Tab navigator
│   ├── context/
│   │   └── JobContext.tsx    # Job data and state management
│   ├── job/
│   │   └── [id].tsx          # Job details screen
│   └── _layout.tsx           # Root layout
├── components/
│   └── JobCard.tsx           # Job card component
├── constants/
│   └── Colors.ts             # Theme colors
└── assets/                   # Images and fonts
```

## Key Implementation Details

### State Management

The app uses React Context API for state management, with the `JobProvider` component in `app/context/JobContext.tsx` handling:
- Fetching jobs from the API
- Managing bookmarked jobs
- Storing bookmarks in SQLite for offline access

### Navigation

Navigation is implemented using Expo Router, with:
- A bottom tab navigator for Jobs and Bookmarks screens
- Stack navigation for job details

### Data Persistence

- SQLite is used to store bookmarked jobs for offline viewing
- The database is initialized when the app starts

## Testing

### Manual Testing Checklist

1. Job listing:
   - Check if jobs are loaded correctly
   - Test infinite scrolling by scrolling to the bottom
   - Verify pull-to-refresh functionality

2. Bookmarking:
   - Bookmark a job and verify it appears in the Bookmarks tab
   - Remove a bookmark and verify it's removed from the Bookmarks tab
   - Close and reopen the app to verify bookmarks persist

3. Job Details:
   - Tap on a job card to view details
   - Test the bookmark toggle button in the details screen
   - Test the phone call feature by tapping the phone number

4. Error handling:
   - Test offline behavior
   - Check error states

## Performance Optimization

- Implemented proper list rendering with FlatList
- Used React.memo for components that don't need frequent re-renders
- Minimized state updates
- Implemented pagination with infinite scrolling
- Used local SQLite database for efficient offline storage
- Optimized image sizes and assets

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed:
```bash
npm install
```

2. Clear the Expo cache:
```bash
npx expo start -c
```

3. Check for any errors in the terminal or console logs
