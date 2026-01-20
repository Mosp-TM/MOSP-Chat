export async function chatWithOllama(
  model: string,
  messages: Array<{ role: string; content: string }>,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

    if (!reader) {
      throw new Error("No response body");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            fullResponse += json.message.content;
            onChunk?.(json.message.content);
          }
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("Ollama chat error:", error);
    throw error;
  }
}
