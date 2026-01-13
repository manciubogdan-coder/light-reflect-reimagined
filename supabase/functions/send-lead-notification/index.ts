import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  name: string;
  email: string;
  phone: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  // Allow digits, spaces, dashes, plus, and parentheses
  return /^[\d\s\-+()]{6,20}$/.test(phone);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: Partial<LeadNotificationRequest> = await req.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    // Server-side validation
    if (!name || name.length > 100) {
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
    if (!phone || !isValidPhone(phone)) {
      return new Response(JSON.stringify({ error: "Telefon invalid." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Received lead notification request", {
      nameLen: name.length,
      emailDomain: email.split("@")[1] ?? "",
      phoneLen: phone.length,
    });

    // TODO: Once lightreflect.ro is verified in Resend, change back to:
    // const from = "Light Reflect <no-reply@lightreflect.ro>";
    const emailTo = "office@lightreflect.ro";
    const from = "Light Reflect <onboarding@resend.dev>";

    const emailResponse = await resend.emails.send({
      from,
      to: [emailTo],
      subject: `🎯 Lead nou: ${name} a descărcat ghidul PDF`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e3a5f; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            🎯 Lead Nou - Ghid Eficiență Electrică
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>👤 Nume:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>📞 Telefon:</strong> <a href="tel:${phone}">${phone}</a></p>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            Acest lead a descărcat "Manualul Eficienței Electrice" și poate fi contactat pentru servicii de instalații electrice.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <p style="color: #94a3b8; font-size: 12px;">
            Notificare automată de la Light Reflect Website
          </p>
        </div>
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

    console.log("Lead notification email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending lead notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
