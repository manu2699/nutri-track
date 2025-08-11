import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputContainerVariants = cva(
	"flex items-center border-b-[3px] bg-input rounded-t-md px-3 py-1 border-input focus-within:border-b-primary has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/20 dark:has-[input[aria-invalid=true]]:ring-destructive/40",
	{
		variants: {
			size: {
				default: "h-9",
				sm: "h-8 !text-xs border-b-[1.5px]",
				lg: "h-10 !text-base"
			}
		},
		defaultVariants: {
			size: "default"
		}
	}
);

const inputVariants = cva(
	cn(
		"file:text-foreground placeholder:text-muted-foreground placeholder:text-base",
		"selection:bg-primary selection:text-primary-foreground",
		"h-9 w-full min-w-0 text-md shadow-xs transition-[color,box-shadow] outline-none",
		"file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
		"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 "
	),
	{
		variants: {
			size: {
				default: "",
				sm: "h-8 text-sm placeholder:text-xs",
				lg: "h-10 text-base placeholder:text-base"
			}
		},
		defaultVariants: {
			size: "default"
		}
	}
);

type InputContainerVariants = VariantProps<typeof inputContainerVariants>;
export type InputSize = NonNullable<InputContainerVariants["size"]>;

export interface InputProps
	extends Omit<ComponentProps<"input">, "size" | "prefix" | "suffix">,
		InputContainerVariants {
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
}

function Input({ className, size, type, prefix, suffix, ...props }: InputProps) {
	return (
		<div className={cn(inputContainerVariants({ size, className }))}>
			{prefix && <div className="text-muted-foreground mr-2">{prefix}</div>}
			<input type={type} data-slot="input" className={cn(inputVariants({ size, className }))} {...props} />
			{suffix && <div className="text-muted-foreground ml-2">{suffix}</div>}
		</div>
	);
}

export const INPUT_SIZES = {
	DEFAULT: "default",
	SMALL: "sm",
	LARGE: "lg"
} as const satisfies Record<string, InputSize>;

export { Input };
