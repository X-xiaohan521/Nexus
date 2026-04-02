"use client"

import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    BookUser,
    ScrollText,
    Settings,

} from "lucide-react"
import { useRouter } from "next/navigation"

const projects = [
    {
        name: "系统设置",
        url: "/admin/settings",
        icon: Settings,
    },
    {
        name: "提交记录",
        url: "/admin/submissions",
        icon: ScrollText,
    },
    {
        name: "用户管理",
        url: "/admin/users",
        icon: BookUser
    }
]

export function AdminSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter()
    return (
        <Sidebar variant="floating" collapsible="offcanvas" {...props}>
            <SidebarContent>
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel>管理</SidebarGroupLabel>
                    <SidebarMenu>
                        {projects.map((item) => (
                            <SidebarMenuItem className="rounded-md hover:bg-accent transition-transform cursor-pointer" key="settings">
                                <SidebarMenuButton asChild onClick={() => { router.push(item.url) }}>
                                    <a>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
