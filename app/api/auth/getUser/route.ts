import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_KEY as string
);

// Named export for handling `GET` requests
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Fetch user data from Supabase
        const { data, error } = await supabase
            .from("users")
            .select("id, username, email, isregistered, isadmin, created_at")
            .eq("email", email)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: error }, { status: 404 });
        }

        return NextResponse.json({ user: data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
