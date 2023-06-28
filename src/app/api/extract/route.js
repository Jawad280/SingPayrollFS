import { NextResponse } from "next/server";
import extractData from "./extractData";

// API for CPF

export async function POST(req) {
    const inputs = await req.json();

    const { employee, cmy } = inputs;

    const output = await extractData(employee, cmy);    
    
    return new NextResponse(JSON.stringify(output), { status: 201 });
}