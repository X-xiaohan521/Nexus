import { Button } from "@/components/ui/button";
import { columns, mockData } from "./columns";
import { DataTable } from "./data-table";
import { RotateCw, Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { DatePickerWithRange } from "./date-picker-range";

export default function () {
    return (
        <div className="space-y-2 py-2">
            <h1 className="font-bold px-2 text-xl">提交记录</h1>
            <div className="flex justify-between px-2">
                <InputGroup className="max-w-xs">
                    <InputGroupInput placeholder="搜索用户..." />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
                <div className="space-x-2">
                    <DatePickerWithRange />
                    <Button variant="outline" size="default">
                        <RotateCw className={"hidden"} />
                        <Spinner data-icon="inline-start" />
                        刷新
                    </Button>
                </div>
            </div>
            <div className="container mx-auto">
                <DataTable columns={columns} data={mockData} />
            </div>
        </div>
    )
}