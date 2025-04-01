import type { IAIPort } from "@/core/ports/outgoing";

export class OpenAIService implements IAIPort {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async summarize(text: string): Promise<string> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes text."
            },
            {
              role: "user",
              content: `Summarize the following text in a few sentences:\n\n${text}`
            }
          ],
          max_tokens: 150
        })
      });
      
      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || "No summary available.";
    } catch (error) {
      console.error("Failed to summarize text:", error);
      return "Failed to generate summary.";
    }
  }
}
