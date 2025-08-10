import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

interface User {
    username: string
}

export async function GET(request: NextRequest, {params}: { params : { id: number }}){
    const users = await prisma.user.findMany()
    
    return NextResponse.json(users)
}
