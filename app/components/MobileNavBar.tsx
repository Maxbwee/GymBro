'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BicepsFlexed, Dumbbell, House, User,  } from "lucide-react";


export default function MobileNavBar() {

    const navItems = [
        { href: "/", icon: House, label: "Home" },
        { href: "/workout", icon: Dumbbell, label: "Workout" },
        { href: "/exercises", icon: BicepsFlexed, label: "Exercises" },
        { href: "/profile", icon: User, label: "Profile" },

    ]

    const pathname = usePathname();
    
    if (pathname === "/login") {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around p-4 bg-white pink:bg-pink-50 shadow sm:hidden">
            {navItems.map(({href, label, icon: Icon}) => {
                const isActive = pathname === href; 
                return (
                    <Link key={href} href={href} className={`flex flex-col items-center ${isActive ? "text-blue-500 pink:text-pink-500" : "text-gray-500 pink:text-pink-300"}`}>
                        <Icon />
                        {label}
                    </Link>
                );
            })}
            </nav>
    );

}