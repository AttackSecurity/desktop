"use client"
import Layout from "@/components/Layout";
import Image from "next/image";
import {
    Button,
    Checkbox,
    Divider,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Select, SelectItem,
    Tab,
    Tabs,
    Textarea,
    useDisclosure
} from "@nextui-org/react";
import {Icon} from "@iconify/react";
import {Links} from "@/components/Config";
import {useEffect, useState} from "react";
import {Settings} from "@components/Settings";
import {AddReview, ChangeSettings, InitializeConfig, RestartApplication, ShowTutorial} from "@wailsjs/go/backend/App";
import {BrowserOpenURL, WindowSetAlwaysOnTop} from "@wailsjs/runtime";
import {Notify} from "@components/Toastify";

export default function Page() {
    const [selected, setSelected] = useState("settings");

    const [hardwareAcceleration, setHardwareAcceleration] = useState(Settings.hardwareAcceleration)
    const [maxWorkers, setMaxWorkers] = useState(Settings.maxWorkers)
    const [formatNumbers, setFormatNumber] = useState(Settings.formatNumbers)
    const [alwaysOnTop, setAlwaysOnTop] = useState(Settings.alwaysOnTop)
    const [lineFormats, setLineFormats] = useState(new Set([`${Settings.lineFormat}`]));
    const [isRestartRequired, setIsRestartRequired] = useState(false)
    const [isChanged, setIsChanged] = useState(false)

    function updateSettings() {
        InitializeConfig().then((result) => {
            setFormatNumber(result.formatNumbers)
            setLineFormats(new Set([`${result.lineFormat}`]))
            setMaxWorkers(result.maxWorkers)
            setHardwareAcceleration(result.hardwareAcceleration)
            setAlwaysOnTop(result.alwaysOnTop)

            Settings.formatNumbers = result.formatNumbers
            Settings.lineFormat = result.lineFormat
            Settings.maxWorkers = result.maxWorkers
            Settings.hardwareAcceleration = result.hardwareAcceleration
            Settings.alwaysOnTop = result.alwaysOnTop
        })
    }

    useEffect(() => {
        updateSettings()
    }, []);

    async function Run() {
        await ChangeSettings({
            hardwareAcceleration: hardwareAcceleration,
            maxWorkers: parseInt(maxWorkers),
            formatNumbers: formatNumbers,
            lineFormat: Array.from(lineFormats)[0],
            alwaysOnTop: alwaysOnTop,
        }).then(r => {
            if (r !== null) {
                Notify("Error", "Something went wrong. Please check your settings.", "", 2);
            } else {
                Notify("Success", "Settings applied successfully.", "", 2);
            }
        })

        WindowSetAlwaysOnTop(alwaysOnTop)

        updateSettings()

        if (isRestartRequired) {
            RestartApplication()
        }

    }

    return (
        <Layout>
            <div className="flex w-full flex-col">
                <Tabs
                    fullWidth={true}
                    aria-label="Options"
                    selectedKey={selected}
                    onSelectionChange={setSelected}
                >
                    <Tab key="settings" title="Settings">
                        <div className={`flex flex-col justify-between h-[530px]`}>

                            <div className={`grid grid-cols-2 gap-2`}>
                                <div className="flex flex-row w-full justify-between p-2 card items-center px-4">
                                    <div className={`flex flex-row gap-1 items-center`}>
                                        <p className={`text-left uppercase font-thin tracking-widest`}>
                                            Hardware Acceleration
                                        </p>
                                        <Divider className={`h-3 mx-1`} orientation={"vertical"}/>
                                        <p className={`text-left uppercase font-thin text-xs text-yellow-400 tracking-widest`}>
                                            Requires Restart.
                                        </p>
                                    </div>
                                    <Checkbox isSelected={hardwareAcceleration}
                                              onValueChange={setHardwareAcceleration} onChange={() => {
                                        setIsRestartRequired(true);
                                        setIsChanged(true);
                                    }}
                                    />
                                </div>
                                <div className="flex flex-row w-full justify-between p-2 card items-center px-4">
                                    <div className={`flex flex-row gap-1 items-center`}>
                                        <p className={`text-left uppercase font-thin tracking-widest`}>
                                            Always on Top
                                        </p>
                                    </div>
                                    <Checkbox isSelected={alwaysOnTop} onValueChange={setAlwaysOnTop} onChange={() => {
                                        setIsChanged(true);
                                    }}
                                    />
                                </div>
                                <div className="flex flex-row w-full justify-between p-2 card items-center px-4">
                                    <p className={`text-left uppercase font-thin tracking-widest`}>
                                        Format Numbers
                                    </p>
                                    <Checkbox isSelected={formatNumbers} onValueChange={setFormatNumber} onChange={() => setIsChanged(true) }/>
                                </div>
                                <div className="flex flex-row w-full justify-between p-2 card items-center px-4">
                                    <p className={`text-left uppercase font-thin tracking-widest`}>
                                        MAX WORKERS
                                    </p>
                                    <Input
                                        type={"number"}
                                        value={maxWorkers}
                                        onValueChange={setMaxWorkers}
                                        classNames={{
                                            base: "w-[65px]",
                                        }}
                                        onChange={() => setIsChanged(true) }
                                    />
                                </div>
                                <div className="flex flex-row w-full justify-between p-2 card items-center px-4 col-span-2">
                                    <p className={`text-left uppercase font-thin tracking-widest`}>
                                        LINE FORMAT
                                    </p>
                                    <Select
                                        size={"md"}
                                        selectedKeys={lineFormats}
                                        onSelectionChange={setLineFormats}
                                        classNames={{
                                            base: "w-80",
                                        }}
                                        onChange={() => setIsChanged(true) }
                                    >
                                        <SelectItem key={"pass"}>PASS</SelectItem>
                                        <SelectItem key={"user:pass"}>XXX:PASS</SelectItem>
                                        <SelectItem key={"pass:user"}>PASS:XXX</SelectItem>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                {
                                    isRestartRequired && (
                                        <div className={`translate-y-[175px] text-xs uppercase text-center text-white/60`}>
                                            Restart required; some values have been modified.
                                        </div>
                                    )
                                }
                            </div>
                            <div className={`translate-y-1/2`}>
                                <Button
                                    isDisabled={!isChanged}
                                    onClick={Run}
                                    variant={"flat"}
                                    fullWidth={true}
                                    className={`my-2 card`}
                                    startContent={<Icon icon={"solar:mouse-minimalistic-bold-duotone"} width={22}
                                                        height={22}/>}
                                >
                                    Save now.
                                </Button>
                            </div>
                        </div>
                    </Tab>
                    <Tab key="information" title="Information">
                        <div className={`flex flex-col gap-2`}>
                            <div className={`flex flex-col`}>
                                <div className={`p-2 card flex flex-row gap-2 items-center`}>
                                    <Image src={"logo.jpg"} width={64} height={64} alt={"logo"}
                                           className={`rounded-lg`}/>
                                    <Divider orientation={"vertical"} className={`h-12 w-[2px] mx-2`}/>
                                    <p className={`text-xl tracking-widest font-thin`}>ATTACK SECURITY PRO</p>
                                    <p className={`text-xs translate-y-[5px] -translate-x-[5px] text-yellow-300 font-thin`}>PROFESSIONAL
                                        EDITION</p>
                                </div>
                            </div>
                            <div className={`flex flex-col`}>
                                <div className={`p-2 card flex flex-col gap-2 items-start`}>
                                    <div className={`flex flex-row gap-2 items-center`}>
                                        <Icon color={"lightblue"} icon={"solar:hand-heart-bold-duotone"} width={32}
                                              height={32}/>
                                        <p className={`text-xl tracking-widest font-thin uppercase`}>Credits</p>
                                    </div>
                                    <div className={`flex flex-row gap-2 items-center p-0.5 text-white/70`}>
                                        Made with <Icon icon={"solar:heart-bold"} color={"red"} width={22}
                                                        height={22}/> in
                                        <Icon icon={"cif:tr"} width={28} height={28} className={`rounded-lg`}/>
                                        <Icon icon={"cif:de"} width={28} height={28} className={`rounded-lg`}/>
                                    </div>
                                </div>
                            </div>
                            <div className={`flex flex-col`}>
                                <div className={`p-2 card flex flex-col gap-2 items-start`}>
                                    <div className={`flex flex-row gap-2 items-center`}>
                                        <Icon color={"lightyellow"} icon={"solar:plug-circle-bold-duotone"}
                                              width={32}
                                              height={32}/>
                                        <p className={`text-xl tracking-widest font-thin uppercase`}>Support</p>
                                    </div>
                                    <div
                                        className={`flex flex-row justify-between w-full items-center p-0.5 text-white/70`}>
                                        <p>
                                            If you experience any issues while using our app, please contact our
                                            spport
                                            team.
                                        </p>
                                        <Link onClick={() => BrowserOpenURL(Links.help)} showAnchorIcon={true}>
                                            Contact us
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className={`flex flex-col`}>
                                <div className={`p-2 card flex flex-col gap-2 items-start`}>
                                    <div className={`flex flex-row gap-2 items-center`}>
                                        <Icon color={"orange"} icon={"solar:danger-circle-bold-duotone"} width={32}
                                              height={32}/>
                                        <p className={`text-xl tracking-widest font-thin uppercase`}>Disclaimer</p>
                                    </div>
                                    <div
                                        className={`flex flex-row justify-between w-full items-center p-0.5 text-white/70`}>
                                        <p>
                                            By using this app, you automatically accept our terms and conditions.
                                        </p>

                                        <Button className={"hover:scale-105 absolute right-1"} variant={"flat"}
                                                onClick={() => BrowserOpenURL(Links.disclaimer)}>View the
                                            Disclaimer</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"absolute bottom-1 w-full text-center"}>
                            <p className={"font-thin uppercase"}>Engineered by <Link onClick={() => {BrowserOpenURL("https://github.com/9dl")}} className={"text-yellow-300 hover:cursor-pointer"}>FOURIER</Link> </p>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </Layout>
    );
}

function RateUs() {
    const [anonymousValue, setAnonymousValue] = useState("");
    const [description, setDescription] = useState("");
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const [rating, setRating] = useState(1);
    const [isntMeetingRequirements, setIsntMeetingRequirements] = useState(false);

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    function Rate() {
        AddReview(description, anonymousValue.toString(), rating.toString()).then(() => {
            setRating(1);
            setDescription("");
            setAnonymousValue("");
            onClose();
        });
    }


    return (
        <>
            <Button className={"hover:scale-105 absolute right-1"} variant={"flat"} onPress={onOpen}>Rate us
                now.</Button>

            <Modal
                backdrop={"opaque"}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-1">Rate <p
                                className={`text-yellow-300 font-extrabold`}>us</p></ModalHeader>
                            <ModalBody>
                                <div className="flex flex-row justify-center">
                                    {[...Array(5)].map((_, index) => (
                                        <Icon
                                            key={index}
                                            icon={"solar:star-bold-duotone"}
                                            color={index < rating ? "yellow" : "gray"}
                                            height={32}
                                            width={32}
                                            onClick={() => handleStarClick(index)}
                                            style={{cursor: 'pointer'}}
                                        />
                                    ))}
                                </div>
                                <Textarea
                                    size={"sm"}
                                    label="Describe your experience."
                                    type="text"
                                    variant="bordered"
                                    value={description}
                                    onValueChange={(value) => {
                                        setDescription(value);
                                        if (value.length <= 15) {
                                            setIsntMeetingRequirements(true);
                                        } else {
                                            setIsntMeetingRequirements(false);
                                        }
                                    }}
                                    className={`overflow-auto`}
                                    isInvalid={isntMeetingRequirements}
                                    errorMessage="The description should be at least 15 characters long."
                                />
                            </ModalBody>
                            <ModalFooter className={"justify-between"}>
                                <div className={`mt-2`}>
                                    <Checkbox
                                        classNames={{
                                            label: "text-small",
                                        }}
                                        isSelected={anonymousValue}
                                        onValueChange={setAnonymousValue}
                                    >
                                        Send anonymously
                                    </Checkbox>
                                </div>
                                <div>
                                    <Button color="success" variant={"flat"} className={`w-32 hover:scale-105`}
                                            onPress={onClose} onClick={Rate} isDisabled={isntMeetingRequirements}>
                                        Rate it
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}