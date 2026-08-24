'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, House, User } from "lucide-react";


export default function MobileNavBar() {

    const navItems = [
        { href: "/", icon: House, label: "Home" },
        { href: "/workout", icon: Dumbbell, label: "Workout" },
        { href: "/profile", icon: User, label: "Profile" },
        
    ]

    const pathname = usePathname();
    
    if (pathname === "/login") {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around p-4 bg-white shadow sm:hidden">
            {navItems.map(({href, label, icon: Icon}) => {
                const isActive = pathname === href; 
                return (
                    <Link key={href} href={href} className={`flex flex-col items-center ${isActive ? "text-blue-500" : "text-gray-500"}`}>
                        <Icon />
                        {label}
                    </Link>
                );
            })}
            </nav>
    );

}