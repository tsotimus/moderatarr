import { env } from "@/env";
import { resend } from "@/lib/resend"

export const addContact = async (email: string) => {

    try {
        const contact = await resend.contacts.create({
            email: email,
            audienceId: env.RESEND_AUDIENCE_ID,
        });

        return contact.data
    } catch (error) {
        console.error(error)
        return false
    }
}   