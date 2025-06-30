import { NextRequest, NextResponse } from "next/server";

interface User {
    username: string
}

export async function GET(request: NextRequest, {params}: { params : { id: number }}){
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await res.json()

    
    return NextResponse.json(users)
}
