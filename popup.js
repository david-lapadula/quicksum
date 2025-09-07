const summarizeBtn = document.getElementById("summarizeBtn");
const summaryDiv = document.getElementById("summary");
const toneDropdown = document.getElementById("tone-dropdown");
const responseTypeDropdown = document.getElementById("response-type-dropdown");

const getTone = (tone) => {
  if (tone === "formal") {
    return "Use a formal and academic tone in all summaries."
  }

  if (tone === "friendly") {
    return "Respond in a warm, friendly, and conversational tone."
  }

  if (tone === "neutral") {
    return "Stay neutral and objective in your tone and analysis."
  }

}

const getResponseType = (responseType) => {
  if (responseType === "summary") {
    return "Summarize this clearly and concisely."
  }

  if (responseType === "bullet") {
    return "Summarize this as a bullet-point list."
  }

  if (responseType === "single-sentence") {
    return "Summarize this in a single sentence."
  }
}


summarizeBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject script to get selected text
  const [{ result: selectedText }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  });

  if (!selectedText) {
    summaryDiv.textContent = "No text selected.";
    return;
  }

  summaryDiv.textContent = "Summarizing...";


  const tone = getTone(toneDropdown.value);
  const responseType = getResponseType(responseTypeDropdown.value);
  const prompt = `${responseType} ${tone}`;
  const controller = new AbortController();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_OPENAI"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant that summarizes text." },
          { role: "user", content: `${prompt}\n\n${selectedText}` }
        ],
        temperature: 0.7,
        stream: true
      }),
      signal: controller.signal
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    summaryDiv.textContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      const lines = chunk.split("\n").filter(line => line.trim().startsWith("data:"));

      for (const line of lines) {
        const data = line.replace(/^data: /, "");

        if (data === "[DONE]") {
          console.log("Stream complete.");
          break;
        }

        try {
          const json = JSON.parse(data);
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            summaryDiv.textContent += content;
          }
        } catch (err) {
          console.error("Error parsing chunk:", err);
        }
      }
    }


  } catch (error) {
    console.error(error);
    summaryDiv.textContent = "Error during summarization.";
  }
});
