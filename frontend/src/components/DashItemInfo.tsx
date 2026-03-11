import { useState } from "react";
import {
  Building2,
  Calendar,
  Captions,
  Landmark,
  LandPlotIcon,
  List,
  MessageSquare,
  Shapes,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import CustomFormField from "./CustomerFormField";
import { Form } from "./ui/form";
import { FieldGroup } from "./ui/field";
import { useParams } from "react-router-dom";
import { useEditItem } from "@/features/items/hooks/useEditItem";
import {
  EditItemSchema,
  type City,
  type EditItemFormSchema,
  type Government,
  type ItemCategory,
} from "@/features/items/itemsType";
import { useGetItem } from "@/features/items/hooks/useGetItem";
import { useGetItemCategory } from "@/features/auth/itemCategory/hooks/useGetItemCategory";
import { useGovernments } from "@/features/governments/hooks/useGovernments";
import { useCities } from "@/features/cities/hooks/useCities";
import { Spinner } from "./ui/spinner";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  PASSWORD = "password",
  EMAIL = "email",
  FILE_INPUT = "file",
}
const DashItemInfo = () => {
  const { itemId } = useParams();
  const { governments } = useGovernments();
  const { cities } = useCities();
  const { item, isLoading } = useGetItem(Number(itemId!));
  const { itemCategories } = useGetItemCategory();

  const { editItem, isPending } = useEditItem();
  const form = useForm<EditItemFormSchema>({
    resolver: zodResolver(EditItemSchema),
    defaultValues: {
      title: item?.title ?? "",
      place: item?.place ?? "",
      description: item?.description ?? "",
      category_id: item?.item_category_id ?? undefined,
      type: item?.type ?? "lost",
      date: item?.date ? new Date(item.date) : new Date(),
      government_id: item?.government_id ?? undefined,
      city_id: item?.city_id ?? undefined,
      images_urls: item?.images ?? [],
    },
  });
  const selectedGovernment = form.watch("government_id");
  const filteredCities = cities?.filter(
    (city) => city.government_id === selectedGovernment,
  );
  async function onSubmit(data: EditItemFormSchema) {
    try {
      console.log(data);
      editItem({ itemId: Number(itemId), data });
    } catch (error) {
      console.error("Error submitting form:", error);
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
              {isLoading ? (
                <div className="text-center py-20 justify-center items-center">
                  <Spinner className="w-8 h-8 place-self-center text-primary" />
                </div>
              ) : (
                <>
                  <FieldGroup>
                    <CustomFormField
                      fieldType={FormFieldType.FILE_INPUT}
                      control={form.control}
                      name="images"
                      label="Item Images"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="title"
                      label="Title"
                      placeholder="Enter item name"
                      icon={Captions}
                    />
                    <div className="flex flex-col gap-6 lg:flex-row">
                      <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="government_id"
                        label="Government"
                        options={governments?.map((gov: Government) => ({
                          value: gov.id,
                          label: gov.name,
                        }))}
                        onchange={() => form.setValue("city_id", undefined)}
                        icon={Landmark}
                      />
                      <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="city_id"
                        label="City"
                        options={filteredCities?.map((city: City) => ({
                          value: city.id,
                          label: city.name,
                        }))}
                        disabled={!selectedGovernment}
                        icon={Building2}
                      />
                    </div>
                    <div className="flex flex-col gap-6 lg:flex-row">
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="place"
                        label="Place"
                        placeholder="Enter place where item was lost/found"
                        icon={LandPlotIcon}
                      />
                      <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="category_id"
                        label="Category"
                        options={itemCategories?.map(
                          (category: ItemCategory) => ({
                            value: category.id,
                            label: category.name,
                          }),
                        )}
                        icon={List}
                      />
                    </div>
                    <div className="flex flex-col gap-6 lg:flex-row">
                      <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name="date"
                        label="Date"
                        placeholder="Select date of loss or finding"
                      />
                      <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="type"
                        label="Type"
                        icon={Shapes}
                        options={[
                          { label: "Lost", value: "lost" },
                          { label: "Found", value: "found" },
                        ]}
                      />
                    </div>
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="description"
                      label="Description"
                      icon={MessageSquare}
                    />
                  </FieldGroup>

                  <Button
                    type="submit"
                    disabled={isPending}
                    size={"lg"}
                    className="disabled:opacity-50 disabled:cursor-not-allowed w-full align-center self-center mx-auto"
                  >
                    {isPending ? "Loading..." : "Save Changes"}
                  </Button>
                </>
              )}
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default DashItemInfo;
