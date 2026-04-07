import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed", step: "method-check" }),
        { status: 405, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { reference, userId } = body;

    if (!reference || !userId) {
      return new Response(
        JSON.stringify({
          error: "Missing reference or userId",
          step: "request-validation",
          body,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY");

    if (!paystackSecret || !supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({
          error: "Missing server environment variables",
          step: "env-check",
          debug: {
            hasPaystackSecret: !!paystackSecret,
            hasSupabaseUrl: !!supabaseUrl,
            hasServiceRoleKey: !!supabaseServiceRoleKey,
          },
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.status) {
      return new Response(
        JSON.stringify({
          error: "Paystack verification failed",
          step: "paystack-verify",
          statusCode: verifyRes.status,
          details: verifyData,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const transaction = verifyData.data;

    if (transaction.status !== "success") {
      return new Response(
        JSON.stringify({
          error: "Transaction not successful",
          step: "paystack-status-check",
          transaction,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { error: paymentInsertError } = await supabase
      .from("payments")
      .upsert(
        {
          user_id: userId,
          reference: transaction.reference,
          email: transaction.customer?.email ?? null,
          amount: transaction.amount,
          currency: transaction.currency ?? "NGN",
          status: transaction.status,
          plan: "premium",
          paid_at: transaction.paid_at ?? new Date().toISOString(),
        },
        {
          onConflict: "reference",
        }
      );

    if (paymentInsertError) {
      return new Response(
        JSON.stringify({
          error: "Failed to save payment",
          step: "payment-upsert",
          details: paymentInsertError,
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ plan: "premium" })
      .eq("id", userId);

    if (profileUpdateError) {
      return new Response(
        JSON.stringify({
          error: "Failed to update profile plan",
          step: "profile-update",
          details: profileUpdateError,
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified and plan upgraded",
        step: "complete",
        reference: transaction.reference,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        step: "catch",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
