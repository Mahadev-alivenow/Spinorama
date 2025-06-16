import { useState } from "react";

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  maxLength,
  disabled = false,
  className = "",
  required = false,
  helpText,
  showCount = false,
  ...props
}) {
  const [inputValue, setInputValue] = useState(value || "");
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(e);
    }
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
          required={required}
          {...props}
        />
      </div>
      
      <div className="mt-1 flex justify-between">
        {(error || helpText) && (
          <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helpText}
          </p>
        )}
        
        {showCount && maxLength && (
          <p className="text-sm text-gray-500 ml-auto">
            {inputValue.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}