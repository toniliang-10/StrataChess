import { z } from "zod";

const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    username: z.string().min(3)
})

export default schema;