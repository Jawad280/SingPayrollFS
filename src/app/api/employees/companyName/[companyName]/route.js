import { prisma } from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET api/employees/companyName/:companyName
export async function GET(req, {params}) {
    const companyName = params.companyName;

    const employee = await prisma.employee.findMany({
        where: {
            companyName: companyName
        }
    });

    return NextResponse.json(employee);
}