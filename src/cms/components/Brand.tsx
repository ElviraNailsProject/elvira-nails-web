import Image from "next/image";

export function BrandLogo() {
  return (
    <Image
      alt="Elvira — Nail Studio & Education"
      className="elvira-cms-brand"
      height={725}
      priority
      src="/logo.svg"
      width={2170}
    />
  );
}
