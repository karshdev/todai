'use client'
import loadingIcon from "@/assets/img/loading-circle.svg";
import { TodaiImage } from "../TodaiImage";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "primary_outline" | "secondary" | "bgthird" | "text";
  type?: "button" | "submit";
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  formAction?: ((formData: FormData) => void) | (() => void);
  loading?: boolean;
};

export const defaultButtonStyles = "px-[35px] py-[8px] text-sm md:text-base";
export const allVariants = {
  primary:
    "text-brand-secondary bg-brand-primary font-semibold rounded-md hover:bg-brand-primary-hover text-center w-full rounded-xl px-5 py-2.5 overflow-hidden group bg-opacity-80 relative hover:bg-gradient-to-r hover:bg-brand-primary hover:to-cyan-400 text-white hover:text-black hover:ring-2 hover:ring-offset-2 hover:ring-bg-brand-primary transition-all ease-out duration-300",
  primary_outline:
    "text-brand-primary border border-brand-primary font-semibold rounded-md hover:bg-brand-primary-hover",
  secondary: "text-primary bg-brand-secondary",
  bgthird: "text-brand-secondary bg-brand-silver",
  text: "text-primary font-normal px-0 py-0 hover:text-brand-primary",
};

export const TodaiAnimatedButton = ({
  type = "button",
  children,
  className = "",
  variant = "text",
  onClick,
  disabled = false,
  formAction,
  loading,
}: ButtonProps) => {
  const currentVariant = `${defaultButtonStyles} ${allVariants[variant]}`;

  return (
    <button
      formAction={formAction}
      type={type}
      onClick={onClick}
      className={cn(
        `${currentVariant} ${className}  ${
          disabled && "opacity-40 cursor-not-allowed"
        } rounded-full`
      )}
      disabled={disabled}>
      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-50 rotate-12  group-hover:-translate-x-60"></span>
      <span className="relative">
        <div className="flex gap-2 text-center items-center  justify-center w-full">
          {" "}
          {loading ? (
            <TodaiImage
              className="animate-spin h-5 w-5 text-white"
              src={loadingIcon}
              width={100}
              height={100}
              alt="loading"
            />
          ) : (
            children
          )}
        </div>
      </span>
    </button>
  );
};
