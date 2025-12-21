import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [step, setStep] = useState(1); // Track current step for progress bar
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });

  // Progress percentage based on 3 steps (example)
  const progressWidth = (step / 3) * 100;

  const isFormValid =
    formData.firstName.trim() !== "" && formData.lastName.trim() !== "";
  return (
    <div className="max-w-2xl mx-auto px-6 pt-20 flex flex-col items-center">
      {/* Header Text */}
      <h1 className="text-4xl font-bold text-[#002D5B] text-center mb-4">
        Welcome to Day3
      </h1>

      <p className="text-slate-600 text-center text-sm md:text-base leading-relaxed max-w-lg mb-10">
        Whether you need to report a lost or found item or want to register your
        item in case they go missing later — you're in the right place.
      </p>

      {/* Form Fields */}
      <div className="w-full max-w-md space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="w-full px-4 py-4 border border-slate-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full px-4 py-4 border border-slate-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Action Button */}
        <div className="pt-6 flex justify-center">
          <Link to="/signup/email" className="text-center">
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

export default Signup;
