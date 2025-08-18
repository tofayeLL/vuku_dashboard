"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IoClose /* IoLocationSharp */ } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FiMenu } from "react-icons/fi";
import Cookies from "js-cookie";
import logo from "@/assets/logo.png";
import { RxDashboard } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { logout, useAuth } from "@/redux/features/authSlice";
import { CiUser } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
// import { PiBookOpenFill } from "react-icons/pi";
import { BsPeople } from "react-icons/bs";
import { FaBriefcase } from "react-icons/fa6";
// import { LuMessageCircleMore } from "react-icons/lu";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

// Sidebar Props
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const NavbarSlider = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const auth = useSelector(useAuth);
  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  // console.log("navbar slider", auth?.role);
  const navigation = [
    { label: "Dashboard", route: "/", iconPath: <RxDashboard /> },

    // Only show Admin Management for SUPER_ADMIN
    ...(auth?.role === "SUPER_ADMIN" 
      ? [
          {
            label: "Admin Management",
            route: "/admin/admin_Management",
            iconPath: <CiUser className="h-5 w-5" />,
          },
        ]
      : []),
    {
      label: "Staff Management",
      route: "/admin/staff_Management",
      iconPath: <BsPeople className="h-5 w-5" />,
    },
    {
      label: "Responders Management",
      route: "/admin/responders_Management",
      iconPath: <HiOutlineOfficeBuilding className="w-5 h-5" />,
    },

    {
      label: "Cases",
      route: "/admin/cases",
      iconPath: <FaBriefcase className="w-5 h-5" />,
    },

    /*   {
      label: "Location",
      route: "/admin/locations",
      iconPath: <IoLocationSharp className="h-5 w-5" />,
    },

    {
      label: "Training",
      route: "/admin/training",
      iconPath: <PiBookOpenFill className="h-5 w-5" />,
    },

    {
      label: "Support",
      route: "/message",
      iconPath: <LuMessageCircleMore className="h-5 w-5" />,
    }, */
    {
      label: "Settings",
      route: "/settings",
      iconPath: <IoSettingsOutline className="h-5 w-5" />,
    },
  ];

  const handleLogOut = () => {
    dispatch(logout());
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="h-screen bg-white">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="m-4 p-2 text-black rounded-md bg-white shadow-md lg:hidden"
      >
        {isOpen ? <IoClose size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar Content */}
      <aside
        className={`duration-300 flex flex-col justify-between h-[calc(100%-0px)] font-inter ${
          isOpen ? "w-[320px]" : "w-[80px]"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          {isOpen && (
            <Link href="/" className="hidden lg:flex justify-start p-6">
              <Image
                width={250}
                height={250}
                className="w-14 h-14"
                src={logo}
                alt="logo_image"
                priority
              />
            </Link>
          )}

          <div className={`flex flex-col ${isOpen ? "pt-0" : ""}`}>
            {/* Navigation */}
            <ul className="m-4 lg:m-6">
              {navigation.map((item) => (
                <li key={item?.route}>
                  <Link
                    href={item?.route}
                    className={`flex items-center gap-2 px-4 py-2 mb-2 rounded-lg hover:bg-[#00A8CC] hover:text-white transition-colors duration-300 ease-in-out 
                    ${
                      path === item?.route
                        ? "bg-[#00A8CC] text-white"
                        : "text-[#817F9B]"
                    }`}
                  >
                    <p className="w-5 h-5">{item?.iconPath}</p>
                    {isOpen && <p className="">{item?.label}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Spacer to push logout to bottom */}
          <div className="flex-grow"></div>

          {/* Logout Button */}
          <div className="mt-auto p-6">
            <button
              onClick={handleLogOut}
              className="flex items-center justify-start gap-2 text-[#D00E11] hover:text-red-400 transition-colors rounded-md bg-[#D00E111A] hover:bg-[#EF444433] w-full py-2 px-4"
            >
              <RiLogoutCircleRLine size={18} />
              {isOpen && <span className="text-lg">Log out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Modal */}
    </div>
  );
};

export default NavbarSlider;
