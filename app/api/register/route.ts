import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import bcrypt from 'bcrypt'

// Use Postman to practice registering users
const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password must include upper, lower, and a number");

const schema = z.object({
    email: z.string().email().max(100).transform(v => v.trim().toLowerCase()),
    username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9]+$/).transform(v => v.trim().toLowerCase()),
    name: z.string().min(1).max(50).regex(/^[a-zA-Z\s'-]+$/).transform(v => v.trim()),
    password: passwordSchema
});

export async function POST(request: NextRequest){
    const body = await request.json();

    const validation = schema.safeParse(body);
    if(!validation.success){
        return NextResponse.json(
            validation.error.errors, 
            { status: 400},
        )};

    const user = await prisma.user.findUnique(
        { where: {email: body.email }
    });

    const existingUsername = await prisma.user.findUnique(
        { where: {username: body.username }
    });

    if (user) {
        return NextResponse.json(
            { error: 'User with this email already Exists'}, 
            {status: 400}
        )
    }

    if (existingUsername) {
        return NextResponse.json(
            { error: 'Username already taken'}, 
            {status: 400}
        )
    }


    const hashedPassword = await bcrypt.hash(body.password, 12); 
    const newUser = await prisma.user.create({
        data: {
            email: body.email,
            username: body.username,
            name: body.name,
            hashedPassword
        }
    });

    return NextResponse.json({email: newUser.email})
}