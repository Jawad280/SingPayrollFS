import { prisma } from "../../../../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET api/name/:name/:NRIC/:companyName
export async function GET(req, {params}) {
    const name = params.name;
    const NRIC = params.NRIC;
    const companyName = params.companyName

    const payslip = await prisma.payslip.findFirst({
        where: {
            name: name, 
            NRIC: NRIC,
            companyName: companyName
        },
    });

    return NextResponse.json(payslip);
}