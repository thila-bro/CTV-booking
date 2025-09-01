import { getAllSpaces } from '@/repositories/spaces';
import Link from 'next/link';

export default async function Page() {
    const spaces = await getAllSpaces();



    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">All Spaces</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b text-left">Name</th>
                            <th className="px-4 py-2 border-b text-left">Price</th>
                            <th className="px-4 py-2 border-b text-left">Images</th>
                            <th className="px-4 py-2 border-b text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {spaces.map((space: any) => (
                            <tr key={space.id}>
                                <td className="px-4 py-2 border-b">{space.name}</td>
                                <td className="px-4 py-2 border-b">${space.price}</td>
                                <td className="px-4 py-2 border-b">
                                    <Link href={`spaces/images/${space.id}`}>All Images</Link>
                                    {/* <button
                                        // onClick={() => setIsOpen(true)}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Show Images
                                    </button>
                                    {space.images && space.images.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {space.images.map((img: string, idx: number) => (
                                                <img
                                                    key={idx}
                                                    src={img.startsWith('/') ? img : `/spaces/${space.id}/${img}`}
                                                    alt={space.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">No images</span>
                                    )} */}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    <div className='flex'>
                                        <button
                                        // onClick={() => handleDelete(space.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" 
                                    >
                                        Delete
                                    </button>
                                    <button
                                        // onClick={() => handleEdit(space.id)}
                                        className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"        
                                    >
                                        Edit
                                    </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}   