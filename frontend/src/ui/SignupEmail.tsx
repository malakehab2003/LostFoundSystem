import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignupEmail = () => {
  const [step, setStep] = useState(2); // Track current step for progress bar
  const [formData, setFormData] = useState({ email: "" });

  // Progress percentage based on 3 steps (example)
  const progressWidth = (step / 3) * 100;

  const isFormValid = formData.email.trim() !== "";
  console.log(isFormValid);
  return (
    <div className="max-w-2xl mx-auto px-6 pt-20 flex flex-col items-center">
      {/* Header Text */}
      <h1 className="text-4xl font-bold text-[#002D5B] text-center mb-4">
        What's your email?
      </h1>

      <p className="text-slate-600 text-center text-sm md:text-base leading-relaxed max-w-lg mb-10">
        We’ll only use your email to keep in touch about the item you register.
      </p>

      {/* Form Fields */}
      <div className="w-full max-w-md space-y-4">
        <div className="relative">
          <input
            type="email"
            placeholder="yours@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-4 border border-slate-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Action Button */}
        <div className="pt-6 flex justify-center">
          <Link to="/signup/password" className="text-center">
            <button
              disabled={!isFormValid}
              onClick={() => setStep(step + 1)}
              className={`px-12 py-3 rounded-full font-semibold transition-all duration-300 ${
                isFormValid
                  ? "bg-green-500 text-white cursor-pointer hover:bg-green-600 shadow-md"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupEmail;
