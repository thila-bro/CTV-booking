
import SpaceTable from '../../../../ui/admin/spaces-table';

const spaces = [];

export default async function Page() {

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">All Spaces</h1>
            <div className="overflow-x-auto">
                <SpaceTable />
            </div>
        </div>
    );
}   