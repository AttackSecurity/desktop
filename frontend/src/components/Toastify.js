import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/react";
import {useEffect, useState} from "react";
import { toast } from "react-toastify";

export const Notify = (title, description, additionalInfo = '', expiry = 4) => {
    toast(
        <CustomToastify title={title} expiry={expiry}>
            <p className="text-md font-normal tracking-tighter">
                {description}
            </p>
            {additionalInfo && (
                <p className="text-md font-normal tracking-tighter p-0.5 card">
                    {additionalInfo}
                </p>
            )}
        </CustomToastify>
    );
};

function CustomToastify({title, expiry, children}) {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [remainingTime, setRemainingTime] = useState(expiry);

    useEffect(() => {
        onOpen();

        const interval = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    onClose();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onOpen, onClose]);

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"center"} hideCloseButton={true}
                   shouldBlockScroll={true} isDismissable={false} backdrop={"blur"} className="max-w-xl mx-auto z-50">
                <ModalContent>
                    <div className="relative h-full bg-[1d1d1d] rounded-[inherit] z-20 overflow-hidden">
                        <div
                            className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-[100px] aspect-square"
                            aria-hidden="true">
                            <div
                                className="absolute inset-0 translate-z-0 rounded-full bg-blue-500 transition-colors duration-500 ease-in-out blur-[60px]"/>
                        </div>
                        <div className="flex flex-col h-full">
                            <ModalHeader
                                className="backdrop-blur-3xl border-b border-slate-700 w-full text-center justify-between items-center h-14">
                                <BlurEffect blurValue="lg" scaleValue="105">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24">
                                        <g stroke="currentColor" strokeLinecap="round" strokeWidth={2}>
                                            <path fill="currentColor" fillOpacity={0} strokeDasharray={60}
                                                  strokeDashoffset={60}
                                                  d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z">
                                                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s"
                                                         values="60;0"></animate>
                                                <animate fill="freeze" attributeName="fill-opacity" begin="1.2s"
                                                         dur="0.15s"
                                                         values="0;0.3"></animate>
                                            </path>
                                            <path fill="none" strokeDasharray={8} strokeDashoffset={8} d="M12 7V13">
                                                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s"
                                                         dur="0.2s" values="8;0"></animate>
                                            </path>
                                        </g>
                                        <circle cx={12} cy={17} r={1} fill="currentColor" fillOpacity={0}>
                                            <animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.4s"
                                                     values="0;1"></animate>
                                        </circle>
                                    </svg>
                                </BlurEffect>
                                <p className={`textShadow text-xl uppercase tracking-widest font-light`}>{title}</p>
                                <p className={`font-thin`}>{remainingTime}s</p>
                            </ModalHeader>
                            <ModalBody className="p-4 text-gray-300 text-center">
                                <BlurEffect blurValue={"lg"} scaleValue={"105"}>
                                    {children}
                                </BlurEffect>
                            </ModalBody>
                        </div>
                    </div>
                </ModalContent>
            </Modal>

        </>
    )
}

function BlurEffect({ children, blurValue, scaleValue }) {
    return (
        <div className="relative flex">
            {/* Blurred Layer */}
            <div className={`inset-0 filter blur-${blurValue} scale-${scaleValue} flex-grow`}>
                {children}
            </div>
            {/* Second Layer */}
            <div className="absolute inset-0 flex-grow">
                {children}
            </div>
        </div>
    );
};