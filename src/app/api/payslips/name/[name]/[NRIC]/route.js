import { prisma } from "../../../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET api/name/:name/:NRIC
export async function GET(req, {params}) {
    const name = params.name;
    const NRIC = params.NRIC;

    const payslip = await prisma.payslip.findFirst({
        where: {
            name: name,
            NRIC: NRIC,
        },
    });

    return NextResponse.json(payslip);
}