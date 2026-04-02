import ProtectedPage from "@/components/protected-page";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { AdminSidebar } from "./admin-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
    title: "Admin"
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <ProtectedPage needAdmin={true}>
            <div className="flex flex-col items-center mx-auto h-full lg:w-250 md:w-150 sm:w-80">
                <TooltipProvider>
                    <SidebarProvider>
                        <AdminSidebar className="flex flex-1 relative w-50" />
                        <SidebarInset>
                            {children}
                        </SidebarInset>
                    </SidebarProvider>
                </TooltipProvider>
            </div>
        </ProtectedPage>
    )
}