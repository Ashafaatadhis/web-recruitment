import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema";

export const pool = postgres(process.env.DATABASE_URL!, { max: 5 });

// Create drizzle database instance
export const db = drizzle(pool, { schema });
