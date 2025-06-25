import React, { useState, useEffect } from "react";
import OptionInput from "./OptionInput";
import "./QuestionBuilder.css";

export default function QuestionBuilder({ question, onChange, onDelete }) {
  const [label, setLabel] = useState(question.label);
  const [type, setType] = useState(question.type);
  const [options, setOptions] = useState(question.options || []);
  const [errors, setErrors] = useState({ label: "", options: "" });

  useEffect(() => {
    onChange({ label, type, options });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, type, options]);

  useEffect(() => {
    // validate label
    if (!label.trim()) setErrors((e) => ({ ...e, label: "Label cannot be empty" }));
    else setErrors((e) => ({ ...e, label: "" }));

    // validate options if type requires it
    if ((type === "Checkbox" || type === "Dropdown") && options.length === 0) {
      setErrors((e) => ({ ...e, options: "At least one option required" }));
    } else {
      setErrors((e) => ({ ...e, options: "" }));
    }
  }, [label, type, options]);

  function handleOptionChange(idx, val) {
    const newOpts = [...options];
    newOpts[idx] = val;
    setOptions(newOpts);
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  function removeOption(idx) {
    const newOpts = options.filter((_, i) => i !== idx);
    setOptions(newOpts);
  }

  return (
    <div className="question-builder">
      <label>
        Question Label:
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter question label"
        />
      </label>
      {errors.label && <div className="error">{errors.label}</div>}

      <label style={{ marginTop: 10 }}>
        Question Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Checkbox">Checkbox</option>
          <option value="Dropdown">Dropdown</option>
        </select>
      </label>

      {(type === "Checkbox" || type === "Dropdown") && (
        <div style={{ marginTop: 10 }}>
          <label>Options:</label>
          {options.map((opt, idx) => (
            <OptionInput
              key={idx}
              value={opt}
              onChange={(val) => handleOptionChange(idx, val)}
              onDelete={() => removeOption(idx)}
            />
          ))}
          {errors.options && <div className="error">{errors.options}</div>}
          <button type="button" onClick={addOption} style={{ marginTop: 5 }}>
            Add Option
          </button>
        </div>
      )}

      <div className="button-group" style={{ marginTop: 15 }}>
        <button type="button" onClick={onDelete}>
          Delete Question
        </button>
      </div>
    </div>
  );
}

