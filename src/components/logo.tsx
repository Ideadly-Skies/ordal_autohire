import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      src="/logo/main-logo.webp"
      alt="Ordal AutoHire"
      width={120}
      height={40}
    />
  );
};
