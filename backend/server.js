const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const FILE = "lastSubmission.json";

app.use(cors());
app.use(express.json());

app.post("/api/submit", (req, res) => {
  console.log("Received submission:", req.body); // <-- Add this line
  fs.writeFileSync(FILE, JSON.stringify(req.body, null, 2));
  res.json({ success: true, timestamp: Date.now() });
});



app.get("/api/submission", (req, res) => {
  try {
    const data = fs.readFileSync(FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch {
    res.status(404).json({ message: "No submission found." });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
