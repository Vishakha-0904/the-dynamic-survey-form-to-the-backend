import React, { useEffect, useReducer, useState } from "react";
import QuestionBuilder from "./QuestionBuilder";
import FormPreview from "./FormPreview";
import "./SurveyBuilder.css";

const initialState = {
  questions: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return { ...state, questions: action.payload.questions || [] };
    case "ADD_QUESTION":
      return {
        ...state,
        questions: [
          ...state.questions,
          {
            id: Date.now().toString(),
            label: "",
            type: "Text",
            options: [],
          },
        ],
      };
    case "UPDATE_QUESTION":
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.payload.id ? { ...q, ...action.payload.data } : q
        ),
      };
    case "DELETE_QUESTION":
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== action.payload.id),
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function SurveyBuilder() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [formId, setFormId] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("survey-form");
    if (saved) {
      const parsed = JSON.parse(saved);
      dispatch({ type: "LOAD", payload: parsed });
      setFormId(parsed.formId || Date.now().toString());
    } else {
      setFormId(Date.now().toString());
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(
      "survey-form",
      JSON.stringify({ formId, questions: state.questions })
    );
  }, [state.questions, formId]);

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the builder? This will delete all questions and answers."
      )
    ) {
      dispatch({ type: "RESET" });
      localStorage.removeItem("survey-form");
      localStorage.removeItem("survey-answers");
      setFormId(Date.now().toString());
    }
  };

  return (
    <div className="survey-builder">
      <div>
        <h2>Survey Builder</h2>
        <button onClick={() => dispatch({ type: "ADD_QUESTION" })}>
          Add New Question
        </button>
        <button style={{ marginLeft: 10 }} onClick={handleReset}>
          Reset Builder
        </button>

        {state.questions.length === 0 && (
          <p style={{ marginTop: 10 }}>
            Add questions to start building your survey.
          </p>
        )}

        {state.questions.map((q) => (
          <QuestionBuilder
            key={q.id}
            question={q}
            onChange={(data) =>
              dispatch({ type: "UPDATE_QUESTION", payload: { id: q.id, data } })
            }
            onDelete={() =>
              dispatch({ type: "DELETE_QUESTION", payload: { id: q.id } })
            }
          />
        ))}
      </div>

      <div>
        <h2>Live Preview & Submit</h2>
        <FormPreview formId={formId} questions={state.questions} />
      </div>
    </div>
  );
}



