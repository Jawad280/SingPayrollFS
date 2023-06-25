import { prisma } from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET api/users/username/:username
export async function GET(req, {params}) {
    try {
        const username = params.username;

        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        });
    
        return NextResponse.json(user);
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 404 });
    }

}