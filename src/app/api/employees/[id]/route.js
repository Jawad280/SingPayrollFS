import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET employee by ID 
export async function GET(req, {params}) {
    const id = params.id;

    const employee = await prisma.employee.findUnique({
        where: {
            id: id
        }
    });

    return NextResponse.json(employee);
}

// DELETE employee by ID
export async function DELETE(req, {params}) {
    const id = params.id;

    const deleted = await prisma.employee.delete({
        where: {
            id: id
        }
    });

    return NextResponse.json(deleted);
}

// UPDATE employee by ID
export async function PATCH(req, { params }) {
    const id = params.id;
    const inputs = await req.json();

    const updatedEmployee = await prisma.employee.update({
        where: {
            id: id
        },
        data: inputs
    });

    return NextResponse.json(updatedEmployee);
}