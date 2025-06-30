import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";

//request: what youre passing to it
// { params } : URL passed to it

export async function GET(request: NextRequest, {params}: { params : { id: number }}){

    if( params.id > 10 ){
        return NextResponse.json({ id: "Invalid ID"} );
    }
    
    return NextResponse.json( { id: params.id }, {status: 201} );
}

export async function POST(request: NextRequest){   
    const body = await request.json()

    // Validate          (Use Zod)
    // If invalid, return status 400
    const validation = schema.safeParse(body);
    if(!validation.success){
        return NextResponse.json( validation.error.errors , { status: 400})
    }
    return NextResponse.json({ name: body.name, username: body.username}, {status: 201})
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