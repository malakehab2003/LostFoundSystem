import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { FormFieldType } from "./DashItemInfo";
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { DatePicker } from "./ui/date-picker";
import { EmailInput } from "./ui/email-input";
import { PasswordInput } from "./ui/password-input";
import { FileInput } from "./ui/file-input";
import type { LucideIcon } from "lucide-react";

type Option = {
  label: string;
  value: string | number;
};

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  fieldType: FormFieldType;
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
  icon?: LucideIcon;
  onchange?: () => void;
};
type RenderInputProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>;
  fieldState: ControllerFieldState;
  props: Props<T>;
};

const RenderInput = <T extends FieldValues>({
  field,
  fieldState,
  props,
}: RenderInputProps<T>) => {
  const { fieldType, name, placeholder, disabled, options, onchange } = props;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <Input
          {...field}
          id={name}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          autoComplete="on"
          disabled={disabled}
        />
      );
    case FormFieldType.EMAIL:
      return (
        <EmailInput
          {...field}
          id={name}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
        />
      );
    case FormFieldType.PASSWORD:
      return (
        <PasswordInput
          {...field}
          id={name}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
        />
      );
    case FormFieldType.FILE_INPUT:
      return (
        <FileInput
          {...field}
          id={name}
          aria-invalid={fieldState.invalid}
          maxFiles={1}
          maxSize={5242880}
          variant="default"
          previewSize="md"
          multiple={false}
          showPreview={true}
          accept="image/*"
          disabled={disabled}
        />
      );

    case FormFieldType.TEXTAREA:
      return (
        <Textarea
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          id={name}
          aria-invalid={fieldState.invalid}
          autoComplete="on"
        />
      );

    case FormFieldType.SELECT:
      return (
        <Select
          name={field.name}
          value={field.value?.toString() ?? ""}
          onValueChange={(value) => {
            const selected = options?.find(
              (opt) => opt.value.toString() == value,
            );

            field.onChange(Number(selected?.value));
            onchange?.();
          }}
          disabled={disabled}
        >
          <SelectTrigger id={name} aria-invalid={fieldState.invalid}>
            <SelectValue placeholder={placeholder} />
            <SelectContent>
              <SelectGroup>
                {options?.map((item) => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectTrigger>
        </Select>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <DatePicker
          id={name}
          value={field.value}
          onChange={field.onChange}
          aria-invalid={fieldState.invalid}
          placeholder=""
          disabled={disabled}
        />
      );

    default:
      return null;
  }
};
const CustomFormField = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, label, icon } = props;
  const Icon = icon as LucideIcon | undefined;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            htmlFor={name}
            className="flex gap-2 justify-between items-center"
          >
            <span>{label}</span>
            {Icon && <Icon className="w-4 h-4 text-foreground/70 mr-1" />}
          </FieldLabel>

          <RenderInput field={field} props={props} fieldState={fieldState} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default CustomFormField;
