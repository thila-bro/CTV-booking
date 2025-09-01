'use client';

import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  DocumentCurrencyDollarIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import React, { useState as reactUseState } from 'react';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/user', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/user/invoices',
    icon: DocumentCurrencyDollarIcon,
  },
  { name: 'Bookings', href: '/user/bookings', icon: ClipboardDocumentCheckIcon },
  // {
  //   name: 'Spaces',
  //   href: '/admin/spaces',
  //   icon: BriefcaseIcon,
  //   children: [
  //     { name: 'Add Spaces', href: '/admin/spaces/add' },
  //     { name: 'All Spaces', href: '/admin/spaces' },
  //   ],

  // },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // interface NavLinkChild {
  //   name: string;
  //   href: string;
  // }

  // interface NavLink {
  //   name: string;
  //   href: string;
  //   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  //   children?: NavLinkChild[];
  // }

  const toggleMenu = (name: string): void => {
    setOpenMenus((prev: Record<string, boolean>) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }


  return (
    // <>
    //   {links.map((link) => {
    //     const LinkIcon = link.icon;
    //     return (
    //       <Link
    //         key={link.name}
    //         href={link.href}
    //         className={clsx(
    //           'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
    //           {
    //             'bg-sky-100 text-blue-600': pathname === link.href,
    //           },
    //         )}
    //       >
    //         <LinkIcon className="w-6" />
    //         <p className="hidden md:block">{link.name}</p>
    //       </Link>
    //     );
    //   })}
    // </>

    <aside>
      <ul>
        {links.map((link) => (
          <li key={link.name} className="mb-2">
            {link.children ? (
              <>
                <button
                  onClick={() => toggleMenu(link.name)}
                  className={clsx(
                    'flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                    {
                      'bg-sky-100 text-blue-600': pathname === link.href,
                    },
                  )}
                >
                  {React.createElement(link.icon, { className: "w-6" })}
                  {link.name}
                  <span>{openMenus[link.name] ? '▾' : '▸'}</span>
                </button>

                {openMenus[link.name] && (
                  <ul className="ml-4 mt-1">
                    {link.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          href={child.href}
                          className={clsx(
                            'flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                              'bg-sky-100 text-blue-600': pathname === link.href,
                            },
                          )}
                        >

                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={link.href}
                className={clsx(
                  'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                  {
                    'bg-sky-100 text-blue-600': pathname === link.href,
                  },
                )}
              >
                {React.createElement(link.icon, { className: "w-6" })}
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
const useState = reactUseState;

