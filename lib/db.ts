import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema";
import { drizzle as drizzleQuery } from "drizzle-orm/postgres-js/driver";

export const sql = postgres(process.env.DATABASE_URL!, { max: 5 });

// Create drizzle database instance
export const db = drizzle(sql, { schema });

// Create query builder instance
export const query = drizzleQuery(sql, { schema });
