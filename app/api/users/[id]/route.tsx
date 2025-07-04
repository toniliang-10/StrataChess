import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import { prisma } from "@/prisma/client"

//request: what youre passing to it
// { params } : URL passed to it

export async function GET(request: NextRequest, {params}: { params : { id: string }}){

    const { id } = params; //required as of NextJS 15
    const user = await prisma.user.findUnique({
        where: {id: parseInt(id)}
    });

    if(!user){
        return NextResponse.json({ error: "User not found"}, {status: 500} );
    }
    
    return NextResponse.json( user );
}

export async function POST(request: NextRequest){   
    const body = await request.json()

    // Validate   (Using Zod), If invalid then return status 400
    const validation = schema.safeParse(body);
    if(!validation.success){
        return NextResponse.json( validation.error.errors , { status: 400})
    }

    //validate user 
    const user_email = await prisma.user.findUnique({
        where: {email: body.email} 
    });
    if(user_email){
        return NextResponse.json({error: "Email is Taken"}, {status: 400});
    }
    const user_username = await prisma.user.findUnique({
        where: {username: body.username}
    });
    if(user_username){
        return NextResponse.json({error: "Username is Taken"}, {status: 400});
    }

    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            username: body.username
        }
    });

    return NextResponse.json(user, {status: 201})
}

export async function PUT(request: NextRequest, 
    { params } : { params: { id: number}}){

        const body = await request.json();

        if ( !body.name ){
            return NextResponse.json( {error: "Name is required"}, { status: 400 });
        }
        if ( params.id > 10 ){
            return NextResponse.json( {error: " ID is invalid "} , { status: 404} );
        }
        
        return NextResponse.json( {name: body.name}, {status: 201});
}

export  async function DELETE(request: NextRequest, 
    { params }: {params: { id: number}}){
        //Fetch User from DB
        // If user is not found, return arror 404
        // Delete user
        //return 200
}