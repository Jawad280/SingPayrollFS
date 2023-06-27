import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";
import { parseISO } from "date-fns";

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

    const {
        contributionMonthYear: cmyString,
        dateOfPayment: dateOfPaymentString,
        dateOfBirth: dobString,
        ...payslipData
    } = inputs;

    const contributionMonthYear = cmyString ? parseISO(cmyString) : null;
    const dateOfPayment = dateOfPaymentString ? parseISO(dateOfPaymentString) : null;
    const dateOfBirth = dobString ? parseISO(dobString) : null;

    const updatedPayslip = await prisma.payslip.update({
        where: {
            id: id
        },
        data: {
            ...payslipData,
            contributionMonthYear: contributionMonthYear,
            dateOfPayment: dateOfPayment,
            dateOfBirth: dateOfBirth
        }
    });

    return NextResponse.json(updatedPayslip);
}