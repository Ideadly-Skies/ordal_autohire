"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // Split and filter empty segments
  console.log(pathname);
  return (
    <section>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-4">
            <div className="flex items-center gap-2 ">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {segments.map((segment, idx) => {
                    const href = "/" + segments.slice(0, idx + 1).join("/");
                    const isLast = idx === segments.length - 1;

                    return (
                      <BreadcrumbItem key={idx} className="flex">
                        {isLast ? (
                          <BreadcrumbPage className="capitalize">
                            {segment.replace("-", " ")}
                          </BreadcrumbPage>
                        ) : (
                          <>
                            <BreadcrumbLink asChild>
                              <Link href={href} className="capitalize">
                                {segment.replace("-", " ")}
                              </Link>
                            </BreadcrumbLink>
                            <BreadcrumbSeparator />
                          </>
                        )}
                      </BreadcrumbItem>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {
              // disable edit profile button on edit-profile page
              pathname === "/dashboard" && (
                <div>
                  <Button variant={"outline"} asChild>
                    <Link href="/dashboard/edit-profile" className="text-sm">
                      Edit Profile
                      <ArrowRight className=" h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )
            }
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
}
