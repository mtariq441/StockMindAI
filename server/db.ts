import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to add your Supabase connection string?",
  );
}

neonConfig.webSocketConstructor = ws;
neonConfig.pipelineConnect = false;
neonConfig.useSecureWebSocket = true;
neonConfig.forceDisablePgSSL = true;

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
export const db = drizzle({ client: pool, schema });
