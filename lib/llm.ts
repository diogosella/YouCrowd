import OpenAI from "openai";

const MODEL = process.env.YOUCROWD_MODEL || "gemini-2.5-flash";
const BASE_URL =
  process.env.YOUCROWD_BASE_URL ||
  "https://generativelanguage.googleapis.com/v1beta/openai/";

const REASONING_EFFORT =
  process.env.YOUCROWD_REASONING_EFFORT ||
  (BASE_URL.includes("generativelanguage.googleapis.com")
    ? "none"
    : MODEL.includes("gpt-oss")
    ? "low"
    : "");

let client: OpenAI | null = null;
function getClient(): OpenAI {
  const apiKey = process.env.YOUCROWD_API_KEY;
  if (!apiKey) {
    throw new Error(
      "YOUCROWD_API_KEY não configurada. Copie .env.example para .env e preencha a chave."
    );
  }
  if (!client) client = new OpenAI({ apiKey, baseURL: BASE_URL, maxRetries: 2, timeout: 60000 });
  return client;
}

interface AskLLMArgs {
  system: string;
  user: string;
  maxTokens?: number;
}

export async function askLLM({ system, user, maxTokens = 800 }: AskLLMArgs): Promise<string> {
  const body: any = {
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };
  if (!BASE_URL.includes("api.anthropic.com")) body.response_format = { type: "json_object" };
  if (REASONING_EFFORT) body.reasoning_effort = REASONING_EFFORT;

  const res = await getClient().chat.completions.create(body);
  return res.choices?.[0]?.message?.content || "";
}

export function extractJSON(text: string): any {
  if (!text) throw new Error("Resposta vazia da IA.");
  const t = text.trim().replace(/```json/gi, "").replace(/```/g, "").trim();
  const fa = t.indexOf("[");
  const fo = t.indexOf("{");
  let start: number;
  let close: string;
  if (fa !== -1 && (fo === -1 || fa < fo)) {
    start = fa;
    close = "]";
  } else if (fo !== -1) {
    start = fo;
    close = "}";
  } else {
    throw new Error("A IA não retornou JSON válido.");
  }
  return JSON.parse(t.slice(start, t.lastIndexOf(close) + 1));
}
