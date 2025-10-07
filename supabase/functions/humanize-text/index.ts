import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, style } = await req.json();
    
    if (!text || !text.trim()) {
      return new Response(
        JSON.stringify({ error: "Text is required" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create style-specific system prompts
    const stylePrompts = {
      standard: "You are an expert at transforming AI-generated text into natural, human-like writing. Rewrite the following text to sound more authentic, conversational, and natural while maintaining the original meaning. Add subtle variations in sentence structure, use more natural transitions, and include minor imperfections that make it sound genuinely human-written.",
      academic: "You are an expert at transforming AI-generated text into academic, scholarly writing. Rewrite the following text using formal language, precise terminology, and structured arguments appropriate for academic papers. Maintain objectivity and include appropriate transitions.",
      simple: "You are an expert at simplifying complex text. Rewrite the following text using simple, clear language that anyone can understand. Use short sentences, common words, and straightforward explanations.",
      formal: "You are an expert at transforming text into formal, professional writing. Rewrite the following text using formal language, proper structure, and professional tone suitable for business or official communications.",
      informal: "You are an expert at transforming text into casual, conversational writing. Rewrite the following text using informal language, contractions, and a friendly, relaxed tone as if talking to a friend.",
      expand: "You are an expert at expanding and elaborating on text. Take the following text and expand it with more details, examples, explanations, and depth while maintaining the original message.",
      shorten: "You are an expert at condensing text. Take the following text and make it more concise while preserving all key information and the original meaning."
    };

    const systemPrompt = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.standard;

    console.log(`Processing text transformation with style: ${style}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const humanizedText = data.choices?.[0]?.message?.content;

    if (!humanizedText) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Failed to generate humanized text" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Text humanization successful");
    
    return new Response(
      JSON.stringify({ humanizedText }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in humanize-text function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
