import React, { useEffect, useState } from "react";

export default function AdminPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/submission")
      .then(res => res.ok ? res.json() : Promise.resolve(null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (data === null) return <p>Loading or no data yet...</p>;

  return (
    <div className="container">
      <h2>Admin – Last Submission</h2>
      {data.questions.map(q => (
        <div key={q.id} style={{ marginBottom: 15 }}>
          <strong>{q.label || "<No Label>"}</strong>
          <div>
            {Array.isArray(data.answers[q.id])
              ? data.answers[q.id].join(", ")
              : data.answers[q.id] || "<No Answer>"}
          </div>
        </div>
      ))}
    </div>
  );
}
