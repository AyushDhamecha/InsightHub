import { NavLink } from "react-router-dom";
import { FaHome, FaRegStickyNote, FaBullseye } from "react-icons/fa";

export default function Sidebar() {
    const navItems = [
        { name: "Home", path: "/", icon: <FaHome size={16} /> },
        { name: "Projects", path: "/projects", icon: <FaRegStickyNote size={16} /> },
        { name: "Goals", path: "/goals", icon: <FaBullseye size={16} /> },
    ];

    return (
        <aside className="fixed w-72 h-screen bg-white border-r border-gray-200 flex flex-col justify-between font-sans z-10">
            <div>
                {/* Logo */}
                <div className="flex items-center gap-2 px-6 py-5 my-2">
                    {/* Orange square with custom dotted circle inside */}
                    <div className="w-8 h-8 bg-orange-500 rounded-md relative flex items-center justify-center">
                        {/* Custom circle with 5 dots */}
                        <div className="relative w-5 h-5">
                            {[...Array(5)].map((_, i) => {
                                const angle = (i / 5) * 2 * Math.PI;
                                const x = Math.cos(angle) * 8 + 10; // offset for positioning
                                const y = Math.sin(angle) * 8 + 10;
                                return (
                                    <div
                                        key={i}
                                        className={`absolute w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-black" : "bg-white"}`}
                                        style={{ left: `${x}px`, top: `${y}px`, transform: "translate(-50%, -50%)" }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* App Title */}
                    <h1 className="text-2xl font-semibold text-gray-800">InsightHub</h1>
                </div>


                {/* Navigation */}
                <nav className="px-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    end
                                    className={({ isActive }) =>
                                        `flex items-center w-full gap-3 px-4 py-2 text-sm rounded-full transition-all ${isActive ? "text-white bg-[#1e2631]" : "text-gray-700 hover:bg-gray-100"
                                        }`
                                    }
                                    type="_blank"
                                >
                                    {item.icon}
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="h-10" />
        </aside>
    );
}