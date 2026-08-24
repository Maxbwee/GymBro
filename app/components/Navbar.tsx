'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    if (pathname === "/login") {
        return null;
    }

    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow hidden sm:flex">
            <Link className="text-black visited:text-black hover:text-zinc-700" href="/">Home</Link>
            <div className="flex gap-4 text-black">
                <Link className="text-black visited:text-black hover:text-zinc-700" href="/profile">Profile</Link>
            </div> 
        </nav>
    );
}