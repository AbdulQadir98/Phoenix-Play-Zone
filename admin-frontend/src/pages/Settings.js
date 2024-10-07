import React from "react";
import { useState } from "react";
import { PASSWORD } from "../constants";
import AdminSettings from "../components/AdminSettings";

const Settings = () => {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    setEnteredPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
      setEnteredPassword(""); // clear input
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="text-center">
        {isAuthenticated ? (
          <AdminSettings/>
        ) : (
          <>
            <div className="text-3xl text-gray-600 mb-6">Admin Access Required</div>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={enteredPassword}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                className="p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="ml-2 p-2 bg-gray-600 text-white rounded"
              >
                Submit
              </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        )}
      </div>
    </div>

    // <div className="flex justify-center items-center p-4">
    //   <div className="relative z-10 text-center">
    //     <h1 className="text-4xl mb-4">Admin Access Required</h1>
    //   </div>
    // </div>
  );
};

export default Settings;
