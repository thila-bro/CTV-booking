'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/user/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from "next/navigation";
import { logoutUser } from '@/app/user/(without-layout)/action';

export default function SideNav() {
  const router = useRouter();

  function CustomerSignOut() {
    // Perform any necessary cleanup actions here, such as clearing session data or cookies
    // For example, you might want to call an API endpoint to log out the user on the server side
    logoutUser().then(() => router.push('/user/login'));

  }

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button 
            type='button'
            onClick={CustomerSignOut}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
