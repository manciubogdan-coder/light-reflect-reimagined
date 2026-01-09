
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

function isValidEmail(email: string) {
  // Simple, safe validator (avoid overly strict RFC regex)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: Partial<ContactEmailRequest> = await req.json();

    const nume = String(body.nume ?? "").trim();
    const email = String(body.email ?? "").trim();
    const mesaj = String(body.mesaj ?? "").trim();

    // Server-side validation
    if (!nume || nume.length > 100) {
      return new Response(JSON.stringify({ error: "Numele este invalid." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!email || email.length > 255 || !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Email invalid." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!mesaj || mesaj.length > 5000) {
      return new Response(JSON.stringify({ error: "Mesaj invalid." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Avoid logging PII content
    console.log("Received contact email request", {
      nameLen: nume.length,
      emailDomain: email.split("@")[1] ?? "",
      messageLen: mesaj.length,
    });

    // Destination inbox
    const emailTo = "office@lightreflect.ro";

    // IMPORTANT:
    // - If your Resend account is still in "testing" mode, Resend only allows sending to your own email.
    // - To send to office@lightreflect.ro, verify the domain in Resend and use a FROM address on that domain.
    const from = "Light Reflect <no-reply@lightreflect.ro>";

    const emailResponse = await resend.emails.send({
      from,
      to: [emailTo],
      reply_to: email,
      subject: `Solicitare nouă de la ${nume}`,
      html: `
        <h2>Mesaj nou din formularul de contact</h2>
        <p><strong>Nume:</strong> ${nume}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${mesaj.replace(/\n/g, "<br />")}</p>
        <hr>
        <p>Notă: Acest email a fost trimis prin formularul de contact Light Reflect.</p>
      `,
    });

    if ((emailResponse as any)?.error) {
      console.error("Resend error:", (emailResponse as any).error);
      const msg = (emailResponse as any).error?.message ?? "Failed to send email";
      const status = Number((emailResponse as any).error?.statusCode ?? 500);
      return new Response(JSON.stringify({ error: msg }), {
        status: status >= 400 && status < 600 ? status : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
