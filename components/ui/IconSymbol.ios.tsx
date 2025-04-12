import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle, StyleSheet, Platform } from 'react-native';

const colors = {
  primary: "#4A6FFF",        // Primary blue - energetic, trustworthy
  primaryLight: "#D5DFFF",   // Light blue for backgrounds/accents
  secondary: "#FF8C42",      // Orange for CTAs and highlights
  dark: "#212B36",           // Dark text/headers
  gray: "#637381",           // Secondary text 
  lightGray: "#DFE3E8",      // Borders, dividers
  background: "#F7F9FC",     // Main background
  white: "#FFFFFF",          // Card backgrounds
  success: "#2CC66D",        // Positive states
  error: "#FF4D4F",          // Error states
  warning: "#FFB547",        // Warning states
};

export const typographyStyles = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark,
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray,
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    color: colors.gray,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: colors.gray,
    lineHeight: 18,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  header: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  companyLogo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...typographyStyles.h2,
    marginBottom: 8,
  },
  company: {
    fontSize: 18,
    color: colors.gray,
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    ...typographyStyles.h3,
    marginBottom: 16,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    ...typographyStyles.caption,
    marginBottom: 4,
  },
  detailValue: {
    ...typographyStyles.subtitle,
  },
  description: {
    ...typographyStyles.body,
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 8,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

const searchStyles = StyleSheet.create({
  searchContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
    color: colors.gray,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingBottom: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  filterChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.gray,
    marginRight: 4,
  },
  filterChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    ...typographyStyles.h3,
  },
  leftAction: {
    padding: 8,
  },
  rightAction: {
    padding: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 0,
    marginBottom: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  cardTopBar: {
    height: 4,
    backgroundColor: colors.primary,
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
    gap: 8,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    marginTop: 12,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.gray,
    flex: 1,
  },
  bookmarkButton: {
    padding: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  salary: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  postedDate: {
    fontSize: 12,
    color: colors.gray,
  },
});
