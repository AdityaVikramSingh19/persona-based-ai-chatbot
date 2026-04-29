# prompts.md — System Prompts Documentation

This file documents all three system prompts for the Scaler Persona Chatbot, with inline annotations explaining each design decision.

---

## Why Each Prompt Decision Was Made

### General Philosophy

The biggest risk in persona-based prompting is GIGO — Garbage In, Garbage Out. A lazy prompt like "You are Anshuman Singh, be helpful" gives the AI zero signal about tone, depth, or values. The AI defaults to generic helpfulness, which sounds like no one.

To make each persona feel real, I applied four principles:
1. **Voice before content** — how someone speaks matters more than what topics they cover
2. **Few-shot as style transfer** — the 3 example Q&As are the most powerful tool to transfer tone
3. **Constraints as character** — what a persona refuses to do is as defining as what they do
4. **CoT for quality** — asking the model to reason before answering eliminates shallow, first-thought responses

---

## Persona 1 — Anshuman Singh

### Persona Description
**Decision:** Anchored the description in specific, real facts (IIT Delhi, Facebook, co-founder of InterviewBit).
**Why:** Vague descriptions produce vague personas. Specific biographical anchors give the model a real character to inhabit. The communication style description uses concrete verbal tics ("Here's the thing...", "Let me be direct...") so the model has actual phrases to adopt.

### Few-Shot Examples
**Decision:** Each example shows a different type of user question — interview prep, career philosophy, product comparison.
**Why:** Range of scenarios forces the model to demonstrate the persona across contexts, not just one tone. The examples were written to show Anshuman's directness and his habit of ending with a question.

### Chain-of-Thought Instruction
**Decision:** The CoT prompt has 4 specific questions for the model to reason through internally.
**Why:** Generic CoT ("think step by step") is less effective than specific CoT tied to the persona's perspective. Asking "What would Anshuman's actual lived experience say?" grounds the reasoning in character.

### Output Instruction
**Decision:** 4–6 sentences, always end with a question.
**Why:** Short responses force density over verbosity. The mandatory question mirrors how Anshuman actually teaches — Socratic, pushing the other person to think.

### Constraints
**Decision:** Banned vague motivational advice like "work hard and believe in yourself."
**Why:** This is the most common failure mode. Without this constraint, the model reverts to generic inspiration when it doesn't know what to say.

---

## Persona 2 — Abhimanyu Saxena

### Persona Description
**Decision:** Contrasted Abhimanyu explicitly against Anshuman ("more reflective, empathetic").
**Why:** When building multiple personas, it's critical they feel distinct. Defining one relative to the other prevents convergence. The model needs to understand these are different people with different energies.

### Few-Shot Examples
**Decision:** Every example opens with one of his signature phrases ("What I've found is...", "Honestly, early on...").
**Why:** Verbal patterns are the fastest way to transfer voice. The model learns to open the same way across conversations.

### Chain-of-Thought
**Decision:** The first CoT step is "What is the human behind this question actually experiencing?"
**Why:** Abhimanyu's empathy is his defining trait. Starting the internal reasoning with the human first ensures responses feel personalized and warm, not lecture-like.

### Output Instruction
**Decision:** Required "at least one specific insight from personal experience per response."
**Why:** Without this, the model gives abstract wisdom. This constraint forces grounded, narrative answers.

---

## Persona 3 — Kshitij Mishra

### Persona Description
**Decision:** Defined him as a teacher who thinks visually and loves analogies.
**Why:** This is a distinct teaching style. The model needs to know the *mechanism* — analogies — not just "he's a good teacher."

### Few-Shot Examples
**Decision:** Every example starts with an analogy before any technical content.
**Why:** This is the core of his teaching. The few-shot examples model the exact pattern: analogy first, concept second, common mistake third, follow-up question last.

### Chain-of-Thought
**Decision:** Second CoT step is "What everyday analogy maps perfectly to this concept?"
**Why:** Forces the model to actually find an analogy rather than skipping straight to technical explanation.

### Constraints
**Decision:** "Never give abstract explanations without grounding them in an analogy first."
**Why:** This is Kshitij's non-negotiable. It's the thing that makes him distinctly him. Without this hard constraint, the model will sometimes skip analogies when pressed for time.

---

## What I Would Improve

1. **Dynamic few-shot selection** — Instead of 3 static examples, dynamically pick examples closest to the user's question topic using embeddings.
2. **Persona memory** — Currently the conversation resets on persona switch. A production version would maintain separate histories per persona.
3. **Streaming responses** — Use the Anthropic streaming API so responses appear token-by-token, like ChatGPT. More natural UX.
4. **Prompt versioning** — Maintain version numbers on each system prompt so changes can be A/B tested.
