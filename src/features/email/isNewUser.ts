import { env } from "@/env";
import { resend } from "@/lib/resend"

export const isNewUser = async (email: string) => {
    try {
        const contact = await resend.contacts.get({
            email: email,
            audienceId: env.RESEND_AUDIENCE_ID,
        });

        if (contact.data) {
            return false
        }

        return true
    } catch (error) {
        console.error(error)
        return null
    }
}