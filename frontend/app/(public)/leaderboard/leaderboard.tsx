"use client"

import { columns, RankCell } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button";
import {RotateCw} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export type RankData = {
    leaderboardRefreshRate: number,
    leaderboardData: RankCell[],
}

export const defaultRankData: RankData = {
    leaderboardRefreshRate: 3600,
    leaderboardData: []
}

export default function Leaderboard() {
    const [data, setData] = useState<RankData>(defaultRankData)
    const [loading, setLoading] = useState(true)

    async function getData() {
        setLoading(true)
        const response = await apiFetch("/api/leaderboard", {method: "GET"}, true)
        if (response.code === 1) {
            setData(response.data as RankData)
        } else {
            toast.error(response.msg, {position: "top-center"})
            setData(defaultRankData)
        }
        setLoading(false)
    }

    useEffect(() => {
        getData()
    }, [])
    
    return (
        <div className="flex flex-col justify-center mx-auto lg:w-200 md:w-120 sm:w-64">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-end">
                    <h1 className="flex text-xl font-bold">排行榜</h1>
                    <p className="text-sm px-4 text-secondary-foreground">将取最佳分数上榜，每隔 {data.leaderboardRefreshRate} 秒更新。</p>
                </div>
                <Button variant="outline" size="default" onClick={getData} disabled={loading}>
                    <RotateCw className={loading ? "hidden" : ""} />
                    <Spinner data-icon="inline-start" className={loading ? "" : "hidden"} />
                    刷新
                </Button>
            </div>
            
            <div className="container mx-auto py-4">
                <DataTable columns={columns} data={ data.leaderboardData } />
            </div>
        </div>
    )
}
