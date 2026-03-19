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
    { "id": 21, "status": 2, "score": null, "submissionTime": "2026-03-17 08:44" },
    { "id": 20, "status": 1, "score": 72, "submissionTime": "2026-03-17 13:56" },
    { "id": 19, "status": 0, "score": null, "submissionTime": "2026-03-15 13:52" },
    { "id": 18, "status": 1, "score": 81, "submissionTime": "2026-03-17 12:07" },
    { "id": 17, "status": 1, "score": 95, "submissionTime": "2026-03-17 15:28" },
    { "id": 16, "status": 1, "score": 64, "submissionTime": "2026-03-17 11:03" },
    { "id": 15, "status": 1, "score": 87, "submissionTime": "2026-03-17 16:37" },
    { "id": 14, "status": 0, "score": null, "submissionTime": "2026-03-15 12:34" },
    { "id": 13, "status": 1, "score": 69, "submissionTime": "2026-03-17 09:42" },
    { "id": 10, "status": 0, "score": null, "submissionTime": "2026-03-17 18:22" },
    { "id": 9, "status": 0, "score": null, "submissionTime": "2026-03-16 16:25" },
    { "id": 8, "status": 1, "score": 88, "submissionTime": "2026-03-16 15:02" },
    { "id": 7, "status": 0, "score": null, "submissionTime": "2026-03-16 13:49" },
    { "id": 6, "status": 1, "score": 66, "submissionTime": "2026-03-16 12:18" },
    { "id": 5, "status": 1, "score": 61, "submissionTime": "2026-03-16 09:24" },
    { "id": 4, "status": 1, "score": 92, "submissionTime": "2026-03-16 06:41" },
    { "id": 3, "status": 1, "score": 78, "submissionTime": "2026-03-15 23:11" },
    { "id": 2, "status": 1, "score": 83, "submissionTime": "2026-03-15 22:30" },
    { "id": 1, "status": 0, "score": null, "submissionTime": "2026-03-15 18:12" }
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
                    <p>{ row.getValue("id") }</p>
                </div>
            )
        }
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
    },
]
