import { cn } from "@/lib/utils";
import React from "react";
import { Input } from "./ui/input";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id?: string;
  extra?: string;
  placeholder?: string;
  name?: string;
  inputClass?: string;
  title?: string;
  rows?: number;
  errorMessage?: {
    message: string;
  };
  register?: any;
  value?: string | number;
  onChange?: any;
  onClick?: any;
  autoFocus?: boolean;
  onKeyDown?: any;
};

const TodaiInput = React.forwardRef<
  HTMLTextAreaElement | HTMLInputElement,
  InputFieldProps
>(
  (
    {
      label,
      id,
      extra = "",
      type = "text",
      placeholder,
      disabled = false,
      name,
      required,
      inputClass,
      inputMode = "text",
      title,
      rows = 3,
      errorMessage,
      register,
      value,
      onChange,
      onClick,
      autoFocus = false,
      onKeyDown,
    }: InputFieldProps,
    ref
  ) => {
    return (
      <div className={extra}>
        <div className={`flex justify-between ${label && "mb-1"}`}>
          {label && (
            <label
              htmlFor={id}
              className="flex-1 text-sm text-brand-primary-text ml-1 font-medium">
              {label}
            </label>
          )}
          {errorMessage?.message && (
            <p className="text-red-400 text-[11px] text-right">
              {errorMessage.message.toLowerCase().includes("invalid")
                ? "Field is required"
                : errorMessage.message}
            </p>
          )}
        </div>
        {type === "textarea" ? (
          <textarea
            value={value}
            name={name}
            disabled={disabled}
            id={id}
            rows={rows}
            placeholder={placeholder}
            className={cn(
              "flex w-full items-center justify-center rounded-md p-3 text-sm border",
              inputClass,
              disabled &&
                "!border !border-slate-400 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            )}
            ref={ref}
            {...register}
            onChange={onChange}
            autoFocus={autoFocus}
          />
        ) : (
          <Input
            value={value}
            name={name}
            disabled={disabled}
            type={type}
            id={id}
            required={required}
            placeholder={placeholder}
            inputMode={inputMode}
            title={title}
            onChange={onChange}
            onClick={onClick}
            className={cn(
              "flex w-full items-center justify-center rounded-md  outline-none text-sm focus:!ring-white",
              inputClass,
              disabled &&
                "!border !border-slate-400 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            )}
            ref={ref as React.Ref<HTMLInputElement>}
            {...register}
            autoFocus={autoFocus}
            onKeyDown={onKeyDown}
          />
        )}
      </div>
    );
  }
);

TodaiInput.displayName = "TodaiInput";

export default TodaiInput;
