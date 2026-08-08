// PostgreSQL/ORM connection placeholder.
// Add Prisma or another server-side database client here.
// Never expose DATABASE_URL to the browser.

export function databaseConfig() {
  return {
    configured: Boolean(process.env.DATABASE_URL)
  };
}
