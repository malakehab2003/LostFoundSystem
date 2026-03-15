import { ArrowLeft, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormField from "./CustomerFormField";
import { FormFieldType } from "./DashItemInfo";
import { Form } from "./ui/form";
import { Spinner } from "./ui/spinner";
import ChangePassword from "./dialog/ChangePassword";
import DeleteAccount from "./dialog/DeleteAccount";
import {
  UpdateProfileForm,
  type UpdateProfileFormSchema,
} from "@/features/auth/userType";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUpdateUserInfo } from "@/features/auth/hooks/useUpdateUserInfo";
import { FieldGroup } from "./ui/field";

const DashInfo = () => {
  const { user } = useCurrentUser();
  const { updateUserInfo, isPending } = useUpdateUserInfo();
  const form = useForm<UpdateProfileFormSchema>({
    resolver: zodResolver(UpdateProfileForm),
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
      phone: user?.phone || "",
      dob: user?.dob ? new Date(user.dob) : new Date(),
      gender: user?.gender || "male",
      image_url: user?.image_url || "",
    },
  });

  async function onSubmit(data: UpdateProfileFormSchema) {
    try {
      updateUserInfo(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="header text-center mb-10">Personal information</h1>

      <div className="flex flex-col gap-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col"
          >
            <FieldGroup>
              <CustomFormField
                fieldType={FormFieldType.FILE_INPUT}
                control={form.control}
                name="image_url"
                label="Profile Picture"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                disabled={true}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="gender"
                label="Gender"
                placeholder="Enter your gender"
                disabled={true}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Name"
                icon={User}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="phone"
                label="Phone"
                icon={Phone}
              />
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="dob"
                label="Date Of Birth"
              />
            </FieldGroup>
            <Button
              variant="secondary"
              type="submit"
              disabled={isPending}
              size={"lg"}
              className="disabled:opacity-50 disabled:cursor-not-allowed  self-center"
            >
              {!isPending ? (
                <>
                  <span>Saving...</span>
                  <div className="text-center justify-center items-center">
                    <Spinner className="w-5 h-5 place-self-center text-primary" />
                  </div>
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
        <section className="flex gap-5 items-center justify-between">
          <ChangePassword oldPassword={user?.password || ""} />
          <DeleteAccount userId={59} />
        </section>
      </div>
    </main>
  );
};

export default DashInfo;
