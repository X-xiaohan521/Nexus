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
                <h1 className="text-xl font-bold">排行榜</h1>
                <Button variant="outline" size="default" className="cursor-pointer">
                    <RotateCw />
                    刷新
                </Button>
            </div>
            
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={rankCells} />
            </div>
        </div>
    )
}
