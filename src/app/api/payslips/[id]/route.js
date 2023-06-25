import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET payslip by ID 
export async function GET(req, {params}) {
    const id = params.id;

    const payslip = await prisma.payslip.findUnique({
        where: {
            id: id
        }
    });

    return NextResponse.json(payslip);
}

// DELETE payslip by ID
export async function DELETE(req, {params}) {
    const id = params.id;

    const deleted = await prisma.payslip.delete({
        where: {
            id: id
        }
    });

    return NextResponse.json(deleted);
}

// UPDATE payslip by ID
export async function PATCH(req, { params }) {
    const id = params.id;
    const inputs = await req.json();

    const updatedPayslip = await prisma.payslip.update({
        where: {
            id: id
        },
        data: inputs
    });

    return NextResponse.json(updatedPayslip);
}