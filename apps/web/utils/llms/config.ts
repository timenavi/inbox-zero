import { env } from "@/env";

export const supportsOllama = !!env.NEXT_PUBLIC_OLLAMA_MODEL;

export const DEFAULT_PROVIDER = "DEFAULT";

export const Provider = {
  OPEN_AI: "openai",
  ANTHROPIC: "anthropic",
  GOOGLE: "google",
  GROQ: "groq",
  OPENROUTER: "openrouter",
  ...(supportsOllama ? { OLLAMA: "ollama" } : {}),
};

export const Model = {
  GPT_4O: "gpt-4o",
  GPT_4O_MINI: "gpt-4o-mini",
  GPT_4_1_MINI: "gpt-4.1-mini",
  O4_MINI: "o4-mini",
  CLAUDE_3_7_SONNET_BEDROCK: env.NEXT_PUBLIC_BEDROCK_SONNET_MODEL,
  // BEDROCK_ANTHROPIC_BACKUP_MODEL:
  //   env.NEXT_PUBLIC_BEDROCK_ANTHROPIC_BACKUP_MODEL,
  CLAUDE_3_7_SONNET_ANTHROPIC: "claude-3-7-sonnet-20250219",
  CLAUDE_3_5_SONNET_OPENROUTER: "anthropic/claude-3.5-sonnet",
  CLAUDE_3_7_SONNET_OPENROUTER: "anthropic/claude-3.7-sonnet",
  CLAUDE_4_SONNET_OPENROUTER: "anthropic/claude-sonnet-4",
  GEMINI_1_5_PRO: "gemini-1.5-pro-latest",
  GEMINI_1_5_FLASH: "gemini-1.5-flash-latest",
  GEMINI_2_0_FLASH_LITE: "gemini-2.0-flash-lite",
  GEMINI_2_0_FLASH: "gemini-2.0-flash",
  GEMINI_2_0_FLASH_OPENROUTER: "google/gemini-2.0-flash-001",
  GEMINI_2_5_PRO_OPENROUTER: "google/gemini-2.5-pro-preview-03-25",
  GROQ_LLAMA_3_3_70B: "llama-3.3-70b-versatile",
  ...(supportsOllama ? { OLLAMA: env.NEXT_PUBLIC_OLLAMA_MODEL } : {}),
};

export const providerOptions: { label: string; value: string }[] = [
  { label: "Default", value: DEFAULT_PROVIDER },
  { label: "Anthropic", value: Provider.ANTHROPIC },
  { label: "OpenAI", value: Provider.OPEN_AI },
  { label: "Google", value: Provider.GOOGLE },
  { label: "Groq", value: Provider.GROQ },
  { label: "OpenRouter", value: Provider.OPENROUTER },
  ...(supportsOllama && Provider.OLLAMA
    ? [{ label: "Ollama", value: Provider.OLLAMA }]
    : []),
];

export const modelOptions: Record<string, { label: string; value: string }[]> =
  {
    [Provider.OPEN_AI]: [
      { label: "gpt-4o", value: Model.GPT_4O },
      { label: "gpt-4o-mini", value: Model.GPT_4O_MINI },
      { label: "o4-mini", value: Model.O4_MINI },
      { label: "gpt-4.1-mini", value: Model.GPT_4_1_MINI },
    ],
    [Provider.ANTHROPIC]: [
      {
        label: "Claude 3.7 Sonnet",
        value: "claude-3-7-sonnet", // used in ui only. can be either anthropic or bedrock
      },
    ],
    [Provider.GOOGLE]: [
      {
        label: "Gemini 2.0 Flash",
        value: Model.GEMINI_2_0_FLASH,
      },
      {
        label: "Gemini 2.0 Flash Lite",
        value: Model.GEMINI_2_0_FLASH_LITE,
      },
      {
        label: "Gemini 1.5 Pro",
        value: Model.GEMINI_1_5_PRO,
      },
      {
        label: "Gemini 1.5 Flash",
        value: Model.GEMINI_1_5_FLASH,
      },
    ],
    [Provider.GROQ]: [
      {
        label: "Groq Llama 3.3 70B",
        value: Model.GROQ_LLAMA_3_3_70B,
      },
    ],
    [Provider.OPENROUTER]: [],
    ...(Provider.OLLAMA && Model.OLLAMA
      ? {
          [Provider.OLLAMA]: [{ label: "Ollama", value: Model.OLLAMA }],
        }
      : {}),
  };
