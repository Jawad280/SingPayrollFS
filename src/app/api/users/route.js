import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { parseISO } from "date-fns";

export async function GET(req) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse(JSON.stringify(error), { status: 404 });
  }

}

export async function POST(req) {

  try {
    const json = await req.json();
  
    const { password, license: licenseString, lastGen: lastGenString, ...userData } = json;
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const license = licenseString ? parseISO(licenseString) : null;
  
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        license
      },
    });
  
    return new NextResponse(JSON.stringify(user), { status: 201 });

  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 404 });
  }

  }