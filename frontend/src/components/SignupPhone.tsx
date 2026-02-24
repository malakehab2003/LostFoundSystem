import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { SignupData } from "./SignupLayout";
import { validatePhone } from "@/lib/validation";

const SignupPhone = () => {
  const navigate = useNavigate();

  const { signupData, updateData } = useOutletContext<{
    signupData: SignupData;
    updateData: (data: Partial<SignupData>) => void;
  }>();
  const [phone, setPhone] = useState(signupData.phone || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    const result = validatePhone(phone);
    if (!result.valid) {
      setError(result.error!);
      return;
    }

    updateData({ phone });
    navigate("/signup/upload-photo");
    console.log(signupData);
  };
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
        <div className="relative flex flex-col gap-1 items-start">
          <input
            type="text"
            placeholder="123-456-7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-4 border border-slate-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400"
          />
          {error && (
            <p className="text-red-500 mb-2 text-[12px] font-semibold tracking-wide">
              {error}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-6 flex justify-center">
          <Button
            variant={"default"}
            size={"lg"}
            onClick={handleNext}
            className={`px-12 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer`}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupPhone;
