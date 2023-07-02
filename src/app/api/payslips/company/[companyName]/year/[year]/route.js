import { prisma } from "../../../../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET by year : api/company/:companyName/year/:year
export async function GET(req, {params}) {
    const companyName = params.companyName;
    const year = params.year;

    // Start and end date
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const payslip = await prisma.payslip.findMany({
        where: {
            companyName : companyName,
            contributionMonthYear: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    return NextResponse.json(payslip);
}