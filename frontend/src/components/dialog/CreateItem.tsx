import {
  Building2,
  Captions,
  Landmark,
  List,
  MessageSquare,
  Pin,
  Shapes,
} from "lucide-react";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

import { useCreateItem } from "@/features/items/hooks/useCreateItem";
import { useGovernments } from "@/features/governments/hooks/useGovernments";
import { useCities } from "@/features/cities/hooks/useCities";
import { useGetItemCategory } from "@/features/auth/itemCategory/hooks/useGetItemCategory";
import {
  CreateItemSchema,
  type City,
  type Government,
  type Item,
  type ItemCategory,
} from "@/features/items/itemsType";
import CustomFormField from "../CustomerFormField";
import { FormFieldType } from "../DashItemInfo";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  item?: Item;
  //   type: "create" | "edit";
};

export const ItemDialog = ({ item }: Props) => {
  const steps = [
    {
      title: "Step 1",
      description: "",
      fields: ["title", "government_id", "city_id", "place"],
    },
    {
      title: "Step 2",
      description: "",
      fields: ["type", "category_id", "date", "description", "images_url"],
    },
  ];
  const { type } = useParams();
  const [currentStep, setCurrentStep] = useState(0);

  const currentForm = steps[currentStep];

  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const { createItem, isPending } = useCreateItem();
  const { governments } = useGovernments();
  const { cities } = useCities();
  const { itemCategories } = useGetItemCategory();
  const navigate = useNavigate();
  const schema =
    type === "create" ? CreateItemSchema : CreateItemSchema.partial();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: item?.title ?? "",
      place: item?.place ?? "",
      description: item?.description ?? "",
      category_id: item?.item_category_id ?? undefined,
      type: item?.type ?? "lost",
      date: item?.date ?? "",
      government_id: item?.government_id ?? null,
      city_id: item?.city_id ?? null,
      images_url: item?.images ?? [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const selectedGovernment = form.watch("government_id");
  const filteredCities = cities?.filter(
    (city) => city.government_id === selectedGovernment,
  );
  const handleNextButton = async () => {
    const currentFields = steps[currentStep].fields;

    const isValid = await form.trigger(currentFields);

    if (isValid && !isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBackButton = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  function onSubmit(data: z.infer<typeof schema>) {
    console.log(data);
    if (type === "create") {
      console.log("Create:", data);
      createItem(data);
    }

    if (type === "edit") {
      console.log("Update:", data);
    }
    navigate("/dashboard");
  }

  const renderCurrentStepContent = () => {
    return (
      <FieldGroup>
        {currentStep === 0 && (
          <>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="title"
              label="Title"
              icon={Captions}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="government_id"
                  label="Government"
                  options={governments?.map((gov: Government) => ({
                    value: gov.id,
                    label: gov.name,
                  }))}
                  onchange={() => form.setValue("city_id", null)}
                  icon={Landmark}
                />
              </div>
              <div className="space-y-6">
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
            </div>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="place"
              label="Place"
              icon={Pin}
              placeholder="Describe exactly where the item was lost, e.g., in a café or the center mall."
            />
          </>
        )}

        {currentStep === 1 && (
          <>
            {" "}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  placeholder="Did you find or lose this item?"
                  name="type"
                  label="Type"
                  icon={Shapes}
                  options={[
                    { label: "Lost", value: "lost" },
                    { label: "Found", value: "found" },
                  ]}
                />
              </div>
              <div className="space-y-6">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="category_id"
                  label="Category"
                  options={itemCategories?.map((category: ItemCategory) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  icon={List}
                />
              </div>
            </div>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="date"
              label="Date"
              placeholder="Select date of loss or finding"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              placeholder="Describe the item's details if it has any, e.g. black wallet with a scratch in the middle."
              name="description"
              label="Description"
              icon={MessageSquare}
            />
            <CustomFormField
              fieldType={FormFieldType.FILE_INPUT}
              control={form.control}
              name="images_url"
              label="Item Images"
            />
          </>
        )}
      </FieldGroup>
    );
  };

  return (
    <Card className="max-w-[540px] mx-auto my-10 bg-slate-50">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle>{currentForm.title}</CardTitle>
            <p className="text-muted-foreground text-xs">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <CardDescription>{currentForm.description}</CardDescription>
        </div>
        <Progress value={progress} />
      </CardHeader>
      <CardContent>
        <form id="item-dialog" onSubmit={form.handleSubmit(onSubmit)}>
          {renderCurrentStepContent()}
        </form>
      </CardContent>
      <CardFooter>
        <Field className="justify-between" orientation="horizontal">
          {currentStep > 0 && (
            <Button type="button" variant="ghost" onClick={handleBackButton}>
              <ChevronLeft /> Back
            </Button>
          )}
          {!isLastStep && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleNextButton}
            >
              Next
              <ChevronRight />
            </Button>
          )}
          {isLastStep && (
            <Button type="submit" disabled={false} form="item-dialog">
              {isPending ? (
                <>
                  Saving...
                  <Spinner size="sm" />
                </>
              ) : type === "create" ? (
                "Create Item"
              ) : (
                "Update Item"
              )}
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
};
