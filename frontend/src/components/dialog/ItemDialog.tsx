import {
  Edit3,
  Trash2,
  Plus,
  Shapes,
  Calendar,
  Captions,
  LocateIcon,
  Locate,
  LocationEdit,
  Map,
  Pin,
  Landmark,
  Building,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@heroui/react";
import * as z from "zod";

import { CreateItemSchema } from "@/features/items/itemsType";
import { FormFieldType } from "../DashItemInfo";
import { FieldGroup } from "../ui/field";
import CustomFormField from "../CustomerFormField";
import { useCreateItem } from "@/features/items/hooks/useCreateItem";
import { useCities } from "@/features/cities/hooks/useCities";
import { useGovernments } from "@/features/governments/hooks/useGovernments";
import { useGetItemCategory } from "@/features/auth/itemCategory/hooks/useGetItemCategory";

type Props = {
  item?: any; // ideally replace with Item type
  type: "create" | "edit" | "delete";
};

export function ItemDialog({ item, type }: Props) {
  const { createItem, isPending } = useCreateItem();
  const { governments } = useGovernments();
  const { cities } = useCities();
  const { itemCategories } = useGetItemCategory();
  console.log("Governments:", governments);
  console.log("Cities:", cities);
  console.log("Item Categories:", itemCategories);
  const schema =
    type === "create"
      ? CreateItemSchema
      : type === "edit"
        ? CreateItemSchema.partial()
        : z.object({});

  const form = useForm<z.infer<typeof schema>>({
    resolver: type !== "delete" ? zodResolver(schema) : undefined,
    defaultValues:
      type !== "delete"
        ? {
            title: item?.title ?? "",
            place: item?.place ?? "",
            category_id: item?.item_category_id ?? undefined,
            type: item?.type ?? "lost",
            date: item?.date ?? "",
            government_id: item?.government_id ?? null,
            city_id: item?.city_id ?? null,
          }
        : undefined,
  });

  const selectedGovernment = form.watch("government_id");
  const filteredCities = cities?.filter(
    (city) => city.government_id === selectedGovernment,
  );
  console.log("selectedgover", selectedGovernment);
  function onSubmit(data: z.infer<typeof schema>) {
    console.log(data);
    if (type === "create") {
      console.log("Create:", data);
      createItem(data);
    }

    if (type === "edit") {
      console.log("Update:", data);
    }

    if (type === "delete") {
      console.log("Delete:", item?.id);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button
            className="group duration-200 border-2 rounded-full border-primary text-primary hover:text-white hover:bg-primary px-5 py-3 flex items-center gap-3"
            size={"lg"}
            variant={"outline"}
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 text-primary group-hover:text-white" />
            Add an Item
          </Button>
        ) : type === "edit" ? (
          <Button variant="secondary" size="sm">
            <Edit3 className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "create" && "Create Item"}
            {type === "edit" && "Edit Item"}
            {type === "delete" && "Delete Item"}
          </DialogTitle>

          <DialogDescription>
            {type !== "delete"
              ? "Fill in the item details."
              : "Are you sure you want to delete this item?"}
          </DialogDescription>
        </DialogHeader>

        {type !== "delete" ? (
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" space-y-4 no-scrollbar -mx-4 overflow-y-auto px-4 max-h-150 py-4"
            >
              <FieldGroup>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="title"
                  label="Title"
                  icon={Captions}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="place"
                  label="Place"
                  icon={Pin}
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
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="government_id"
                  label="Government"
                  options={governments?.map((gov) => ({
                    value: gov.id,
                    label: gov.name,
                  }))}
                  onchange={() => form.setValue("city_id", null)}
                  icon={Landmark}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="city_id"
                  label="City"
                  options={filteredCities?.map((city) => ({
                    value: city.id,
                    label: city.name,
                  }))}
                  disabled={!selectedGovernment}
                  icon={Building2}
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="date"
                  label="Date"
                  placeholder="Select date of loss or finding"
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>

                  <Button type="submit" disabled={false}>
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
                </DialogFooter>
              </FieldGroup>
            </form>
          </FormProvider>
        ) : (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              variant="destructive"
              onClick={() => console.log("Delete clicked")}
              disabled={false}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
