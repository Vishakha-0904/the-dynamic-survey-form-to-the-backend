import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Results.css";

export default function Results() {
  const navigate = useNavigate();
  const [allAnswers, setAllAnswers] = useState({});
  const [latestForm, setLatestForm] = useState(null);

  useEffect(() => {
    // Safely parse localStorage data
    try {
      const savedAnswersRaw = localStorage.getItem("survey-answers");
      const savedAnswers = savedAnswersRaw ? JSON.parse(savedAnswersRaw) : {};

      setAllAnswers(savedAnswers);

      // Find the latest form by timestamp (assuming formId is timestamp string)
      const formIds = Object.keys(savedAnswers);
      if (formIds.length === 0) {
        setLatestForm(null);
        return;
      }

      // Sort formIds descending (newest first)
      formIds.sort((a, b) => Number(b) - Number(a));

      // Pick latest form data
      const latest = savedAnswers[formIds[0]];
      setLatestForm(latest);
    } catch (e) {
      console.error("Error loading survey answers from localStorage:", e);
      setAllAnswers({});
      setLatestForm(null);
    }
  }, []);

  if (!latestForm) {
    return (
      <div className="results">
        <h2>Survey Results</h2>
        <p>No survey answers found. Please take the survey first.</p>
        <button onClick={() => navigate("/")}>Back to Survey</button>
      </div>
    );
  }

  const { questions, answers } = latestForm;

  return (
    <div className="results">
      <h2>Survey Results (Latest Submission)</h2>

      {questions.length === 0 && <p>No questions found in this survey.</p>}

      {questions.map((q) => {
        const answer = answers[q.id];

        let displayAnswer = "";

        if (q.type === "Checkbox") {
          if (Array.isArray(answer)) displayAnswer = answer.join(", ");
          else displayAnswer = "No answer";
        } else {
          displayAnswer = answer || "No answer";
        }

        return (
          <div key={q.id} className="result-question">
            <strong>{q.label || "<No Label>"}</strong>
            <p>{displayAnswer}</p>
          </div>
        );
      })}

      <button onClick={() => navigate("/")}>Back to Survey</button>
    </div>
  );
}
