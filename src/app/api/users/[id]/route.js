import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";
import { parseISO } from "date-fns";

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

    const { lastGen: lastGenString, license: licenseString, ...userData } = inputs;
    const license = licenseString ? parseISO(licenseString) : null;
    const lastGen = lastGenString ? parseISO(lastGenString) : null;

    const updatedUser = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            ...userData,
            license: license,
            lastGen: lastGen
        }
    });

    return NextResponse.json(updatedUser);
}