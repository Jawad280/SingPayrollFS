import { prisma } from "../../../../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET api/company/:companyName/monthYear/:name

export async function GET(req, {params}) {
    const companyName = params.companyName;
    const name = params.name;

    const payslip = await prisma.payslip.findMany({
        where: {
            name: name,
            companyName: companyName
        }
    })

    return NextResponse.json(payslip);
}
