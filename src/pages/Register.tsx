import { useState } from "react";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ /* your registration data */ }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "rate-limited") {
          setErrorMessage("Too many requests. Please try again later.");
        } else {
          setErrorMessage(data.message || "Something went wrong!");
        }
        return;
      }

      // Registration success logic here
      alert("Registered successfully!");

    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {/* Your form fields here */}
        <button type="submit">Register</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Register;
