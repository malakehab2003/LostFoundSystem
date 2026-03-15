import { useForm } from "react-hook-form";
import logo from "@/assets/logo.jpeg";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import {
  ForgotPasswordForm,
  type ForgotPasswordFormSchema,
} from "@/features/auth/userType";

import CustomFormField from "@/components/CustomerFormField";
import { FormFieldType } from "@/components/DashItemInfo";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

export function ForgotPassword() {
  const { forgotPassword, isPending } = useForgotPassword();
  const form = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(ForgotPasswordForm),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  const onSubmit = async (values: ForgotPasswordFormSchema) => {
    console.log(values);
    forgotPassword(values);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center justify-center">
          <div className="self-center">
            <img
              src={logo}
              alt="Logo"
              className="mb-2 aspect-2/1 h-20 object-contain"
            />
          </div>
          <div className="flex flex-col gap-2 items-center justify-start border-b border-gray-200 pb-4 w-full">
            <h1 className="text-xl font-semibold tracking-tight text-foreground/80 md:text-2xl self-start text-start ">
              Reset your password
            </h1>
            <p className="text-foreground/70 text-sm leading-tight">
              Please enter your email address. We will send you an email to
              reset your password.
            </p>
          </div>
        </CardHeader>

        <CardContent className="">
          <form id="reset" onSubmit={form.handleSubmit(onSubmit)} className="">
            <FieldGroup>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="">
          <Button
            type="submit"
            form="reset"
            disabled={isPending}
            className="mx-auto w-full"
          >
            {isPending ? <Spinner /> : "Send Email"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default ForgotPassword;
