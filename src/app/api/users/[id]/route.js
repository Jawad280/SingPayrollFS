import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET user by ID 
export async function GET(req, {params}) {
    const id = params.id;

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    return NextResponse.json(user);
}

// DELETE user by ID
export async function DELETE(req, {params}) {
    const id = params.id;

    const deleted = await prisma.user.delete({
        where: {
            id: id
        }
    });

    return NextResponse.json(deleted);
}

// UPDATE user by ID
export async function PATCH(req, { params }) {
    const id = params.id;
    const inputs = await req.json();

    const updatedUser = await prisma.user.update({
        where: {
            id: id
        },
        data: inputs
    });

    return NextResponse.json(updatedUser);
}