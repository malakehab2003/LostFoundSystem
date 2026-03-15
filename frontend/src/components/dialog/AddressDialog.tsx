import { Building, Building2, Edit3, Landmark, Signpost } from "lucide-react";
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
import { FormFieldType } from "../Dashboard/DashItemInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Spinner } from "@heroui/react";
import { FieldGroup } from "../ui/field";
import { CreateAddressSchema } from "@/features/address/addressType";
import { useGovernments } from "@/features/governments/hooks/useGovernments";
import { useCities } from "@/features/cities/hooks/useCities";
import { useCreateAddress } from "@/features/address/hooks/useCreateAddress";
import { useEditAddress } from "@/features/address/hooks/useEditAddress";
import { useMemo } from "react";

type Props = {
  address?: any;
  type: "create" | "edit";
};
const AddressDialog = ({ address, type }: Props) => {
  const { createAddress, isPending } = useCreateAddress();
  const { editAddress } = useEditAddress();
  const { governments } = useGovernments();
  const { cities } = useCities();

  const schema =
    type === "create" ? CreateAddressSchema : CreateAddressSchema.partial();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: address?.name || "",
      address: address?.address || "",
      government_id: address?.government_id ?? null,
      city_id: address?.city_id ?? null,
      postal_code: address?.postal_code || "",
      landmark: address?.landmark || "",
    },
  });
  const selectedGovernment = useWatch({
    control: form.control,
    name: "government_id",
  });
  const filteredCities = useMemo(() => {
    if (!selectedGovernment) return [];
    return cities?.filter((city) => city.government_id === selectedGovernment);
  }, [cities, selectedGovernment]);
  async function onSubmit(data: z.infer<typeof schema>) {
    if (type === "create") {
      console.log("Create:", data);
      createAddress(data);
    }

    if (type === "edit") {
      console.log("Update:", data);
      editAddress({ id: address.id, ...data });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button variant={"default"} className="cursor-pointer">
            Add Address
          </Button>
        ) : (
          <Button
            variant={"secondary"}
            size={"sm"}
            className="text-primary/90 hover:text-primary cursor-pointer"
          >
            <Edit3 className="w-4 h-4" /> Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "create" && "Add Address"}
            {type === "edit" && "Edit Address"}
          </DialogTitle>
          <DialogDescription>
            {`Please ${type} the address details.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 no-scrollbar -mx-4 overflow-y-auto px-4 max-h-150 py-4"
          >
            <FieldGroup>
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
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="postal_code"
                label="Postal Code"
                icon={Signpost}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="landmark"
                label="Landmark (optional)"
                icon={Building}
              />
            </FieldGroup>
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
                  "Create Address"
                ) : (
                  "Update Address"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
