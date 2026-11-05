import { useRef } from 'react';

export default function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter your name"
      />

      <button onClick={handleFocus}>
        Focus Input
      </button>
    </div>
  );
}