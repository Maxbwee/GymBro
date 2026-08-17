import Link from "next/link";


export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow">
            <Link className="text-black" href="/">Home</Link>
            <div className="flex gap-4 text-black">
                <Link className="text-black" href="/profile">Profile</Link>
            </div> 
        </nav>
    );
}