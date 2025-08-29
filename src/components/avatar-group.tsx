import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function AvatarGroup() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-3">
        <img
          className="ring-background rounded-full ring-2"
          src="https://github.com/shadcn.png"
          width={40}
          height={40}
          alt="Avatar 02"
        />
        <img
          className="ring-background rounded-full ring-2"
          src="https://github.com/evilrabbit.png"
          width={40}
          height={40}
          alt="Avatar 01"
        />
        <img
          className="ring-background rounded-full ring-2"
          src="https://github.com/leerob.png"
          width={40}
          height={40}
          alt="Avatar 04"
        />
        <Button
          variant="default"
          className=" text-white flex size-10 items-center justify-center rounded-full text-xs ring-2"
          size="icon"
        >
          +99
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <div className=" flex items-center gap-0.5">
          {[...Array(5)].map((_, index) => (
            <Star
              className="h-4 w-4"
              color="tranparent"
              fill="gold"
              key={index}
            />
          ))}
        </div>

        <p className=" text-muted-foreground text-xs">
          Trusted by over 999+ user
        </p>
      </div>
    </div>
  );
}
