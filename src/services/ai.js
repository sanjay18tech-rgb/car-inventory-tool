
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const parseCarDataWithAI = async (rowText, systemPrompt) => {
  const fullPrompt = `
${systemPrompt}

You are an AI that parses a single CSV row into a JSON object.

Rules:
- Respond with ONLY valid JSON.
- Do NOT wrap in \`\`\`.
- Include keys: make, model, year, color, status, price if possible.

Row data: "${rowText}"
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful JSON-only assistant." },
          { role: "user", content: fullPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    if (!responseText || responseText.trim() === "") {
      throw new Error("Empty response from API");
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("Non-JSON response received:", responseText);
      throw new Error(`Expected JSON but got ${contentType}. Response: ${responseText.substring(0, 200)}`);
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", responseText);
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }

    console.log("Groq raw response:", data);

    if (data.error) {
      throw new Error(data.error.message || "Groq API error");
    }

    const content = data.choices?.[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error("Groq Error:", error);
    return { error: error.message || "Failed to parse Groq AI response" };
  }
};
