import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EmailInput } from "@/components/ui/email-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { PasswordInput } from "@/components/ui/password-input";

import { FileInput } from "@/components/ui/file-input";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { SignupForm, type SignupFormSchema } from "@/features/auth/userType";

const Signup = () => {
  const { signupUser, isPending } = useSignup();
  const steps = [
    {
      title: "Step 1",
      description: "",
      fields: ["name", "password"],
    },
    {
      title: "Step 2",
      description: "",
      fields: ["email", "gender", "dob"],
    },
    {
      title: "Step 3",
      description: "",
      fields: ["phone", "image_url"],
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const currentForm = steps[currentStep];

  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const form = useForm<SignupFormSchema>({
    resolver: zodResolver(SignupForm),
    defaultValues: {
      name: "",
      password: "",
      email: "",
      gender: "",
      dob: undefined,
      phone: "",
      image_url: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const handleNextButton = async () => {
    const currentFields = steps[currentStep]
      .fields as (keyof SignupFormSchema)[];

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

  const onSubmit = async (values: SignupFormSchema) => {
    signupUser(values);
  };

  const renderCurrentStepContent = () => {
    return (
      <FieldGroup>
        {/* Step 1: Name */}
        {currentStep === 0 && (
          <>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your username"
                    autoComplete="off"
                    disabled={false}
                  />
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="password"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                    disabled={false}
                  />
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </>
        )}

        {/* Step 2: Email, Gender, Date of Birth */}
        {currentStep === 1 && (
          <>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email </FieldLabel>
                  <EmailInput
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email"
                    autoComplete="off"
                    disabled={false}
                  />
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => {
                const options = [
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ];

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={false}
                    >
                      <SelectTrigger
                        id="gender"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="" />
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel></SelectLabel>
                            {options.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                    <FieldDescription></FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

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
          </>
        )}

        {/* Step 3: Phone Number and Profile Picture */}
        {currentStep === 2 && (
          <>
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    {...field}
                    id="phone"
                    placeholder=""
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    disabled={false}
                  />
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="image_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="image_url">Profile Picture</FieldLabel>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FileInput
                    {...field}
                    id="image_url"
                    aria-invalid={fieldState.invalid}
                    maxFiles={1}
                    maxSize={5242880}
                    variant="default"
                    previewSize="md"
                    multiple={false}
                    showPreview={true}
                    accept="image/*"
                    disabled={false}
                  />
                </Field>
              )}
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
        <form id="signup" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button
              type="submit"
              form="signup"
              disabled={form.formState.isSubmitting}
              className=""
            >
              {form.formState.isSubmitting || isPending ? (
                <Spinner className="" />
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
};

export default Signup;
