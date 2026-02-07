import React, { Children, type ReactNode } from "react";

import { Input } from "@/components/ui/input";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { FormFieldType } from "./DashItemInfo";
import type { Control } from "react-hook-form";
import { DatePicker } from "./DatePicker";

interface CustomFormProps {
  fieldType: FormFieldType;
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

const RenderInput = ({
  field,
  props,
}: {
  field: any;
  props: CustomFormProps;
}) => {
  const {
    fieldType,
    control,
    name,
    label,
    placeholder,
    icon,
    disabled,
    children,
  } = props;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-gray-400 bg-gray-100">
          <FormControl>
            <Input placeholder={placeholder} {...field} className="border-0" />
          </FormControl>
        </div>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="">
          <DatePicker field={field} />
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <div className="flex rounded-md border border-gray-400 bg-gray-100">
          <Textarea
            placeholder={placeholder}
            {...field}
            className=" border-0 "
            disabled={disabled}
          ></Textarea>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="h-11 flex w-full rounded-md border border-gray-400 bg-gray-100">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="">{children}</SelectContent>
          </Select>
        </FormControl>
      );
  }
};
const CustomFormField = (props: CustomFormProps) => {
  const { control, name, label, placeholder, icon, disabled } = props;
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className="flex-1">
          <div className=" flex items-center justify-between gap-1">
            {label && <FormLabel className="">{label}</FormLabel>}
            {icon && icon}
          </div>
          <RenderInput field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
