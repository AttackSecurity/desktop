import Header from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Blocker from "@/components/ContextMenuBlocker";
import {Pages} from "@/components/Config";
import { ToastContainer } from "react-toastify";
import "../app/globals.css"

export default function Layout({ children, isRunning }) {
    return (
        <>
            <ToastContainer
                className="hidden"
            />
            <div className="flex flex-col h-screen overflow-hidden">
                <Blocker/>
                <Header/>
                <div className="flex flex-grow">
                    <div className={`flex p-2 pl-5 items-center bg-[#1d1d1d]`}>
                        <Sidebar navItems={Pages} isRunning={isRunning}/>
                    </div>
                    <div className="flex flex-col flex-grow p-3 overflow-hidden bg-[#1d1d1d]">
                        <div className={`h-full relative overflow-hidden bg-gray-200/50 card rounded-md p-4`}>
                            <div
                                className="before:absolute before:top-0 before:left-0 before:w-52 before:h-28 before:bg-gradient-to-b before:content-[''] before:from-transparent before:to-[#374969] before:blur-3xl z-0"/>
                            <div
                                className="before:absolute before:bottom-5 before:right-0 before:w-52 before:h-28 before:bg-gradient-to-b before:content-[''] before:from-transparent before:to-[#374969] before:blur-3xl z-0"/>

                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
