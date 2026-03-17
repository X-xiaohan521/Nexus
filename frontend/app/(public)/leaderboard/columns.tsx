"use client"

import { ColumnDef } from "@tanstack/react-table"

export type RankCell = {
  rank: number
  username: string
  score: number
  submissionTime: string
}

export const rankCells: RankCell[] = [
  {"rank": 1, "username": "Milk", "score": 91, "submissionTime": "2026-03-17 14:17"},
  {"rank": 2, "username": "John", "score": 90, "submissionTime": "2026-03-16 15:17"}
  // ...
]

export const columns: ColumnDef<RankCell>[] = [
  {
    accessorKey: "rank",
    header: "排名",
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
    header: "提交时间",
  },
]