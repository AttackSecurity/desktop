import NavItem from "@/components/Sidebar/SidebarItem";
import Image from "next/image";
import {Tooltip} from "@nextui-org/react";
import Link from "next/link";
import {Icon} from "@iconify/react";

const Logo = () => (
    <div className="relative w-14 h-14 overflow-hidden rounded-full flex justify-center items-center">
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-800"></div>
        <Image src={"/logo.jpg"} width={48} height={48} alt={"Logo"} className="absolute rounded-full text-[#e7e7e7]"/>
    </div>
);

const SidebarFooter = () => (
    <div className="flex flex-col items-center justify-end font-light text-xs z-30">
        <NavItemBottom
            icon={"solar:settings-bold-duotone"}
            title={"Settings"}
            href={"/settings"}
        />
    </div>
);

export default function Sidebar({navItems, isRunning}) {
    return (
        <div
            className={`drag container relative overflow-hidden flex h-[99%] flex-col w-[5.4rem] px-4 py-6 pb-2 rounded-lg card select-none transition`}>
            <div className="flex flex-col items-center justify-start">
                <Logo/>
            </div>

            <hr className="my-5 bg-[#3e3f42] h-0.5 border-none rounded-xl"/>

            <div
                className={`noDrag flex flex-col items-center justify-start flex-grow gap-3 ${isRunning ? "pointer-events-none blur-sm" : null}`}>
                {navItems.map((item, index) => (
                    <NavItem
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        href={item.href}
                    />
                ))}
            </div>

            <div className={`${isRunning ? "pointer-events-none blur-sm" : "z-20"}`}>
                <SidebarFooter/>
            </div>

            {/* Sidebar Glow */}
            <div
                className="absolute left-0 right-0 bottom-0 w-full h-16 blur-2xl bg-gradient-to-t from-blue-500 to-blue-700"/>

        </div>
    );
};

const NavItemBottom = ({ icon, title, href }) => {
    return (
        <Tooltip content={title} delay={50} closeDelay={50} placement={"left"} showArrow>
            <Link
                href={href}
                className="w-full hover:rotate-90 transition"
                shallow={true}
            >
                <div
                    className={`w-full flex items-center justify-center rounded-lg hover:text-white hover:scale-105 p-2 cursor-pointer transition-all duration-300`}
                >
                    <Icon icon={icon} className="w-8 h-8"/>
                </div>
            </Link>
        </Tooltip>
    );
};