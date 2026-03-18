"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, CircleCheck, CircleX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export type SubmissionCell = {
    id: number
    status: 0 | 1 | 2
    score: number | null
    submissionTime: string
}

export const submissions: SubmissionCell[] = [
    { "id": 1, "status": 1, "score": 83, "submissionTime": "2026-03-15 22:30" },
    { "id": 2, "status": 0, "score": null, "submissionTime": "2026-03-16 09:24" },
    { "id": 3, "status": 2, "score": null, "submissionTime": "2026-03-17 14:17" }
]

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

function PendingBadge() {
    return (
        <Badge variant="secondary">
            <Spinner data-icon="inline-start" />
            判分中
        </Badge>
    )
}

export const columns: ColumnDef<SubmissionCell>[] = [
    {
        accessorKey: "id",
        header: "#",
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
            }
        }
    },
    {
        accessorKey: "score",
        header: "分数",
    },
    {
        accessorKey: "submissionTime",
        header: "提交时间",
    },
]
