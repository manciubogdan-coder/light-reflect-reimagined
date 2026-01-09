
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

    // Pentru conturile Resend gratuite, putem trimite doar către adresa proprie de email
    // Așa că folosim o singură trimitere cu toate informațiile
    const emailTo = "office@lightreflect.ro"; // Adresa de email verificată în Resend

    const emailResponse = await resend.emails.send({
      from: "Light Reflect <onboarding@resend.dev>",
      to: [emailTo],
      reply_to: email,
      subject: `Solicitare parteneriat de la ${nume}`,
      html: `
        <h2>Solicitare nouă de parteneriat</h2>
        <p><strong>Nume:</strong> ${nume}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${mesaj.includes('Telefon:') ? mesaj.split('Telefon:')[1].split('\n')[0].trim() : 'Nu este specificat'}</p>
        <p><strong>Oraș:</strong> ${mesaj.includes('Oraș:') ? mesaj.split('Oraș:')[1].split('\n')[0].trim() : 'Nu este specificat'}</p>
        <p><strong>Experiență:</strong> ${mesaj.includes('Experiență:') ? mesaj.split('Experiență:')[1].split('\n')[0].trim() : 'Nu este specificată'}</p>
        <p><strong>Mesaj:</strong> ${mesaj.includes('Mesaj:') ? mesaj.split('Mesaj:')[1].trim() : mesaj}</p>
        <hr>
        <p>Notă: Acest email a fost trimis prin sistemul de solicitări de parteneriat Light Reflect.</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

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
