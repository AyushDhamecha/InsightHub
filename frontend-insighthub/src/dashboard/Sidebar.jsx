import { FaHome, FaRegStickyNote, FaBullseye, FaChartLine } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between font-sans">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            •
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Projector</h1>
        </div>

        {/* Navigation Links */}
        <nav className="px-4">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 text-white bg-[#1e2631] rounded-lg px-4 py-2 text-sm"
              >
                <FaHome size={16} />
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm"
              >
                <FaRegStickyNote size={16} />
                Notes
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm"
              >
                <FaBullseye size={16} />
                Goals
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2 text-sm"
              >
                <FaChartLine size={16} />
                Activity
              </a>
            </li>
          </ul>
        </nav>

        {/* Spaces Section */}
        <div className="mt-6 px-6 flex items-center justify-between text-gray-600 text-xs uppercase font-semibold">
          <span>Spaces</span>
          <IoMdAdd size={16} className="cursor-pointer" />
        </div>

        {/* Publications Highlighted */}
        <div className="mt-2 px-4">
          <a
            href="#"
            className="flex items-center gap-3 text-white bg-[#f2b8eb] rounded-lg px-4 py-2 text-sm"
          >
            <TbLayoutSidebarLeftExpandFilled size={16} />
            Publications
          </a>
        </div>

        {/* Shots Submenu */}
        <div className="mt-3 px-4 text-sm text-gray-800 font-medium">
          <div className="mb-1">Shots</div>
          <ul className="pl-4 space-y-1 text-gray-600 text-sm">
            <li>Dribbble</li>
            <li>Behance</li>
            <li>Articles</li>
            <li>Social</li>
            <li>Commercial</li>
            <li>Internal</li>
          </ul>
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-10" />
    </aside>
  );
}
