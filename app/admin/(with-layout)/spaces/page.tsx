

import { getAllSpaces } from '@/repositories/spaces';
import { deleteSpace } from './action';
import Link from 'next/link';
import {
    TrashIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
// import { useState, useEffect } from 'react';
import { set } from 'zod';
import SpaceTable from '../../../ui/admin/spaces-table';

const spaces = [];

export default async function Page() {
    // const spaces = await getAllSpaces();
    // const [state, action, pending] = useActionState(getAllSpaces(), spaces);

    // const handleDelete = async (id: string) => {
    //     // Implement delete functionality here
    //     console.log("Delete space with ID:", id);
    // }

    // const handleDelete = async (id: string) => {

    // };

//     const [spaces, setData] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {

//         setIsLoading(true);
//         getAllSpaces().then((data) => {
//             setData(spaces);
//             setIsLoading(false);
//         })

// }, [])



    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">All Spaces</h1>
            <div className="overflow-x-auto">
                <SpaceTable />
            </div>
        </div>
    );
}   