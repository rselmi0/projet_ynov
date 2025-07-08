// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { OpenAI } from "npm:openai@4.8.0";
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
});
Deno.serve(async (req)=>{
  const { prompt } = await req.json();
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });
  return new Response(JSON.stringify({
    text: response.choices[0].message.content
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    }
  });
});
