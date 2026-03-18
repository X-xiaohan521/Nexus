import { Metadata } from "next";
import { columns, RankCell, rankCells } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button";
import {RotateCw} from "lucide-react";

export const metadata: Metadata = {
    title: "Leaderboard"
}

async function getData(): Promise<RankCell[]> {
    // Fetch data from your API here.
    return [

    ]
}

export default function Leaderboard() {
    

    return (
        <div className="flex flex-col justify-center mx-auto lg:w-200 md:w-120 sm:w-64">
            <div className="flex items-center justify-between px-2">
                <div className="flex">
                    <h1 className="flex text-xl font-bold">排行榜</h1>
                    <p className="text-sm px-4 text-secondary-foreground">将取最佳分数上榜，每隔 {} 秒更新。</p>
                </div>
                <Button variant="outline" size="default">
                    <RotateCw />
                    刷新
                </Button>
            </div>
            
            <div className="container mx-auto py-4">
                <DataTable columns={columns} data={rankCells} />
            </div>
        </div>
    )
}
