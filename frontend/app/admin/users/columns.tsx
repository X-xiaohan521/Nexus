"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { Check, MoreHorizontal, ShieldUser, X } from "lucide-react"

export type UserCell = {
    id: number,
    username: string,
    role: 0 | 1,
    allowSubmit: 0 | 1
}

export const mockData: UserCell[] = [
    {"id": 1, "username": "Milk", "role": 1, "allowSubmit": 1},
    {"id": 2, "username": "John", "role": 0, "allowSubmit": 0},
    {"id": 3, "username": "Jessica", "role": 0, "allowSubmit": 1}
]

function AdminBadge() {
    return (
        <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <ShieldUser data-icon="inline-start" />
            管理员
        </Badge>
    )
}

function UserBadge() {
    return (
        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            默认
        </Badge>
    )
}

function AllowSubmitBadge() {
    return (
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" variant="secondary">
            <Check data-icon="inline-start" />
            允许
        </Badge>
    )
}

function ProhibitSubmitBadge() {
    return (
        <Badge variant="destructive">
            <X data-icon="inline-start" />
            不允许
        </Badge>
    )
}

export const columns: ColumnDef<UserCell>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <div className="flex justify-center w-10">
                    <p>#</p>
                </div>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex justify-center w-10">
                    <p>{row.getValue("id")}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "username",
        header: "用户名",
    },
    {
        accessorKey: "role",
        header: "权限组",
        cell: ({ row }) => {
            const r = row.getValue("role")
            switch (r) {
                case 0:
                    return <UserBadge />
                case 1:
                    return <AdminBadge />
            }
        }
    },
    {
        accessorKey: "allowSubmit",
        header: "允许提交",
        cell: ({ row }) => {
            const a = row.getValue("allowSubmit")
            switch (a) {
                case 0:
                    return <ProhibitSubmitBadge />
                case 1:
                    return <AllowSubmitBadge />
            }
        }
    },
    {
        accessorKey: "actions",
        header: ({ column }) => {
            return (
                <div className="w-8"></div>
            )
        },
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {row.getValue("allowSubmit") === 0 ? (
                            <DropdownMenuItem>
                                允许提交
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem>
                                禁止提交
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem variant="destructive">
                            删除用户
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
