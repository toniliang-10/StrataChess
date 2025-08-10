import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { prisma } from "@/prisma/client";


export const authOptions = {
  providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email', placeholder: 'Email'},
          password: { label: 'Password', type: 'password', placeholder: 'Password'},
        },
        async authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied
          if( !credentials?.email || !credentials?.password ) return null;

          const user = await prisma.user.findUnique({ 
            where: { email: credentials.email},
          })
    
          if (!user) {
            // Any object returned will be saved in `user` property of the JWT
            return null
          } 

          const passwordsMatch = await bcrypt.compare(
            credentials.password,  
            user.hashedPassword!
          );

          if (!passwordsMatch) return null;


          return {
            id: String(user.id),          // Fix: Convert to string
            name: user.name,
            email: user.email,
            image: null,                  // or user.image if you have it
          };
        }
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      })
    ],
    
};

const handler = NextAuth(authOptions);


export { handler as GET, handler as POST };