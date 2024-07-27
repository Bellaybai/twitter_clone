import { PrismaClient } from "@prisma/client";

declare global{
    // Allow global prisma to be either a PrismaClient instance or undefined
    var prisma: PrismaClient | undefined
}

// Use an existing PrismaClient instance or create a new one
const client = globalThis.prisma || new PrismaClient();

// Ensure only one PrismaClient instance is created in development
if(process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;