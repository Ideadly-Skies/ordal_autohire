import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Logo />
          </div>

          <div className="text-sm text-muted-foreground">
            © 2025 Ordal AutoHire. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
