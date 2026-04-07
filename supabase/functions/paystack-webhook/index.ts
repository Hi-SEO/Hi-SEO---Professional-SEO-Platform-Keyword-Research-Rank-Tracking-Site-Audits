import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY");

    if (!paystackSecret || !supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({
          error: "Missing server environment variables",
          debug: {
            hasPaystackSecret: !!paystackSecret,
            hasSupabaseUrl: !!supabaseUrl,
            hasServiceRoleKey: !!supabaseServiceRoleKey,
          },
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const signature = req.headers.get("x-paystack-signature");
    const rawBody = await req.text();

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(paystackSecret),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );

    const signedBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(rawBody)
    );

    const computedSignature = Array.from(new Uint8Array(signedBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (!signature || signature !== computedSignature) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    if (event !== "charge.success") {
      return new Response(
        JSON.stringify({ received: true, ignored: true, event }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const reference = data?.reference;
    const email = data?.customer?.email ?? null;
    const amount = data?.amount ?? 0;
    const currency = data?.currency ?? "NGN";
    const status = data?.status ?? "success";
    const paidAt = data?.paid_at ?? new Date().toISOString();
    const userId =
      data?.metadata?.userId ??
      data?.metadata?.user_id ??
      null;

    if (!reference || !userId) {
      return new Response(
        JSON.stringify({
          error: "Missing reference or userId in webhook payload",
          event,
          reference,
          userId,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { error: paymentInsertError } = await supabase
      .from("payments")
      .upsert(
        {
          user_id: userId,
          reference,
          email,
          amount,
          currency,
          status,
          plan: "premium",
          paid_at: paidAt,
        },
        { onConflict: "reference" }
      );

    if (paymentInsertError) {
      return new Response(
        JSON.stringify({
          error: "Failed to save payment",
          details: paymentInsertError,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ plan: "premium" })
      .eq("id", userId);

    if (profileUpdateError) {
      return new Response(
        JSON.stringify({
          error: "Failed to update profile",
          details: profileUpdateError,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
        reference,
        userId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
