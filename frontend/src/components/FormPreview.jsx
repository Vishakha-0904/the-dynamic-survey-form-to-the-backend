// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./FormPreview.css";

// export default function FormPreview({ formId, questions }) {
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const navigate = useNavigate();

//   // Load saved answers on mount or formId change
//   useEffect(() => {
//     const savedAnswers =
//       JSON.parse(localStorage.getItem("survey-answers") || "{}") || {};
//     if (savedAnswers[formId]) {
//       setAnswers(savedAnswers[formId].answers || {});
//       setSubmitted(true);
//     } else {
//       setAnswers({});
//       setSubmitted(false);
//     }
//   }, [formId]);

//   // Reset answers if questions change (and no saved submission)
//   useEffect(() => {
//     if (!submitted) setAnswers({});
//   }, [questions, submitted]);

//   function handleChange(qId, value) {
//     setAnswers((prev) => ({ ...prev, [qId]: value }));
//   }

//   function handleCheckboxChange(qId, option) {
//     setAnswers((prev) => {
//       const arr = Array.isArray(prev[qId]) ? prev[qId] : [];
//       if (arr.includes(option)) {
//         return { ...prev, [qId]: arr.filter((v) => v !== option) };
//       } else {
//         return { ...prev, [qId]: [...arr, option] };
//       }
//     });
//   }

//   function validate() {
//     for (const q of questions) {
//       if (!q.label.trim()) return false;
//       if ((q.type === "Checkbox" || q.type === "Dropdown") && q.options.length === 0)
//         return false;
//       if (!(q.id in answers)) return false;
//       if (q.type === "Text" && !answers[q.id]?.trim()) return false;
//       if (
//         (q.type === "Checkbox" || q.type === "Dropdown") &&
//         (!answers[q.id] || answers[q.id].length === 0)
//       )
//         return false;
//     }
//     return true;
//   }

//   function handleSubmit(e) {
//     e.preventDefault();

//     if (!validate()) {
//       alert("Please fill all questions correctly before submitting.");
//       return;
//     }

//     const savedAnswers =
//       JSON.parse(localStorage.getItem("survey-answers") || "{}") || {};
//     savedAnswers[formId] = {
//       formId,
//       questions,
//       answers,
//     };
//     localStorage.setItem("survey-answers", JSON.stringify(savedAnswers));
//     setSubmitted(true);
//   }

//   function handleViewResults() {
//     navigate("/results");
//   }

//   function handleRetake() {
//     setAnswers({});
//     setSubmitted(false);
//     // Also remove saved answers for this form from localStorage
//     const savedAnswers =
//       JSON.parse(localStorage.getItem("survey-answers") || "{}") || {};
//     delete savedAnswers[formId];
//     localStorage.setItem("survey-answers", JSON.stringify(savedAnswers));
//   }

//   return (
//     <div className="form-preview">
//       {questions.length === 0 ? (
//         <p>Add questions to preview the form here.</p>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           {questions.map((q) => (
//             <div key={q.id} className="question-preview">
//               <label>
//                 <strong>{q.label || "<No Label>"}</strong>
//               </label>

//               {q.type === "Text" && (
//                 <input
//                   type="text"
//                   value={answers[q.id] || ""}
//                   onChange={(e) => handleChange(q.id, e.target.value)}
//                   disabled={submitted}
//                   placeholder="Your answer"
//                   required
//                 />
//               )}

//               {q.type === "Checkbox" && (
//                 <div>
//                   {q.options.map((opt, idx) => (
//                     <label key={idx} style={{ display: "block", marginTop: 4 }}>
//                       <input
//                         type="checkbox"
//                         value={opt}
//                         checked={
//                           Array.isArray(answers[q.id]) && answers[q.id].includes(opt)
//                         }
//                         onChange={() => handleCheckboxChange(q.id, opt)}
//                         disabled={submitted}
//                       />
//                       {opt}
//                     </label>
//                   ))}
//                 </div>
//               )}

//               {q.type === "Dropdown" && (
//                 <select
//                   value={answers[q.id] || ""}
//                   onChange={(e) => handleChange(q.id, e.target.value)}
//                   disabled={submitted}
//                   required
//                 >
//                   <option value="">-- Select --</option>
//                   {q.options.map((opt, idx) => (
//                     <option key={idx} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>
//           ))}

//           {!submitted && questions.length > 0 && (
//             <button type="submit">Submit</button>
//           )}
//           {submitted && (
//             <div className="success-msg">
//               Survey submitted successfully!
//               <button onClick={handleViewResults} type="button" style={{ marginLeft: 10 }}>
//                 View Results
//               </button>
//               <button onClick={handleRetake} type="button" style={{ marginLeft: 10 }}>
//                 Retake Survey
//               </button>
//             </div>
//           )}
//         </form>
//       )}
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPreview.css";

export default function FormPreview({ formId, questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [formId]);

  const handleChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleCheckboxChange = (qId, option) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[qId]) ? prev[qId] : [];
      if (current.includes(option)) {
        return { ...prev, [qId]: current.filter((v) => v !== option) };
      } else {
        return { ...prev, [qId]: [...current, option] };
      }
    });
  };

  const validate = () => {
    for (const q of questions) {
      if (!q.label.trim()) return false;
      if ((q.type === "Checkbox" || q.type === "Dropdown") && q.options.length === 0)
        return false;
      if (!(q.id in answers)) return false;
      if (q.type === "Text" && !answers[q.id]?.trim()) return false;
      if ((q.type === "Checkbox" || q.type === "Dropdown") && (!answers[q.id] || answers[q.id].length === 0))
        return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      alert("Please fill all questions correctly before submitting.");
      return;
    }

    const submission = { formId, questions, answers };

    // Save to localStorage (optional)
    const localStored = JSON.parse(localStorage.getItem("survey-answers") || "{}");
    localStored[formId] = submission;
    localStorage.setItem("survey-answers", JSON.stringify(localStored));

    // Save to backend
    fetch("http://localhost:5000/api/submit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(submission)
})


      .then((res) => res.json())
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit to backend.");
      });
  };

  const handleViewResults = () => {
    navigate("/results");
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    const savedAnswers = JSON.parse(localStorage.getItem("survey-answers") || "{}");
    delete savedAnswers[formId];
    localStorage.setItem("survey-answers", JSON.stringify(savedAnswers));
  };

  return (
    <div className="form-preview">
      {questions.length === 0 ? (
        <p>Add questions to preview the form here.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.map((q) => (
            <div key={q.id} className="question-preview">
              <label>
                <strong>{q.label || "<No Label>"}</strong>
              </label>

              {q.type === "Text" && (
                <input
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  disabled={submitted}
                  required
                  placeholder="Your answer"
                />
              )}

              {q.type === "Checkbox" && (
                <div>
                  {q.options.map((opt, idx) => (
                    <label key={idx} style={{ display: "block", marginTop: 4 }}>
                      <input
                        type="checkbox"
                        value={opt}
                        checked={Array.isArray(answers[q.id]) && answers[q.id].includes(opt)}
                        onChange={() => handleCheckboxChange(q.id, opt)}
                        disabled={submitted}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.type === "Dropdown" && (
                <select
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  disabled={submitted}
                  required
                >
                  <option value="">-- Select --</option>
                  {q.options.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          {!submitted && questions.length > 0 && (
            <button type="submit">Submit</button>
          )}

          {submitted && (
            <div className="success-msg">
              Survey submitted successfully!
              <button type="button" onClick={handleViewResults} style={{ marginLeft: 10 }}>
                View Results
              </button>
              <button type="button" onClick={handleRetake} style={{ marginLeft: 10 }}>
                Retake Survey
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
