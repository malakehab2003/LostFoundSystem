import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const SignupPhoto = () => {
  return (
    <div className="flex-1 flex flex-col items-center px-6 pt-16 md:pt-20">
      {/* Header Section */}
      <div className="max-w-2xl text-center mb-10">
        <h1 className="text-4xl font-bold text-violet-900 text-center mb-4">
          Add a photo of your item
        </h1>
        <p className="text-slate-700 text-center text-sm md:text-base leading-relaxed max-w-lg">
          Search is based on the{" "}
          <span className="font-semibold text-slate-800">main photo</span>.
          Please select a clear image of the item so our community can help you
          find it faster.
        </p>
      </div>

      {/* Upload Box */}
      <div
        className={`group w-full max-w-2xl aspect-[16/10] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer hover:bg-primary-foreground
`}
      >
        <UploadCloud className="w-16 h-16 text-primary mb-4 stroke-[1.5]" />

        <h2 className="text-2xl font-bold text-foreground group-hover:text-primary mb-1">
          Photo Upload
        </h2>

        <p className="text-slate-500 text-sm">
          Drag and drop to upload or{" "}
          <label className="text-primary font-semibold underline decoration-2 cursor-pointer">
            browse
            <input type="file" className="hidden" />
          </label>
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-6 flex justify-center">
        <Link to="/signup/upload-location" className="text-center">
          <Button
            variant={"default"}
            size={"lg"}
            // disabled={!isFormValid}
            // onClick={() => setStep(step + 1)}
            className={`px-12 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer`}
          >
            Continue
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SignupPhoto;
