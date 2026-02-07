import React from "react";
import { Info, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
const DashInfo = () => {
  const userData = [
    {
      title: "Email",
      value: "haithambahr31@gmail.com",
      description: "",
      editable: false,
    },
    { title: "Name", value: "Haitham Bahr", description: "", editable: true },
    {
      title: "Phone",
      value: "(201) 097-7122",
      description:
        "We'll never share your number publicly and will only contact you with updates about the item you register.",
      editable: true,
    },
    {
      title: "Date of Birth",
      value: "January 1, 1990",
      description: "We'll never share your date of birth publicly.",
      editable: true,
    },
    { title: "Gender", value: "Male", description: "", editable: true },
    { title: "password", value: "********", description: "", editable: true },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <main className="max-w-xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-center gap-5 mb-10">
          {/* Navigation Header */}
          <Link to={"/dashboard"} className=" mx-auto flex items-center">
            <button className="p-3 -ml-2 hover:bg-slate-50 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-violet-500" />
            </button>
          </Link>
          <h1 className="text-5xl font-bold text-center text-[#002D5B] tracking-wide">
            Personal information
          </h1>
        </div>

        <div className="space-y-4 divide-y-2 divide-slate-100">
          {/* User Data Section */}

          {userData.map((item, index) => (
            <section
              key={index}
              className="pb-3 flex justify-between items-start"
            >
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-slate-700 mb-1">
                  {item.title}
                </h2>

                {item.description && (
                  <p className="text-slate-400 text-sm mb-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
                <p className="text-slate-500 text-sm">{item.value}</p>
              </div>
              {item.editable && (
                <Button
                  size={"default"}
                  variant="ghost"
                  className="text-slate-700 cursor-pointer underline underline-offset-2 hover:text-primary"
                >
                  Edit
                </Button>
              )}
            </section>
          ))}
          {/* Delete Account */}
          <section className="pt-2">
            <Button
              size={"default"}
              variant="destructive"
              className="cursor-pointer"
            >
              Delete Account
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashInfo;
