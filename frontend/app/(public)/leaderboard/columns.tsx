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
        <div className="text-center w-10">{row.getValue("rank")}</div>
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
