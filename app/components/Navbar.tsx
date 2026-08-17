import Link from "next/link";


export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow">
            <Link className="text-black visited:text-black hover:text-zinc-700" href="/">Home</Link>
            <div className="flex gap-4 text-black">
                <Link className="text-black visited:text-black hover:text-zinc-700" href="/profile">Profile</Link>
            </div> 
        </nav>
    );
}