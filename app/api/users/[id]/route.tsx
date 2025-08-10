import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import { prisma } from "@/prisma/client"

//request: what youre passing to it
// { params } : URL passed to it

export async function GET(request: NextRequest, {params}: { params : { id: string }}){

    const { id } = await params; //required as of NextJS 15
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
    { params } : { params: { id: string}}){

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: {id: parseInt(id)}
        })
        
        if(!user){
            return NextResponse.json( {error: "User not found"}, {status: 404});
        }

        const body = await request.json();

        const updatedUser = await prisma.user.update({
            where: {id: parseInt(id)},
            data: {
                name: body.name,
                email: body.email,
                username: body.username
            }
        })
        
        return NextResponse.json( updatedUser, {status: 201});
}

export  async function DELETE(request: NextRequest, 
    { params }: {params: { id: string}}){
        //Fetch User from DB
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id)}
        })

        // If user is not found, return arror 404
        if( !user ){
            return NextResponse.json( {error: "User not found"}, {status: 404});
        }

        // Delete user
        await prisma.user.delete({
            where: { id: parseInt(id)}
        })

        //return 200
        return NextResponse.json( {message: "User deleted"}, {status: 200});
  
}