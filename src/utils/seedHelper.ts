/**
 * Helper utility to seed the Convex database with test data
 * This should be called once when the app starts for the first time
 */

/**
 * Attempt to seed the database
 * Returns true if seeding was successful, false otherwise
 */
export async function attemptSeedDatabase(
  seedMutation: () => Promise<{ success: boolean; message: string }>
): Promise<boolean> {
  try {
    console.log('Attempting to seed database...');
    const result = await seedMutation();

    if (result.success) {
      console.log('✓ Database seeded successfully:', result.message);
      return true;
    } else {
      console.log('⚠ Database seeding skipped:', result.message);
      // Database already seeded is not an error
      return true;
    }
  } catch (error) {
    console.error('✗ Failed to seed database:', error);
    return false;
  }
}

/**
 * Check if database has data
 * Returns true if data exists, false otherwise
 */
export async function hasDatabaseData(
  listQuery: () => Promise<any[]>
): Promise<boolean> {
  try {
    const data = await listQuery();
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
}
