import { columns, mockData } from "./columns";
import { DataTable } from "./data-table";

export default function() {
    return (
        <div className="space-y-2 py-2">
            <h1 className="font-bold px-2 text-xl">用户管理</h1>
            <DataTable columns={columns} data={mockData} />
        </div>
    )
}