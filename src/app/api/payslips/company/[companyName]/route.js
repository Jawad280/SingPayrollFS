import { prisma } from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET by year : api/company/:companyName/year/:year
export async function GET(req, {params}) {
    const companyName = params.companyName;

    const payslip = await prisma.payslip.findMany({
        where: {
            companyName : companyName
        }
    });

    return NextResponse.json(payslip);
}