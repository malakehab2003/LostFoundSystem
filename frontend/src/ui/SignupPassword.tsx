import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignupPassword = () => {
  const [step, setStep] = useState(3); // Track current step for progress bar
  const [formData, setFormData] = useState({ password: "" });

  // Progress percentage based on 3 steps (example)
  const progressWidth = (step / 3) * 100;

  const isFormValid = formData.password.trim() !== "";
  console.log(isFormValid);
  return (
    <div className="max-w-2xl mx-auto px-6 pt-20 flex flex-col items-center">
      {/* Header Text */}
      <h1 className="text-4xl font-bold text-[#002D5B] text-center mb-4">
        Enter your password
      </h1>

      <p className="text-slate-600 text-center text-sm md:text-base leading-relaxed max-w-lg mb-10">
        Choose a strong password to keep your account secure.
      </p>

      {/* Form Fields */}
      <div className="w-full max-w-md space-y-4">
        <div className="relative">
          <input
            type="password"
            placeholder="123123123"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-4 border border-slate-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Action Button */}
        <div className="pt-6 flex justify-center">
          <Link to="/login" className="text-center">
            <button
              disabled={!isFormValid}
              className={`px-12 py-3 rounded-full font-semibold transition-all duration-300 ${
                isFormValid
                  ? "bg-green-500 text-white cursor-pointer hover:bg-green-600 shadow-md"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPassword;
