import { NextResponse } from "next/server";
import { getAllPages } from "@/src/lib/pages";

//get all pages
export async function GET() {
    console.log("API: GET /api/pages called");
    try {
        const pages = await getAllPages();
        return NextResponse.json({ success: true, pages });
    } catch (error) {
        console.error("Error fetching pages:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch pages" }, { status: 500 });
    }
}   
