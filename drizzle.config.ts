import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:E8JYGPbAp1dv@ep-orange-term-a56311wf.us-east-2.aws.neon.tech/neondb?sslmode=require",
  }
});
