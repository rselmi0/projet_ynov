// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

Deno.serve(async (req) => {
  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: "Missing Authorization header"
      }), {
        status: 401,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Decode JWT token directly to get user ID
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;
    
    if (!userId) {
      return new Response(JSON.stringify({
        error: "Invalid token - no user ID found"
      }), {
        status: 401,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Create Supabase client for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL"), 
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    // Get push token from users table using the decoded user ID
    const { data: profile, error: profileError } = await supabaseClient
      .from("users")
      .select("expo_push_token")
      .eq("id", userId)
      .single();

    if (profileError || !profile?.expo_push_token) {
      return new Response(JSON.stringify({
        error: "Expo push token not found",
        details: profileError?.message
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Get request body
    const { title, body } = await req.json();

    // Check if EXPO_ACCESS_TOKEN is available
    const expoToken = Deno.env.get("EXPO_ACCESS_TOKEN");
    
    if (!expoToken) {
      return new Response(JSON.stringify({
        error: "EXPO_ACCESS_TOKEN not configured"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // Send push notification to Expo
    const expoPushToken = profile.expo_push_token;
    
    const expoResponse = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${expoToken}`
      },
      body: JSON.stringify({
        to: expoPushToken,
        title,
        body
      })
    });

    const expoResult = await expoResponse.json();

    return new Response(JSON.stringify({
      success: true,
      expoResponse: expoResult
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
