import React, { useState } from "react";
import { ArrowLeft, Calendar, Lock, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "./CustomerFormField";
import { FormFieldType } from "./DashItemInfo";
import { Form } from "./ui/form";
import { SelectItem } from "./ui/select";

export const UserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dob: z.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  phone: z.string().min(1, "Phone number is required").optional(),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  // image_url: z.string().url("Invalid URL").nullable().optional(),
  // password: z.string().min(6, "Password must be at least 6 characters"),
  // addresses:
});

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
    { title: "Gender", value: "male", description: "", editable: true },
    { title: "password", value: "********", description: "", editable: true },
  ];
  const addresses = [
    {
      id: 62,
      name: "home",
      address: "23 elnahas street",
      city: "tanta",
      state: "gharbia",
      country: "egypt",
      postal_code: "21311",
      user_id: 59,
      user: {
        id: 59,
        name: "hamo",
      },
    },
    {
      id: 61,
      name: "home",
      address: "23 elnahas street",
      city: "tanta",
      state: "gharbia",
      country: "egypt",
      postal_code: "21311",
      user_id: 59,
      user: {
        id: 59,
        name: "hamo",
      },
    },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: userData[0].value,
      name: userData[1].value,
      phone: userData[2].value,
      dob: userData[3].value,
      gender: userData[4].value,
      // password: "password1234",
      // image_url: null,
    },
  });

  async function onSubmit(data: z.infer<typeof UserFormSchema>) {
    try {
      setIsSubmitting(true);
      console.log(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
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
          <h1 className="header">Personal information</h1>
        </div>

        <div className="">
          {/* User Data Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                disabled={true}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Name"
                icon={<User className="w-4 h-4 text-slate-400" />}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="phone"
                label="Phone"
                icon={<Phone className="w-4 h-4 text-slate-400" />}
              />
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="dob"
                label="Date of Birth"
                placeholder="Enter your date of birth"
                icon={<Calendar className="w-4 h-4 text-slate-400" />}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="gender"
                label="Gender"
                placeholder="Enter your gender"
                disabled={true}
              >
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </CustomFormField>
              <section className="pt-1 flex flex-col gap-2">
                <div className="flex gap-5 items-center justify-between">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size={"lg"}
                    className="disabled:opacity-50 disabled:cursor-not-allowed "
                  >
                    {isSubmitting ? "Loading..." : "Save Changes"}
                  </Button>
                  {/* Delete Account */}
                  <Button
                    size={"lg"}
                    variant="destructive"
                    disabled={isSubmitting}
                    className="cursor-pointer"
                  >
                    Delete Account
                  </Button>
                </div>
                <Link
                  to={"/dashboard/info/change-password"}
                  className="text-[12px] flex items-center gap-1 self-end"
                >
                  <Button
                    variant="link"
                    size="sm"
                    className="text-slate-400 hover:text-slate-500"
                  >
                    <Lock className="w-3.5 h-3.5" /> Change Password
                  </Button>
                </Link>
              </section>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default DashInfo;
