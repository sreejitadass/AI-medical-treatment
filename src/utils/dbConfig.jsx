import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://beats-cancer_owner:j17RAJbINuhS@ep-shrill-shape-a1ta0txv.ap-southeast-1.aws.neon.tech/beats-cancer?sslmode=require",
);
export const db = drizzle(sql, { schema });
