'use client';

import { KeyboardEvent, useState } from 'react';

interface TagInputProps {
  name: string;
  label: string;
  initialValues: string[];
  suggestions: readonly string[];
  placeholder: string;
}

export default function TagInput({ name, label, initialValues, suggestions, placeholder }: TagInputProps) {
  const [values, setValues] = useState(initialValues);
  const [draft, setDraft] = useState('');

  function addValue(value: string) {
    const next = value.trim().replace(/,$/, '').trim();
    if (!next || values.includes(next)) {
      setDraft('');
      return;
    }
    setValues([...values, next]);
    setDraft('');
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addValue(draft);
    } else if (event.key === 'Backspace' && !draft && values.length) {
      setValues(values.slice(0, -1));
    }
  }

  return (
    <label className="tag-input-field">
      {label}
      <div className="tag-input-box">
        <div className="tag-list">
          {values.map((value) => (
            <span className="profile-tag" key={value}>
              {value}
              <button type="button" onClick={() => setValues(values.filter((item) => item !== value))} aria-label={`Remove ${value}`}>
                ×
              </button>
            </span>
          ))}
          <input
            value={draft}
            list={`${name}-suggestions`}
            placeholder={placeholder}
            onChange={(event) => {
              const value = event.target.value;
              if (suggestions.includes(value)) addValue(value);
              else setDraft(value);
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        <datalist id={`${name}-suggestions`}>
          {suggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}
        </datalist>
      </div>
      <input type="hidden" name={name} value={values.join(',')} readOnly />
    </label>
  );
}
