import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const SignupPhone = () => {
  const [step, setStep] = useState(3); // Track current step for progress bar
  const [formData, setFormData] = useState({ phoneNumber: "" });

  // Progress percentage based on 3 steps (example)
  const progressWidth = (step / 3) * 100;

  const isFormValid = formData.phoneNumber.trim() !== "";
  console.log(isFormValid);
  return (
    <div className="max-w-2xl mx-auto px-6 pt-20 flex flex-col items-center">
      {/* Header Text */}
      <h1 className="text-4xl font-bold text-violet-900 text-center mb-4">
        What's your number?
      </h1>

      <p className="text-slate-700 text-center text-sm md:text-base leading-relaxed max-w-lg mb-10">
        We'll never share your number publicly and will only contact you with
        updates about the pet you register.
      </p>

      {/* Form Fields */}
      <div className="w-full max-w-md space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="123-456-7890"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="w-full px-4 py-4 border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Action Button */}
        <div className="pt-6 flex justify-center">
          <Link to="/signup/upload-photo" className="text-center">
            <Button
              variant={"default"}
              size={"lg"}
              disabled={!isFormValid}
              onClick={() => setStep(step + 1)}
              className={`px-12 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                !isFormValid && "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPhone;
