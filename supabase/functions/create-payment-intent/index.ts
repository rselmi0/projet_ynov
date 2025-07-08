import Stripe from 'https://esm.sh/stripe@12.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
Deno.serve(async (req)=>{
  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2022-11-15'
  });
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', {
      status: 401
    });
  }
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return new Response('Unauthorized', {
      status: 401
    });
  }
  try {
    const { amount, currency, customer_id } = await req.json();
    if (!amount || !currency) {
      return new Response(JSON.stringify({
        error: 'Amount and currency are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    let customerId = customer_id;
    // Vérifie si un customer_id valide a été envoyé
    let isCustomerValid = false;
    if (customerId) {
      try {
        const existingCustomer = await stripe.customers.retrieve(customerId);
        if (!('deleted' in existingCustomer)) {
          isCustomerValid = true;
        }
      } catch (_) {
        isCustomerValid = false;
      }
    }
    // Si pas de customer valide, en créer un
    if (!isCustomerValid) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_uid: user.id
        }
      });
      customerId = newCustomer.id;
    }
    // Créer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      metadata: {
        supabase_uid: user.id
      }
    });
    return new Response(JSON.stringify({
      client_secret: paymentIntent.client_secret,
      customer_id: customerId
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Erreur Stripe:', err);
    return new Response(JSON.stringify({
      error: 'Erreur lors de la création du PaymentIntent'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
});
