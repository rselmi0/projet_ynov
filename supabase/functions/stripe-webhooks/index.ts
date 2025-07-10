// ==============================
//  Supabase Edge Function: stripe-webhook
// ==============================
// supabase/functions/stripe-webhook/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from 'npm:stripe@12.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY'), {
  apiVersion: '2024-11-20'
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();
console.log('Stripe Webhook Function booted!');
Deno.serve(async (request)=>{
  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
  const signature = request.headers.get('Stripe-Signature');
  const body = await request.text();
  let receivedEvent;
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(body, signature, Deno.env.get('STRIPE_WEBHOOKS_SECRET'), undefined, cryptoProvider);
  } catch (err) {
    return new Response(err.message, {
      status: 400
    });
  }
  console.log(`🔔 Event received: ${receivedEvent.id}`);
  if (receivedEvent.type === 'payment_intent.succeeded') {
    const session = receivedEvent.data.object;
    const userId = session.metadata?.supabase_uid;
    const customerId = session.customer;
    if (userId && customerId) {
      await supabase.from('users').update({
        is_paid: true,
        stripe_customer_id: customerId
      }).eq('id', userId);
    }
  }
  return new Response(JSON.stringify({
    ok: true
  }), {
    status: 200
  });
});
