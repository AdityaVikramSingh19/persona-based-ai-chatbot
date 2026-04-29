import { useState, useRef, useEffect } from "react";
import { personas } from "./personas";
import "./App.css";

const API_KEY = process.env.REACT_APP_AICREDITS_API_KEY;

export default function App() {
  const [activePersona, setActivePersona] = useState(0); //which persona is currently active 
  const [messages, setMessages] = useState([]); //the history of conversation with ai 
  const [input, setInput] = useState(""); //input text box 
  const [isLoading, setIsLoading] = useState(false); //the loading, which is waiting for ai to response
  const [error, setError] = useState(""); // error msg if api fails
  const messagesEndRef = useRef(null); //used to auto scroll to go bottom of the chat , as reference

  const persona = personas[activePersona]; //what is the current active persona get it from the array of personas based on the activePersona index

  useEffect(() => { //autoscroll feature when the loading state or the message changes it goes to the bottom of the page
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function switchPersona(index) { // when we switch persona convesation history is delete 
    setActivePersona(index); // new persona is active
    setMessages([]);          //  clears conversation history
    setError(""); //error is reset
    setInput(""); // input box is cleared
  }

  async function sendMessage(text) {
    const userText = text || input.trim(); // takes the input and trim the extra spaces 
    if (!userText || isLoading) return; //basecase
    const userMessage = { role: "user", content: userText };// Build the new user message object
    const updatedMessages = [...messages, userMessage];// Add it to the messages array
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: persona.systemPrompt
            },
            ...updatedMessages
          ]
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "API error");//error is handled here 
      }

      const data = await response.json(); //reply from ai is taken here in jason form
      if (!response.ok) { //this handles silent error like 401,429
        console.error("API Error:", data);
        throw new Error(data.error?.message || "API request failed");
      }
      const assistantReply = data.choices[0].message.content; // we get the reply of the assistant here(the first message is the current reply)

      setMessages([ // Add the AI's reply to the conversation history
        ...updatedMessages,
        { role: "assistant", content: assistantReply },
      ]);
    } catch (err) {// shows error
      setError("Something went wrong. Check your API key or try again.");
      console.error(err);
    } finally {// turn off loading, whether success or failure    
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) { //pressing enter will send the text and shift + enter will create a new line in the input box
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
  // Rendering the UI
  return (
    <div className="app">

      {/* ── TOP HEADER ── */}
      <div className="app-header">
        <div className="app-title">
          <span className="scaler-badge">Scaler</span>
          <span>Persona Chat</span>
        </div>
        <p className="app-subtitle">Talk to your instructors, anytime</p>
      </div>

      {/* ── PERSONA TABS ── */}
      {/* These are the 3 buttons to switch between teachers */}
      <div className="persona-tabs">
        {personas.map((p, i) => (
          <button
            key={p.id}
            className={`tab-btn ${activePersona === i ? "active" : ""}`}
            style={activePersona === i ? {
              borderColor: p.color,
              color: p.color,
              background: p.lightColor,
            } : {}}
            onClick={() => switchPersona(i)}
          >
            <span
              className="tab-avatar"
              style={{ background: activePersona === i ? p.color : "#e5e7eb", color: activePersona === i ? "white" : "#6b7280" }}
            >
              {p.initials}
            </span>
            <span className="tab-name">{p.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* ── CHAT WINDOW ── */}
      <div className="chat-container">

        {/* Active persona header */}
        <div className="chat-header" style={{ borderBottom: `3px solid ${persona.color}` }}>
          <div className="chat-avatar" style={{ background: persona.color }}>
            {persona.initials}
          </div>
          <div>
            <div className="chat-name">{persona.name}</div>
            <div className="chat-role">{persona.role}</div>
          </div>
          <div className="online-dot" />
        </div>

        {/* Messages area */}
        <div className="messages">

          {/* Welcome message when no messages yet */}
          {messages.length === 0 && (
            <div className="welcome">
              <div className="welcome-avatar" style={{ background: persona.lightColor, color: persona.color }}>
                {persona.initials}
              </div>
              <p className="welcome-text">
                Hey! I'm <strong>{persona.name}</strong>. Ask me anything.
              </p>

              {/* SUGGESTION CHIPS ─ quick-start questions */}
              {/* These are defined per-persona in personas.js */}
              <div className="chips">
                {persona.chips.map((chip) => (
                  <button
                    key={chip}
                    className="chip"
                    style={{ borderColor: persona.color, color: persona.color }}
                    onClick={() => sendMessage(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Render each message in the conversation */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.role === "user" ? "user-msg" : "bot-msg"}`}
            >
              {msg.role === "assistant" && (
                <div className="msg-avatar" style={{ background: persona.color }}>
                  {persona.initials}
                </div>
              )}
              <div
                className="bubble"
                style={msg.role === "assistant" ? { borderLeft: `3px solid ${persona.color}` } : {}}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* TYPING INDICATOR — shown while API call is in progress */}
          {isLoading && (
            <div className="message bot-msg">
              <div className="msg-avatar" style={{ background: persona.color }}>
                {persona.initials}
              </div>
              <div className="bubble typing-bubble">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}

          {/* Error message — graceful error handling */}
          {error && (
            <div className="error-msg">
              ⚠ {error}
            </div>
          )}

          {/* Invisible element at the bottom — used for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* ── INPUT AREA ── */}
        <div className="input-area">
          <textarea
            className="input-box"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${persona.name.split(" ")[0]} something...`}
            rows={1}
            disabled={isLoading}
          />
          <button
            className="send-btn"
            style={{ background: persona.color }}
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
          >
            {/* Send arrow icon */}
            <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
