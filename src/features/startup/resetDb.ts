import { db } from "@/lib/db";
import { serversTable } from "@/lib/db/schema/servers";
import { reset } from "drizzle-seed";

export const resetDb = async () => {
    await reset(db, { serversTable });
}