import React from "react";
import "./OptionInput.css";

export default function OptionInput({ value, onChange, onDelete }) {
  return (
    <div className="option-input">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Option text"
      />
      <button type="button" onClick={onDelete} title="Delete option">
        &times;
      </button>
    </div>
  );
}
