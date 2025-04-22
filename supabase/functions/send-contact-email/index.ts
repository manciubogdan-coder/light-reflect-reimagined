
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  nume: string;
  email: string;
  mesaj: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nume, email, mesaj }: ContactEmailRequest = await req.json();

    // Send email to site owner (you)
    const resultOwner = await resend.emails.send({
      from: "Futurist <onboarding@resend.dev>",
      to: ["manciubogdan999@gmail.com"],
      subject: `Contact nou de la ${nume}`,
      html: `
        <h2>Ai primit un mesaj de pe formularul Futurist:</h2>
        <p><strong>Nume:</strong> ${nume}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${mesaj}</p>
      `
    });

    // Send confirmation email to sender (optional)
    await resend.emails.send({
      from: "Futurist <onboarding@resend.dev>",
      to: [email],
      subject: "Am primit mesajul tău!",
      html: `
        <h2>Salut, ${nume}!</h2>
        <p>Iți mulțumim că ne-ai contactat. Am primit mesajul tău și vom răspunde cât mai rapid.</p>
        <p>Echipa Futurist</p>
      `
    });

    return new Response(JSON.stringify({ success: true, resultOwner }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error: any) {
    console.error("send-contact-email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
