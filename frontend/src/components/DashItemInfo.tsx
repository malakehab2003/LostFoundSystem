import { useState } from "react";
import {
  Building2,
  Calendar,
  Captions,
  Landmark,
  LandPlotIcon,
  List,
  Shapes,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import CustomFormField from "./CustomerFormField";
import { SelectItem } from "./ui/select";
import { Form } from "./ui/form";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  PASSWORD = "password",
}

export const ItemFormSchema = z.object({
  title: z.string().min(1, "Title is required"),

  place: z.string().min(1, "Place is required"),

  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),

  type: z.enum(["lost", "found"], {
    errorMap: () => ({ message: "Type is required" }),
  }),

  description: z.string().optional(),

  category: z.string().nullable().optional(),

  images: z.array(z.instanceof(File)).optional(),

  government: z.string().min(1, "Government is required"),
  city: z.string().min(1, "City is required"),
});

const DashItemInfo = () => {
  const itemData = [
    {
      title: "new",
      place: "transportation",
      date: "2025-12-01",
      type: "lost",
      description: "i lost this item help please",
      category: null,
      images: [],
      government: {
        id: 1,
        name_en: "Cairo",
        name_ar: "القاهرة",
      },
      city: {
        id: 1,
        name_en: "15 May",
        name_ar: "15 مايو",
      },
    },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof ItemFormSchema>>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      title: "",
      place: "",
      date: undefined,
      type: "lost",
      description: "",
      category: null,
      images: [],
      government: "",
      city: "",
    },
  });

  async function onSubmit(data: z.infer<typeof ItemFormSchema>) {
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
    <div className="min-h-screen bg-white text-slate-800">
      <main className="max-w-3xl mx-auto px-6 pb-20">
        <div className="flex justify-center items-center gap-5 mb-10">
          <h1 className="text-5xl font-bold text-center text-[#002D5B] ">
            Edit item details
          </h1>
        </div>

        <div className="space-y-4 divide-y-2 divide-slate-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="title"
                label="Title"
                placeholder="Enter item name"
                icon={<Captions className="w-4 h-4 text-slate-400" />}
              />
              <div className="flex flex-col gap-6 lg:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="government"
                  label="Government"
                  icon={<Landmark className="w-4 h-4 text-slate-400" />}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="city"
                  label="City"
                  icon={<Building2 className="w-4 h-4 text-slate-400" />}
                />
              </div>
              <div className="flex flex-col gap-6 lg:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="place"
                  label="Place"
                  placeholder="Enter place where item was lost/found"
                  icon={<LandPlotIcon className="w-4 h-4 text-slate-400" />}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="category"
                  label="Category"
                  placeholder="Enter category of item"
                  icon={<List className="w-4 h-4 text-slate-400" />}
                />
              </div>
              <div className="flex flex-col gap-6 lg:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="date"
                  label="Date"
                  placeholder="Select date of loss or finding"
                  icon={<Calendar className="w-4 h-4 text-slate-400" />}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="type"
                  label="Type"
                  icon={<Shapes className="w-4 h-4 text-slate-400" />}
                >
                  <SelectItem value="found">Found</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </CustomFormField>
              </div>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="description"
                label="Description"
                placeholder="Describe the item in detail... (optional)"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                size={"lg"}
                className="disabled:opacity-50 disabled:cursor-not-allowed w-full align-center self-center mx-auto"
              >
                {isSubmitting ? "Loading..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default DashItemInfo;
