import { Edit3 } from "lucide-react";
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

export const AddressFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal Code is required"),
});

const EditAddress = ({ address }: any) => {
  console.log(address);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof AddressFormSchema>>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      name: address?.name || "",
      address: address?.address || "",
      city: address?.city || "",
      state: address?.state || "",
      postal_code: address?.postal_code || "",
    },
  });

  async function onSubmit(data: z.infer<typeof AddressFormSchema>) {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          size={"sm"}
          className="text-primary/90 hover:text-primary cursor-pointer"
        >
          <Edit3 className="w-4 h-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>
            Please edit the address details and click "Save Changes" to update
            your address information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" variant={"default"}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddress;
