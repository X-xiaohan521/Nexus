import { columns, mockData } from "./columns";
import { DataTable } from "./data-table";

export default function() {
    return (
        <div>
            <h1 className="text">提交记录</h1>
            <div className="container mx-auto">
                <DataTable columns={columns} data={mockData} />
            </div>
        </div>
    )
}