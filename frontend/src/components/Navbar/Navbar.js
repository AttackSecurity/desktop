"use client"
import { Quit, WindowMinimise } from "@wailsjs/runtime";
import {usePathname, useRouter} from "next/navigation";
import { Icon } from "@iconify/react";
import {Pages} from "@/components/Config";

export default function Header() {
    const pathname = usePathname();

    function getTitleByHref(hrefToSearch) {
        const foundPage = Pages.find(page => page.href.includes(hrefToSearch));
        if (hrefToSearch === "/settings") {
            return "Settings";
        } else if (hrefToSearch === "/auth/login") {
            return "LOGIN";
        } else if (hrefToSearch === "/auth/register") {
            return "REGISTER";
        }
        return foundPage ? foundPage.title : "Page not found";
    }

    return (
        <div className="drag relative top-0 flex items-center overflow-hidden w-full min-h-[3.4rem] max-h-[3.4rem] px-6 bg-[#2C2D31] border-b-2 border-[#1e1f22]">
            <div className="flex items-center justify-start flex-1 gap-1 capitalize">
                <span className="text-sm font-bold font-sans text-blue-400 uppercase">
                    {require("../../../package.json").name}
                </span>
                <Icon icon="tabler:slashes" className="text-gray-300"/>
                <span className="text-sm font-semibold font-sans text-white uppercase">
                    {getTitleByHref(pathname)}
                </span>
            </div>

            <div className="relative flex items-center justify-end flex-1 gap-3">
                <button
                    onClick={() => WindowMinimise()}
                    className="w-4 h-4 bg-yellow-500 hover:bg-yellow-600 rounded-full transition duration-300"
                />
                <button
                    onClick={() => Quit()}
                    className="w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full transition duration-300"
                />
            </div>
            <div className="absolute left-0 right-0 bottom-0 w-[250px] h-[24px] blur-2xl bg-gradient-to-t from-blue-500 to-blue-700"/>
            <div className="absolute right-[70px] bottom-0 w-[10px] h-[100px] blur-2xl bg-gradient-to-t from-yellow-600 to-red-600"/>
            <div className="absolute right-0 bottom-0 w-[10px] h-[100px] blur-2xl bg-gradient-to-t from-red-600 to-red-600"/>
        </div>
    );
}
