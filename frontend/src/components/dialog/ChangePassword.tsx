import { Lock } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Spinner } from "@heroui/react";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import {
  ChangePasswordForm,
  type ChangePasswordFormSchema,
} from "@/features/auth/userType";
import { FieldGroup } from "../ui/field";

const ChangePassword = ({ oldPassword }: { oldPassword: string }) => {
  const { changePassword, isPending } = useChangePassword();
  const form = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(ChangePasswordForm),
    defaultValues: {
      oldPassword: oldPassword || "",
      newPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormSchema) {
    changePassword(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="text-[12px] text-foreground-400 hover:text-foreground-500 self-end"
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
            <FieldGroup>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="oldPassword"
                label="Old Password"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="newPassword"
                label="New Password"
              />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="default"
                type="submit"
                disabled={isPending}
                className="disabled:opacity-50 disabled:cursor-not-allowed "
              >
                {isPending ? (
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
