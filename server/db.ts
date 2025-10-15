import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL must be set. Did you forget to add your Supabase connection string?",
  );
}

export const pool = new Pool({ connectionString: process.env.SUPABASE_URL });
export const db = drizzle({ client: pool, schema });
