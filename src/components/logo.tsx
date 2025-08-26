import { cn } from "../lib/utils";

export const Logo = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <h1 className="font-bold">
      Ordal <span className="font-light">AutoHire</span>
    </h1>
  );
};
