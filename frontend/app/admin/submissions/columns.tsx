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
    errMsg: string | null
    fileUri: string
}

export const mockData: SubmissionCell[] = [
    {"id": 4, "username": "Ethan", "status": 1, "score": 76, "submissionTime": "2026-03-17 10:21", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 5, "username": "Sophia", "status": 0, "score": null, "submissionTime": "2026-03-16 08:14", "errMsg": "文件大小超限", fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 6, "username": "Lucas", "status": 3, "score": 88, "submissionTime": "2026-03-15 19:43", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 7, "username": "Olivia", "status": 1, "score": 91, "submissionTime": "2026-03-17 16:55", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 8, "username": "Noah", "status": 0, "score": null, "submissionTime": "2026-03-16 12:37", "errMsg": "未检测到有效内容", fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 9, "username": "Emma", "status": 3, "score": 73, "submissionTime": "2026-03-15 13:28", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 10, "username": "Liam", "status": 1, "score": 85, "submissionTime": "2026-03-17 09:16", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 11, "username": "Ava", "status": 0, "score": null, "submissionTime": "2026-03-16 14:52", "errMsg": "格式解析失败", fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 12, "username": "Mason", "status": 3, "score": 67, "submissionTime": "2026-03-15 21:07", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 13, "username": "Isabella", "status": 1, "score": 90, "submissionTime": "2026-03-17 18:33", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 14, "username": "Logan", "status": 0, "score": null, "submissionTime": "2026-03-16 07:59", "errMsg": "编码不支持", fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 15, "username": "Mia", "status": 2, "score": 79, "submissionTime": "2026-03-15 15:42", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 16, "username": "James", "status": 1, "score": 82, "submissionTime": "2026-03-17 11:25", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 17, "username": "Charlotte", "status": 0, "score": null, "submissionTime": "2026-03-16 16:18", "errMsg": "上传中断", fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 18, "username": "Benjamin", "status": 2, "score": 71, "submissionTime": "2026-03-15 17:36", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 19, "username": "Amelia", "status": 1, "score": 94, "submissionTime": "2026-03-17 13:09", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 20, "username": "Elijah", "status": 0, "score": null, "submissionTime": "2026-03-16 10:47", "errMsg": "文件损坏", fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 21, "username": "Harper", "status": 2, "score": 65, "submissionTime": "2026-03-15 12:58", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 22, "username": "William", "status": 1, "score": 77, "submissionTime": "2026-03-17 15:44", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 23, "username": "Evelyn", "status": 0, "score": null, "submissionTime": "2026-03-16 13:31", "errMsg": "缺少必要字段", fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 24, "username": "Alexander", "status": 2, "score": 86, "submissionTime": "2026-03-15 20:11", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 25, "username": "Abigail", "status": 1, "score": 89, "submissionTime": "2026-03-17 08:52", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 26, "username": "Daniel", "status": 0, "score": null, "submissionTime": "2026-03-16 17:06", "errMsg": "内容不符合要求", fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 27, "username": "Emily", "status": 2, "score": 74, "submissionTime": "2026-03-15 14:19", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 28, "username": "Matthew", "status": 1, "score": 83, "submissionTime": "2026-03-17 19:22", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 29, "username": "Ella", "status": 0, "score": null, "submissionTime": "2026-03-16 11:40", "errMsg": "系统校验失败", fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 30, "username": "Joseph", "status": 2, "score": 68, "submissionTime": "2026-03-15 16:03", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 31, "username": "Scarlett", "status": 1, "score": 92, "submissionTime": "2026-03-17 12:11", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 32, "username": "David", "status": 0, "score": null, "submissionTime": "2026-03-16 09:55", "errMsg": "格式不匹配", fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"},
    {"id": 33, "username": "Grace", "status": 2, "score": 70, "submissionTime": "2026-03-15 18:27", "errMsg": null, fileUri: "/submission/unimilk/4a275939-f701-4afb-b1e0-4dcab814a4ea.csv"}
]

function FailedBadge({errMsg}: {errMsg: string}) {
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
                    return <FailedBadge errMsg={row.getValue("errMsg")} />
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
    },
    {
        accessorKey: "errMsg",
        header: () => {
            return
        },
        cell: () => {
            return
        }
    },
    {
        accessorKey: "fileUri",
        header: () => {
            return
        },
        cell: () => {
            return
        }
    }
]
