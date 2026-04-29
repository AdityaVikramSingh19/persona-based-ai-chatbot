const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/chat", async (req, res) => {
  try {
    console.log("Incoming request:", req.body);

    const apiKey = process.env.AICREDITS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "API key not found",
      });
    }

    console.log("API KEY:", apiKey);
    console.log("Sending request to AICredits...");

    const response = await axios.post(
      "https://api.aicredits.in/v1/chat/completions",
      req.body,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
        validateStatus: () => true,
      }
    );

    console.log("Response received:", response.status);

    return res.status(response.status).json(response.data);

  } catch (error) {
    console.error("AXIOS ERROR:", error.code || error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});