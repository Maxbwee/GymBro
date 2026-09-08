import { Resend } from "resend";
import { NextResponse } from "next/server";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    const { message, userEmail } = await request.json();

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    await resend.emails.send({
        from: "GymBro Feedback <onboarding@resend.dev>",
        to: "maxbowen1234@gmail.com",
        subject: "New Feedback Received",
        text: `From: ${userEmail ?? "unknown"}\n\n${message}`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send feedback email:", error);
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 });
  }
}