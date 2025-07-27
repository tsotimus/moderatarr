import { validateEnv } from "@/env"
import { storeServers } from "./storeServers"

export const onStartup = async () => {
    validateEnv()

    try{
        await storeServers()
    } catch(error) {
        console.error(error)
    }
}