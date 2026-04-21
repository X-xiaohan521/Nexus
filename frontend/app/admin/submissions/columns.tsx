"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, CircleCheck, CircleX, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export type SubmissionCell = {
    id: number
    username: string,
    status: 0 | 1 | 2 | 3
    score: number | null
    submissionTime: string
}

function FailedBadge() {
    return (
        <Badge variant="destructive">
            <CircleX data-icon="inline-start" />
            失败
        </Badge>
    )
}

function SuccessBadge() {
    return (
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" variant="secondary">
            <CircleCheck data-icon="inline-start" />
            成功
        </Badge>
    )
}

function RunningBadge() {
    return (
        <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <Spinner data-icon="inline-start" />
            评测中
        </Badge>
    )
}

function PendingBadge() {
    return (
        <Badge variant="secondary">
            <Clock data-icon="inline-start" />
            排队中
        </Badge>
    )
}

export const columns: ColumnDef<SubmissionCell>[] = [
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
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => {
            const s = row.getValue("status")
            switch (s) {
                case 0:
                    return <FailedBadge />
                case 1:
                    return <SuccessBadge />
                case 2:
                    return <PendingBadge />
                case 3:
                    return <RunningBadge />
            }
        }
    },
    {
        accessorKey: "score",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    分数
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "submissionTime",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    提交时间
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    }
]
