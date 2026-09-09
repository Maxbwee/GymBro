'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    if (pathname === "/login") {
        return null;
    }

    return (
        <nav className="flex items-center justify-between p-4 bg-white pink:bg-pink-50 shadow hidden sm:flex">
            <Link className="text-black pink:text-pink-900 visited:text-black hover:text-zinc-700 pink:hover:text-pink-500" href="/">Home</Link>
            <div className="flex gap-4 text-black pink:text-pink-900">
                <Link className="text-black pink:text-pink-900 visited:text-black hover:text-zinc-700 pink:hover:text-pink-500" href="/profile">Profile</Link>
            </div> 
        </nav>
    );
}