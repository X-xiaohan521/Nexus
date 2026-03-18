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
  { "rank": 1, "username": "Milk", "score": 91, "submissionTime": "2026-03-17 14:17" },
  { "rank": 2, "username": "John", "score": 90, "submissionTime": "2026-03-16 15:17" },
  { "rank": 3, "username": "Alice", "score": 89, "submissionTime": "2026-03-15 13:23" },
  { "rank": 4, "username": "Keats", "score": 87, "submissionTime": "2026-03-16 19:39" },
  { "rank": 5, "username": "Catherine", "score": 86, "submissionTime": "2026-03-16 15:17" },
  { "rank": 6, "username": "Milk", "score": 91, "submissionTime": "2026-03-17 14:17" },
  { "rank": 7, "username": "Sophia", "score": 84, "submissionTime": "2026-03-16 09:45" },
  { "rank": 8, "username": "Lucas", "score": 83, "submissionTime": "2026-03-15 11:28" },
  { "rank": 9, "username": "Olivia", "score": 82, "submissionTime": "2026-03-17 16:54" },
  { "rank": 10, "username": "Noah", "score": 81, "submissionTime": "2026-03-16 13:37" },
  { "rank": 11, "username": "Emma", "score": 80, "submissionTime": "2026-03-15 18:22" },
  { "rank": 12, "username": "Liam", "score": 79, "submissionTime": "2026-03-17 08:19" },
  { "rank": 13, "username": "Ava", "score": 78, "submissionTime": "2026-03-16 20:41" },
  { "rank": 14, "username": "Mason", "score": 77, "submissionTime": "2026-03-15 14:55" },
  { "rank": 15, "username": "Isabella", "score": 76, "submissionTime": "2026-03-17 12:03" },
  { "rank": 16, "username": "Logan", "score": 75, "submissionTime": "2026-03-16 17:26" },
  { "rank": 17, "username": "Mia", "score": 74, "submissionTime": "2026-03-15 09:11" },
  { "rank": 18, "username": "James", "score": 73, "submissionTime": "2026-03-17 19:48" },
  { "rank": 19, "username": "Charlotte", "score": 72, "submissionTime": "2026-03-16 11:34" },
  { "rank": 20, "username": "Benjamin", "score": 71, "submissionTime": "2026-03-15 16:07" },
  { "rank": 21, "username": "Amelia", "score": 70, "submissionTime": "2026-03-17 07:56" },
  { "rank": 22, "username": "Elijah", "score": 69, "submissionTime": "2026-03-16 14:18" },
  { "rank": 23, "username": "Harper", "score": 68, "submissionTime": "2026-03-15 12:42" },
  { "rank": 24, "username": "William", "score": 67, "submissionTime": "2026-03-17 15:29" },
  { "rank": 25, "username": "Evelyn", "score": 66, "submissionTime": "2026-03-16 10:05" },
  { "rank": 26, "username": "Alexander", "score": 65, "submissionTime": "2026-03-15 17:33" },
  { "rank": 27, "username": "Abigail", "score": 64, "submissionTime": "2026-03-17 13:14" },
  { "rank": 28, "username": "Daniel", "score": 63, "submissionTime": "2026-03-16 18:52" },
  { "rank": 29, "username": "Emily", "score": 62, "submissionTime": "2026-03-15 08:47" },
  { "rank": 30, "username": "Matthew", "score": 61, "submissionTime": "2026-03-17 20:21" },
  { "rank": 31, "username": "Ella", "score": 60, "submissionTime": "2026-03-16 12:59" },
  { "rank": 32, "username": "Joseph", "score": 59, "submissionTime": "2026-03-15 19:06" },
  { "rank": 33, "username": "Scarlett", "score": 58, "submissionTime": "2026-03-17 09:38" },
  { "rank": 34, "username": "David", "score": 57, "submissionTime": "2026-03-16 16:44" },
  { "rank": 35, "username": "Grace", "score": 56, "submissionTime": "2026-03-15 13:57" }
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
