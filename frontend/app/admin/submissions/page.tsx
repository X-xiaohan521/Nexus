"use client"

import { Button } from "@/components/ui/button";
import { columns, SubmissionCell } from "./columns";
import { DataTable } from "./data-table";
import { RotateCw, Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { DatePickerWithRange } from "./date-picker-range";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

const defaultData: SubmissionCell[] = [];

export default function () {
    const [data, setData] = useState<SubmissionCell[]>();

    const [username, setUsername] = useState<string>();
    const [dateRange, setDateRange] = useState<DateRange | undefined>()

    const [loading, setLoading] = useState<boolean>(false);

    async function getData() {
        setLoading(true);

        const response = await apiFetch(`/api/admin/submission?username=${username ?? ""}&dateRange=${
            dateRange ? (dateRange.from ? format( dateRange.from, "yyyy-MM-dd") : "") + "~" + (dateRange.to ? format( dateRange.to, "yyyy-MM-dd") : "") : ""
        }`);
        
        if (response.code === 1) {
            setData(response.data as SubmissionCell[]);
        } else {
            toast.error(response.msg, {position: "top-center"});
        }

        setLoading(false);
    }

    useEffect(() => { getData() }, []);

    function clearAllHooks() {
        setUsername("");
        setDateRange(undefined);
    }

    return (
        <div className="space-y-2 py-2">
            <h1 className="font-bold px-2 text-xl">提交记录</h1>
            <div className="flex justify-between px-2">
                <InputGroup className="max-w-xs">
                    <InputGroupInput placeholder="搜索用户..."
                        value={username ? username : ""}
                        onChange={e => {setUsername(e.target.value)}}
                        onBlur={getData} onKeyDown={e => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                getData();
                            }
                        }} />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
                <div className="space-x-2">
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} onClose={getData} />
                    <Button variant="outline" size="default" onClick={e => {
                        e.preventDefault();
                        clearAllHooks();
                        getData();
                    }}>
                        <RotateCw className={loading ? "hidden" : ""} />
                        <Spinner data-icon="inline-start" className={loading ? "" : "hidden"} />
                        刷新
                    </Button>
                </div>
            </div>
            <div className="container mx-auto">
                <DataTable columns={columns} data={data?data:defaultData} />
            </div>
        </div>
    )
}