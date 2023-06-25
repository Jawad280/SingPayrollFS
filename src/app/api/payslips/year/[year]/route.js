import { prisma } from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET by year : api/year/:year
export async function GET(req, {params}) {
    const year = params.year;

    // Start and end date
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const payslip = await prisma.payslip.findMany({
        where: {
            contributionMonthYear: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    return NextResponse.json(user);
}