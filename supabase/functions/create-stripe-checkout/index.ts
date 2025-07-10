import Stripe from 'https://esm.sh/stripe@12.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
Deno.serve(async (req)=>{
  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2022-11-15'
  });
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', {
    status: 401
  });
  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return new Response('Unauthorized', {
    status: 401
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: [
      'card'
    ],
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'IgniteKit Core License'
          },
          unit_amount: 15900 // 159.00 €
        }
      }
    ],
    success_url: 'https://your-app.com/success',
    cancel_url: 'https://your-app.com/cancel',
    metadata: {
      user_id: user.id
    }
  });
  return new Response(JSON.stringify({
    url: session.url
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
});
