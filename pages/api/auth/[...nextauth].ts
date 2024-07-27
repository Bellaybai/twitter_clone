import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prisma from "@/libs/prismadb";
import Credentials from 'next-auth/providers/credentials';

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'credentials',
        credentials:{
            email:{label:'email', type:'text'},
            password:{label:'password', type:'password'},
        },
        async authorize(credentials){
            if(!credentials?.email || !credentials?.password){
                throw new Error('Invalid credentials');
            }

            // Fetch user from database
            const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            });
    
            if (!user || !user?.hashedPassword) {
            throw new Error('No user found with the given email');
            }

            // Ensure hashedPassword is a string before comparing
            const isCorrectPassword = user.hashedPassword && await bcrypt.compare(credentials.password, user.hashedPassword);

            if (!isCorrectPassword) {
            throw new Error('Invalid password');
            }

            return user;
            /**
             * // The user object is sanitized before returning it to avoid sending sensitive information.
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
            }; */
        }
        

        })
        
    ],
    debug: process.env.NODE_ENV == 'development',
    session:{
        strategy:'jwt'
    },
    jwt:{
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET
})