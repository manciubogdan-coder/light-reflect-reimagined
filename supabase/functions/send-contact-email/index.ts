
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  nume: string;
  email: string;
  mesaj: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nume, email, mesaj }: ContactEmailRequest = await req.json();

    console.log("Received email request:", { nume, email, mesaj });

    // Send email to company
    const emailToCompany = await resend.emails.send({
      from: "Light Reflect <onboarding@resend.dev>",
      to: ["lightreflectelectricalservices@gmail.com"], // Replace with actual company email
      reply_to: email,
      subject: `Solicitare parteneriat de la ${nume}`,
      html: `
        <h2>Solicitare nouă de parteneriat</h2>
        <p><strong>Nume:</strong> ${nume}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mesaj:</strong> ${mesaj}</p>
      `,
    });

    // Send confirmation email to client
    const emailToClient = await resend.emails.send({
      from: "Light Reflect <onboarding@resend.dev>",
      to: [email],
      subject: "Mulțumim pentru solicitarea de parteneriat!",
      html: `
        <h2>Mulțumim pentru interesul tău, ${nume}!</h2>
        <p>Am primit solicitarea ta de parteneriat cu Light Reflect.</p>
        <p>Te vom contacta în curând pentru a discuta despre următorii pași.</p>
        <p>Cu stimă,<br>Echipa Light Reflect</p>
      `,
    });

    console.log("Email sent successfully:", { emailToCompany, emailToClient });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
