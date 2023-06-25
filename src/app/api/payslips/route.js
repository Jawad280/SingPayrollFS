import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { parseISO } from "date-fns";

export async function GET(req) {
    const payslips = await prisma.payslip.findMany();
    return NextResponse.json(payslips);
}

export async function POST(req) {
    const json = await req.json();

    const {
        contributionMonthYear: cmyString,
        dateOfPayment: dateOfPaymentString,
        dateOfBirth: dobString,
        ...payslipData
    } = json;

    const contributionMonthYear = cmyString ? parseISO(cmyString) : null;
    const dateOfPayment = dateOfPaymentString ? parseISO(dateOfPaymentString) : null;
    const dateOfBirth = dobString ? parseISO(dobString) : null;

    const payslip = await prisma.payslip.create({
        data: {
            ...payslipData,
            contributionMonthYear: contributionMonthYear,
            dateOfPayment: dateOfPayment,
            dateOfBirth: dateOfBirth
        }
    })

    return new NextResponse(JSON.stringify(payslip), { status: 201 })
}