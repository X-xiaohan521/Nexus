"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type RankCell = {
  rank: number
  username: string
  score: number
  submissionTime: string
}

export const rankCells: RankCell[] = [
  {"rank": 1, "username": "Milk", "score": 91, "submissionTime": "2026-03-17 14:17"},
  {"rank": 2, "username": "John", "score": 90, "submissionTime": "2026-03-16 15:17"},
  {"rank": 3, "username": "Alice", "score": 89, "submissionTime": "2026-03-15 13:23"},
  {"rank": 4, "username": "Keats", "score": 87, "submissionTime": "2026-03-16 19:39"},
  {"rank": 5, "username": "Catherine", "score": 86, "submissionTime": "2026-03-16 15:17"},
  {"rank": 6, "username": "Milk", "score": 91, "submissionTime": "2026-03-17 14:17"},
  {"rank": 7, "username": "John", "score": 90, "submissionTime": "2026-03-16 15:17"},
  {"rank": 8, "username": "Alice", "score": 89, "submissionTime": "2026-03-15 13:23"},
  {"rank": 9, "username": "Keats", "score": 87, "submissionTime": "2026-03-16 19:39"},
  {"rank": 10, "username": "Catherine", "score": 86, "submissionTime": "2026-03-16 15:17"},
  {"rank": 11, "username": "Keats", "score": 87, "submissionTime": "2026-03-16 19:39"},
  {"rank": 12, "username": "Catherine", "score": 86, "submissionTime": "2026-03-16 15:17"},
  {"rank": 13, "username": "Milk", "score": 91, "submissionTime": "2026-03-17 14:17"},
  {"rank": 14, "username": "John", "score": 90, "submissionTime": "2026-03-16 15:17"},
  {"rank": 15, "username": "Alice", "score": 89, "submissionTime": "2026-03-15 13:23"},
  // ...
]

export const columns: ColumnDef<RankCell>[] = [
  {
    accessorKey: "rank",
    header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                排名
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
    },
    cell: ({ row }) => {
        return (
            <div className="text-center w-10">{ row.getValue("rank") }</div>
        )
    }
  },
  {
    accessorKey: "username",
    header: "用户名",
  },
  {
    accessorKey: "score",
    header: "分数",
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
