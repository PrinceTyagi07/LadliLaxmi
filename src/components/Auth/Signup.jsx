import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referredBy: "", // This is needed by the backend
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password and confirm password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    
    // Basic validation for required fields that the backend expects
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword ) {
      setError("All required fields are missing.");
      setLoading(false);
      return;
    }

    try {
      const signupResponse = await axios.post(
        "http://localhost:4001/api/v1/auth/register",
        {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          referredBy: formData.referredBy || null,
          name: formData.name,
        },
        {
          headers: {
            "Content-Type": "application/json", // Specify the content type
          },
        }
      );

      if (signupResponse.data.success) {
        console.log("Registration successful:", signupResponse.data);
        // Navigate to the home page on successful signup
        navigate("/account");
      } else {
        // If backend sends a specific message for failure
        setError(signupResponse.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration ", error);
      // Check if the error has a response from the server with a message
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during registration. Please try again. Check your backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 py-20 text-gray-900">
      <div className="shadow-lg rounded-2xl p-6 w-full max-w-2xl bg-white">
        <h2 className="text-3xl font-extrabold text-center mb-6">Sign Up</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 md:grid md:grid-cols-2"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition duration-300"
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition duration-300"
          />

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition duration-300 w-full pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                // Eye icon (inline SVG)
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                // Eye-off icon (inline SVG)
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.06 18.06 0 0 1 5.47-5.12M12 10a2 2 0 0 0-3.18 2.18M2.06 2.06 22 22"/>
                  <path d="M19.73 14.73A10.5 10.5 0 0 0 22 12c0-3-3-7-10-7C9.31 5 7.08 5.75 5.06 7.06"/>
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition duration-300 w-full pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                // Eye icon (inline SVG)
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                // Eye-off icon (inline SVG)
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.06 18.06 0 0 1 5.47-5.12M12 10a2 2 0 0 0-3.18 2.18M2.06 2.06 22 22"/>
                  <path d="M19.73 14.73A10.5 10.5 0 0 0 22 12c0-3-3-7-10-7C9.31 5 7.08 5.75 5.06 7.06"/>
                </svg>
              )}
            </button>
          </div>

          <input
            type="text"
            name="referredBy"
            placeholder="Referrer ID "
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition duration-300"
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center col-span-2 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-amber-300 col-span-2 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {loading ? "Please wait..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
