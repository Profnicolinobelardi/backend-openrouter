import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api", async (req, res) => {
  const { griglia, profilo } = req.body;

    const prompt = `
  Sei un insegnante esperto.

  Adatta la griglia di valutazione al profilo.

  REGOLE:
  - Mantieni la struttura
  - Semplifica linguaggio
  - Rispondi SOLO in HTML
  - Non includere formattazione Markdown, soltanto HTML!

  GRIGLIA:
  ${griglia}

  PROFILO:
  ${profilo}
  `;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000
    })
  });

  const data = await response.json();

if (!response.ok) {
  console.error("Errore API:", data);
  throw new Error(data.error?.message || "Richiesta fallita");
}
console.log(JSON.stringify(data, null, 2));
const text =
  data?.choices?.[0]?.message?.content ??
  data?.choices?.[0]?.text ??
  "Errore";

  res.json({ risultato: text });
});

app.listen(10000, () => console.log("Server attivo"));
