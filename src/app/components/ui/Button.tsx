import Link from "next/link";

type BtnVariant =
  | "primaryHero"
  | "primaryToLight"
  | "primaryToDark"
  | "secondaryLight"
  | "secondaryDark";

type LinkProps = {
  href: string;
  label: string;
  variant: BtnVariant;
  size?: string;
  showIcon?: boolean;
};

type ButtonProps = {
  label: string;
  variant: BtnVariant;
  onClick: () => void;
  size?: string;
  showIcon?: boolean;
};

const baseStyles = [
  "inline-flex items-center justify-center gap-3 group",
  "text-[12px] uppercase tracking-[0.25em]",
  "rounded-md",
  "transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
];

const styles = {
  primaryHero: [
    ...baseStyles,
    "text-[#fdf9fa]",
    "bg-[#a1794b]",
    "hover:bg-[#815e37]",
  ].join(" "),

  primaryToLight: [
    ...baseStyles,
    "text-[#fdf9fa]",
    "bg-[#a1794b]",
    "hover:bg-[#bb986c]",
  ].join(" "),

  primaryToDark: [
    ...baseStyles,
    "text-[#fdf9fa]",
    "bg-[#815e37]",
    "hover:bg-[#634628]",
  ].join(" "),

  secondaryLight: [
    ...baseStyles,
    "text-[#fdf9fa]",
    "border border-[#fdf9fa]/50",
    "bg-transparent",
    "hover:border-[#fdf9fa]",
  ].join(" "),

  secondaryDark: [
    ...baseStyles,
    "text-[#060404]",
    "border border-[#060404]",
    "bg-transparent",
    "hover:text-[#fdf9fa] hover:bg-[#060404]",
  ].join(" "),
};

const icon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    aria-hidden="true"
    className="transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-2"
  >
    <use href="/icons/arrow.svg" />
  </svg>
);

export function BtnLink({
  href,
  label,
  variant,
  size,
  showIcon = false,
}: LinkProps) {
  return (
    <Link href={href} className={`${styles[variant]} ${size || "px-9 py-4"}`}>
      {label}
      {showIcon && icon}
    </Link>
  );
}

export function BtnButton({
  label,
  variant,
  onClick,
  size,
  showIcon = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles[variant]} ${size || "px-9 py-4"}`}
    >
      {label}
      {showIcon && icon}
    </button>
  );
}
