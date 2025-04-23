"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GridPattern from "@components/Effects/GridPattern";
import { cn } from "@nextui-org/react";
import GradualSpacing from "@components/Effects/GradualSpacing";
import BlurEffect from "@components/BlurEffect";
import {DoStartup} from "@components/Config";
import {Image} from "@nextui-org/react";
import {WindowSetMaxSize, WindowSetSize} from "@wailsjs/runtime";

export default function Startup() {
    const [isOpen, setIsOpen] = useState(true);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsOpen(false);
            DoStartup === false
        }, 4000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="z-40 overflow-hidden absolute inset-0 bg-black"
                >
                    <div
                        className="relative flex h-screen w-full items-center justify-center overflow-hidden rounded-lg drag">
                        <div className={`bg-gradient-to-r from-cyan-500 to-indigo-500 bg-no-repeat bg-left-bottom bg-[0%_2px] animate-underline-grow`}>
                            <BlurEffect blurValue={"lg"} scaleValue={"102"}>
                                <motion.div
                                    initial={{x: -10}}
                                    animate={{ x: "1%" }}
                                    transition={{duration: 0.5}}
                                >
                                    <Image src={"logo2.png"} width={256} height={256} alt={"Logo"}
                                           className={`absolute translate-x-[-200px] translate-y-[-53px]`}/>
                                </motion.div>
                                    <GradualSpacing
                                        className="z-10 font-display text-center text-9xl font-bold tracking-[-0.1em] text-black dark:text-white"
                                        text="ATTACK SECURITY"
                                    />
                            </BlurEffect>
                        </div>
                        <GridPattern
                            className={cn(
                                "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                            )}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
