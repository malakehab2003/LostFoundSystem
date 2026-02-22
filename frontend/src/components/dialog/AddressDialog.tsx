import { Edit3, Trash2 } from "lucide-react";
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
import { Form } from "../ui/form";
import CustomFormField from "../CustomerFormField";
import { FormFieldType } from "../DashItemInfo";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Spinner } from "@heroui/react";

export const CreateAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  government: z.string().min(1, "Government is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal Code is required"),
  landmark: z.string().optional(),
});
export const EditAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal Code is required"),
  landmark: z.string().optional(),
});

const AddressDialog = ({
  address,
  type,
}: {
  address?: any;
  type: "create" | "edit" | "delete";
}) => {
  const schema =
    type === "create"
      ? CreateAddressSchema
      : type === "edit"
        ? EditAddressSchema
        : z.object({}); // delete has no form

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: type !== "delete" ? zodResolver(schema) : undefined,
    defaultValues: {
      name: address?.name || "",
      address: address?.address || "",
      city: address?.city || "",
      government: address?.government || "",
      state: address?.state || "",
      postal_code: address?.postal_code || "",
      landmark: address?.landmark || "",
    },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      setIsSubmitting(true);

      if (type === "create") {
        console.log("Create:", data);
      }

      if (type === "edit") {
        console.log("Update:", data);
      }

      if (type === "delete") {
        console.log("Delete:", address?.id);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button variant={"default"} className="cursor-pointer">
            Add Address
          </Button>
        ) : type === "edit" ? (
          <Button
            variant={"secondary"}
            size={"sm"}
            className="text-primary/90 hover:text-primary cursor-pointer"
          >
            <Edit3 className="w-4 h-4" /> Edit
          </Button>
        ) : (
          <Button
            variant={"link"}
            className="text-red-400 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Remove
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {type === "create" && "Add Address"}
            {type === "edit" && "Edit Address"}
            {type === "delete" && "Remove Address"}
          </DialogTitle>
          <DialogDescription>
            {type !== "delete"
              ? `Please ${type} the address details.`
              : "Are you sure you want to remove this address? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 no-scrollbar -mx-4 overflow-y-auto px-4 max-h-[400px] py-4"
          >
            {type !== "delete" && (
              <>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  label="Name"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="address"
                  label="Address"
                />
                {type === "create" && (
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="government"
                    label="Government"
                  />
                )}
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="city"
                  label="City"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="state"
                  label="State"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="postal_code"
                  label="Postal Code"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="landmark"
                  label="Landmark (optional)"
                />
              </>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              {type !== "delete" ? (
                <Button
                  variant="default"
                  type="submit"
                  disabled={isSubmitting}
                  className="disabled:opacity-50 disabled:cursor-not-allowed "
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Saving...</span>
                      <Spinner
                        data-icon="inline-end"
                        variant="simple"
                        color="white"
                      />
                    </>
                  ) : (
                    <span>
                      {type === "create" ? "Add Address" : "Update Address"}
                    </span>
                  )}
                </Button>
              ) : (
                <DialogFooter>
                  <Button type="submit" variant={"destructive"}>
                    Remove Address
                  </Button>
                </DialogFooter>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
