import { validateEnv } from "@/env"
import { storeServers } from "./storeServers"
import { resetDb } from "./resetDb"

export const onStartup = async () => {
    validateEnv()
    try{
        await resetDb()
    } catch(error) {
        console.error("Error resetting database", error)
    }
    try{
        await storeServers()
    } catch(error) {
        console.error("Error storing servers", error)
    }
}