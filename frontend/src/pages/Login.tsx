import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { EmailInput } from "@/components/ui/email-input";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { Link } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Spinner } from "@heroui/react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email  is required")
    .email("Invalid email address")
    .regex(
      /^[^\s@]+@(gmail|yahoo|outlook|email)\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
      "Email must be a valid address from gmail, yahoo, outlook, or email domains",
    ),
  password: z
    .string()
    .regex(/^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,}$/, {
      message: "Password must be at least 7 characters long",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

export function Login() {
  const [activeTab, setActiveTab] = useState("login");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const onSubmit = async (values: FormSchema) => {
    console.log(values);
    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      console.log("User logged in:", data);
    } catch (error) {
      console.error("Error logging in user:", error);
    }
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
              <a
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
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
