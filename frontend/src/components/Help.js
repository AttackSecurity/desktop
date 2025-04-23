import {Icon} from "@iconify/react";
import {Divider} from "@nextui-org/react";
import BlurEffect from "@components/BlurEffect";
import {useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ShowHelp({x = 0, y = 0, arrowDegree = 35, title ="Not set.", description="Not set.", Open = true, OnCloseFunc}) {
    const [isOpen, setIsOpen] = useState(Open);

    useEffect(() => {
        setIsOpen(Open);
    }, [Open]);

    const style = {
        top: `${x}px`,
        left: `${y}px`
    };

    useEffect(() => {
        setIsOpen(Open);
    }, [Open]);

    function close() {
        setIsOpen(false);
        setTimeout(() => {
            OnCloseFunc();
        }, 300);
    }

    return (
        <motion.div
            initial={{opacity: 0, scale: 0.5}}
            animate={{opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.5}}
            exit={{opacity: 0, scale: 0.5}}
            transition={{duration: 0.3, ease: "easeOut"}}
            className={`z-20 absolute`}
            style={{top: `${x}px`, left: `${y}px`, visibility: isOpen ? 'visible' : 'hidden'}}
        >
            <div className={`animate-pulse`}>
                <BlurEffect blurValue={"lg"} scaleValue={"105"}>
                    <Icon icon={"solar:map-arrow-left-bold-duotone"} height={32} width={32}
                          style={{transform: `rotate(${arrowDegree}deg)`}}/>
                </BlurEffect>
            </div>
            <div className={`rounded-lg bg-[#1d1d1d] p-3 translate-y-[-5px] translate-x-[30px] min-w-36 text-left`}>
                <div className={`w-full flex flex-row items-center justify-between`}>
                    <p
                        className={`tracking-tighter font-thin uppercase`}
                    >
                        {title}
                    </p>
                    <div className={`-translate-y-[14px] translate-x-1/2 hover:text-red-300/40 transition-all`} onClick={close}>
                        <Icon icon={"solar:close-circle-bold-duotone"} width={18} height={18}/>
                    </div>
                </div>
                <Divider/>
                <p
                    className={`text-default-500 text-sm max-w-[300px]`}
                >
                    {description}
                </p>
            </div>
        </motion.div>
    )
}