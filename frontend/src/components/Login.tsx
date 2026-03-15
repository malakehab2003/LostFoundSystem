import { useForm, Controller } from "react-hook-form";
import { EmailInput } from "@/components/ui/email-input";
import { PasswordInput } from "@/components/ui/password-input";
import { Lock } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { loginForm, type LoginFormSchema } from "@/features/auth/userType";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { Link } from "react-router-dom";

export function Login() {
  const { loginUser } = useLogin();
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginForm),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  const onSubmit = async (values: LoginFormSchema) => {
    loginUser(values);
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
          <h1 className="text-xl font-semibold leading-tight tracking-tight text-foreground/80 md:text-2xl self-start text-start border-b border-gray-200 pb-4 w-full">
            Sign in to your account
          </h1>
        </CardHeader>

        <CardContent className="p-5">
          <form
            id="login"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <EmailInput
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email"
                      autoComplete="off"
                      disabled={false}
                    />
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="flex relative">
                      <div className="absolute left-0 p-3 self-center">
                        <Lock className="w-4 h-4 text-slate-500" />
                      </div>
                      <PasswordInput
                        {...field}
                        id="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your password"
                        autoComplete="off"
                        disabled={false}
                        className="pl-8"
                      />
                    </div>
                  </Field>
                )}
              />
            </FieldGroup>
            <div className="flex items-center justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-5">
          <Button
            type="submit"
            form="login"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? <Spinner /> : "Sign In"}
          </Button>
          <p className="text-xs font-medium self-start items-start text-gray-500">
            Don’t have an account yet?{" "}
            <a
              href="/signup"
              className="font-medium text-primary/80 hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
export default Login;
