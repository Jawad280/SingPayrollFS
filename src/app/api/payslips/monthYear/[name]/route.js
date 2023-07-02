import { prisma } from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET api/monthYear/:name

export async function GET(req, {params}) {
    const name = params.name;

    const payslips = await prisma.payslip.findMany({
        where: {
            name: name
        }
    })

    return NextResponse.json(payslips);
}