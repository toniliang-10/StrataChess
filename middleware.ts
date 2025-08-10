// shorter way: export { default } from 'next-auth/middleware'
import middleware from 'next-auth/middleware'

export default middleware;

// routes that will redirect people to log in page (Protect Routes)
export const config = {
    // *: zero or more
    // +: one or more
    // ?: zero or one
    matcher: ['/users/:username*']
}