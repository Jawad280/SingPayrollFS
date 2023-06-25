import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { parseISO } from "date-fns";

export async function GET(req) {
    const employees = await prisma.employee.findMany();
    return NextResponse.json(employees);
}

export async function POST(req) {
    const json = await req.json();

    const { dateOfBirth: dobString, resignDate: resignString, joinDate: joinString, ...employeeData} = json;

    const dateOfBirth = dobString ? parseISO(dobString) : null;
    const joinDate = joinString ? parseISO(joinString) : null;
    const resignDate = resignString ? parseISO(resignString) : null;

    const employee = await prisma.employee.create({
        data: {
            ...employeeData,
            dateOfBirth: dateOfBirth,
            resignDate: resignDate,
            joinDate: joinDate
        }
    })

    return new NextResponse(JSON.stringify(employee), { status: 201 })
}