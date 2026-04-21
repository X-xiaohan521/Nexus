"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiFetch } from "@/lib/api"
import { ColumnDef } from "@tanstack/react-table"
import { Check, MoreHorizontal, ShieldUser, Trash2Icon, User, X } from "lucide-react"
import { toast } from "sonner"


export type UserCell = {
    id: number,
    username: string,
    role: 0 | 1,
    allowSubmit: 0 | 1
}

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
            <User data-icon="inline-start" />
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

export const createColumns = (getData: () => void): ColumnDef<UserCell>[] => [
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
                <div className="w-8 text-right">更多操作</div>
            )
        },
        cell: ({ row }) => {
            async function modifyAllowSubmit(id: number, allowSubmit: number) {
                if (!id) return;
                const response = await apiFetch(`/api/admin/users/${id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        allowSubmit: allowSubmit
                    })
                }, false, true)
                if (response.code === 1) {
                    toast.info(response.msg, {position: "top-center"});
                    getData();
                } else {
                    toast.error(response.msg, {position: "top-center"});
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {row.getValue("allowSubmit") === 0 ? (
                            <DropdownMenuItem onClick={() => modifyAllowSubmit(row.getValue("id"), 1)}>
                                允许提交
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => modifyAllowSubmit(row.getValue("id"), 0)}>
                                禁止提交
                            </DropdownMenuItem>
                        )}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                                    删除用户
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                        <Trash2Icon />
                                    </AlertDialogMedia>
                                    <AlertDialogTitle>确认要删除用户 { row.getValue("username") } 吗？</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        这个操作无法撤销，将从服务器上彻底移除该用户。
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction variant="destructive">删除</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
