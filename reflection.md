# reflection.md — Assignment Reflection

**Assignment:** Persona-Based AI Chatbot
**Module:** Prompt Engineering — Scaler School of Technology

---

## What Worked

The most effective technique in this assignment was **few-shot prompting within the system prompt**. Before adding the example Q&A pairs, the personas felt generic — like the AI was playing a character from a Wikipedia summary. Once I added 3 concrete examples per persona, each with the person's actual verbal patterns and reasoning style, the responses transformed. The model wasn't just told how to speak — it was shown. That's the practical power of few-shot learning.

**Chain-of-Thought instruction** also produced measurably better responses. When I added the internal reasoning steps ("what is the user really asking beneath the surface?"), the AI stopped jumping to the first answer and instead gave more considered, layered responses. For Kshitij's persona especially — where analogy is the core mechanism — the CoT step "find an analogy before answering technically" consistently produced the right output structure.

The **persona switcher with conversation reset** was a technically clean solution. React's `useState` made it straightforward: switching persona sets a new system prompt and clears the `messages` array. The stateless nature of the Anthropic API actually helped here — each call is independent, so there's no cleanup needed on the backend.

---

## What the GIGO Principle Taught Me

GIGO — Garbage In, Garbage Out — is not abstract. I tested early versions of my prompts with a single line: "You are Anshuman Singh, co-founder of Scaler. Answer questions helpfully." The output was polite, generic, and completely indistinguishable from any other AI persona. It didn't sound like anyone.

The fix was investing in research before writing a single line of prompt. I looked at real content — talks, posts, interviews — and extracted specific things: verbal tics, recurring themes, how they frame questions, what they care about. That research is what the few-shot examples are built from. The lesson: the model can only reflect back the specificity you put in. You cannot prompt your way to an authentic persona without doing the research first.

---

## What I Would Improve

Given more time, I would make three changes:

**1. Streaming API** — Right now the response appears all at once after the API call completes. The Anthropic API supports streaming (token-by-token output). Implementing this would make conversations feel more natural — you'd see the response forming, like ChatGPT.

**2. Per-persona conversation history** — Currently, switching personas clears the conversation. A better UX would persist each persona's conversation separately, so you can switch between Anshuman and Kshitij and return to each conversation intact.

**3. Richer research** — The biggest lever for authenticity is research quality, not prompt engineering sophistication. With more time, I would transcribe actual talks, analyze LinkedIn post patterns, and build much richer few-shot examples from real quotes and real positions.

The core lesson: prompt engineering is not a technical trick. It's writing and research, combined with a clear mental model of how the AI uses what you give it.
