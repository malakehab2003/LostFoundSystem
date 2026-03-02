import { ArrowLeft, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import CustomFormField from "./CustomerFormField";
import { FormFieldType } from "./DashItemInfo";
import { Form } from "./ui/form";
import { SelectItem } from "./ui/select";
import { Spinner } from "@heroui/react";
import ChangePassword from "./dialog/ChangePassword";
import DeleteAccount from "./dialog/DeleteAccount";
import {
  UpdateProfileForm,
  type UpdateProfileFormSchema,
} from "@/features/auth/type";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { FileInput } from "./ui/file-input";
import { DatePicker } from "./ui/date-picker";
import { useUpdateUserInfo } from "@/features/auth/hooks/useUpdateUserInfo";

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

        <div className="flex flex-col gap-5">
          {/* User Data Section */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col"
            >
              <>
                <FieldGroup>
                  <Controller
                    name="image_url"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="image_url">
                          Profile Picture
                        </FieldLabel>
                        <FieldDescription></FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        <FileInput
                          {...field}
                          id="image_url"
                          aria-invalid={fieldState.invalid}
                          value={field.value}
                          maxFiles={1}
                          maxSize={5242880}
                          variant="minimal"
                          previewSize="md"
                          multiple={false}
                          showPreview={true}
                          accept="image/*"
                          disabled={false}
                        />
                      </Field>
                    )}
                  />
                </FieldGroup>
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
                >
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </CustomFormField>

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
                <FieldGroup>
                  <Controller
                    name="dob"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="dob">Date Of Birth</FieldLabel>
                        <DatePicker
                          id="dob"
                          value={field.value}
                          onChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                          placeholder=""
                          disabled={false}
                        />
                        <FieldDescription></FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </>
              <Button
                variant="secondary"
                type="submit"
                disabled={isPending}
                size={"lg"}
                className="disabled:opacity-50 disabled:cursor-not-allowed  self-center"
              >
                {isPending ? (
                  <>
                    <span className="mr-2">Saving...</span>
                    <Spinner data-icon="inline-end" variant="simple" />
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
          <section className="flex gap-5 items-center justify-between">
            <ChangePassword oldPassword={"password1234"} />
            <DeleteAccount userId={59} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashInfo;
