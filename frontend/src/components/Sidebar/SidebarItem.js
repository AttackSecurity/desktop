"use client"
import { Icon } from "@iconify/react";
import {usePathname, useRouter} from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {Tooltip} from "@nextui-org/react";

const NavItem = ({ icon, title, href }) => {
    const [active, setActive] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        if (pathname === href) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [pathname, href]);

    return (
        <Tooltip content={title} delay={50} closeDelay={50} placement={"left"} showArrow>
            <Link
                href={href}
                className="w-full"
                shallow={true}
            >
                {active && (
                    <div className="border-[1.9px] h-12 border-blue-500 absolute left-0 rounded-r-lg"></div>
                )}
                <div
                    className={`w-full flex items-center justify-center rounded-lg ${
                        active && "bg-gradient-to-br from-blue-500 to-[#374969]"
                    } hover:bg-[#3e4046] hover:text-white hover:scale-105 p-2 cursor-pointer transition-all duration-300`}
                >
                    <Icon icon={icon} className="w-8 h-8" />
                </div>
            </Link>
        </Tooltip>
    );
};

export default NavItem;
