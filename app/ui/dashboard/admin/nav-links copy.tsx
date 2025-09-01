'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { useState } from 'react';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  {
    title: 'Users',
    path: '/users',
    children: [
      {
        title: 'All Users',
        path: '/users/all',
      },
      {
        title: 'Add User',
        path: '/users/add',
      },
    ],
  },
];

const navLinks = [
  {
    title: 'Dashboard',
    path: '/dashboard',
  },
  {
    title: 'Users',
    path: '/users',
    children: [
      { title: 'All Users', path: '/users/all' },
      { title: 'Add User', path: '/users/add' },
    ],
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };
  
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <ul>
        {navLinks.map((link) => (
          <li key={link.title} className="mb-2">
            {link.children ? (
              <>
                <button
                  onClick={() => toggleMenu(link.title)}
                  className="w-full text-left py-2 px-3 rounded hover:bg-gray-800 flex justify-between"
                >
                  {link.title}
                  <span>{openMenus[link.title] ? '▾' : '▸'}</span>
                </button>

                {openMenus[link.title] && (
                  <ul className="ml-4 mt-1">
                    {link.children.map((child) => (
                      <li key={child.title}>
                        <Link
                          href={child.path}
                          className={`block py-1 px-3 rounded text-sm hover:bg-gray-800 ${
                            pathname === child.path ? 'bg-gray-700' : ''
                          }`}
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={link.path}
                className={`block py-2 px-3 rounded hover:bg-gray-800 ${
                  pathname === link.path ? 'bg-gray-700' : ''
                }`}
              >
                {link.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
