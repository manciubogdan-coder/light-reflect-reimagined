
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// More restrictive CORS headers with allowable origins
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://acmknwxnyibvbbltfdxh.supabase.co", // Replace with your production domain in production
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

  // Validate request origin
  const origin = req.headers.get("Origin");
  if (origin && !isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ error: "Unauthorized origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Basic input validation
    const body = await req.json();
    const { nume, email, mesaj }: ContactEmailRequest = body;
    
    if (!nume || !email || !mesaj) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Send email to site owner (you)
    const resultOwner = await resend.emails.send({
      from: "Light Reflect Electrical <onboarding@resend.dev>",
      to: ["manciubogdan999@gmail.com"],
      subject: `Contact nou de la ${nume}`,
      html: `
        <h2>Ai primit un mesaj de pe formularul Light Reflect Electrical:</h2>
        <p><strong>Nume:</strong> ${sanitizeHtml(nume)}</p>
        <p><strong>Email:</strong> ${sanitizeHtml(email)}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${sanitizeHtml(mesaj)}</p>
      `
    });

    // Send confirmation email to sender (optional)
    await resend.emails.send({
      from: "Light Reflect Electrical <onboarding@resend.dev>",
      to: [email],
      subject: "Am primit mesajul tău!",
      html: `
        <h2>Salut, ${sanitizeHtml(nume)}!</h2>
        <p>Iți mulțumim că ne-ai contactat. Am primit mesajul tău și vom răspunde cât mai rapid.</p>
        <p>Echipa Light Reflect Electrical</p>
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

// Helper function to determine if origin is allowed
function isAllowedOrigin(origin: string): boolean {
  const allowedOrigins = [
    "https://acmknwxnyibvbbltfdxh.supabase.co",
    "http://localhost:5173",
    "http://localhost:3000",
    // Add your production domain here
  ];
  
  return allowedOrigins.includes(origin);
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Simple HTML sanitizer to prevent XSS attacks
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
