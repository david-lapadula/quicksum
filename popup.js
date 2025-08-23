document.getElementById("summarizeBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject script to get selected text
  const [{ result: selectedText }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  });

  if (!selectedText) {
    document.getElementById("summary").textContent = "No text selected.";
    return;
  }

  document.getElementById("summary").textContent = "Summarizing...";

  // Call OpenAI API
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
          { role: "user", content: `Summarize this: ${selectedText}` }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content;

    document.getElementById("summary").textContent = summary || "No summary received.";
  } catch (error) {
    console.error(error);
    document.getElementById("summary").textContent = "Error during summarization.";
  }
});