import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import { prisma } from "@/prisma/client";

interface User {
    username: string
}

export async function GET(request: NextRequest, {params}: { params : { id: number }}){
    const users = await prisma.user.findMany()
    
    return NextResponse.json(users)
}
