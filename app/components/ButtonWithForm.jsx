import React, { useState } from "react";

const ButtonWithForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
      <button
        onClick={toggleForm}
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Open Form
      </button>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "60px",
            right: "20px",
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            borderRadius: "5px",
          }}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                style={{ display: "block", marginBottom: "10px" }}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                style={{ display: "block", marginBottom: "10px" }}
              />
            </label>
            <button
              type="submit"
              style={{
                padding: "10px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ButtonWithForm;
