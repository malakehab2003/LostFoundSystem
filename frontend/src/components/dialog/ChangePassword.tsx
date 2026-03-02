import { Edit3, Lock } from "lucide-react";
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

export const PasswordFormSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

const ChangePassword = ({ oldPassword }: { oldPassword: string }) => {
  console.log(oldPassword);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof PasswordFormSchema>>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      password: oldPassword || "",
    },
  });

  async function onSubmit(data: z.infer<typeof PasswordFormSchema>) {
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
          variant="link"
          size="sm"
          className="text-[12px] text-slate-400 hover:text-slate-500 self-end"
        >
          <Lock className="w-2 h-2" /> Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your new password below. Make sure to choose a strong password
            to keep your account secure.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="password"
              label="New Password"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
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
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
