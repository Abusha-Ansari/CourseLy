import { EmailTemplate } from "@/components/email-template";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const bodyData = JSON.parse(body);
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["msaif8747@gmail.com"],
      subject: `New Message from ${bodyData.username}`,
      // @ts-expect-error
      react: EmailTemplate({
        user: bodyData.username,
        userId: bodyData.id,
        userEmail: bodyData.email,
        message: `${bodyData.message}`,
      }),
    });
    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}