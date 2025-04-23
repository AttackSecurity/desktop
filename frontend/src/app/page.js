"use client"
import Layout from "@/components/Layout";
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import {Button, CardBody, Divider, Tab, Tabs, Tooltip} from "@nextui-org/react";
import {Changelog as changelogs, DoStartup, Links} from "@/components/Config";
import {
    CheckCrash,
    GetIPv4Address,
    GetStats,
    InitializeConfig,
    ReportCrash,
    ShowTutorial, TutorialCompleted
} from "@wailsjs/go/backend/App";
import GridContainer from "@/components/GridContainer";
import {Added, Fixed, Improved} from "@/components/Dashboard/Changelog";
import {BrowserOpenURL, ClipboardSetText, EventsOn} from "@wailsjs/runtime";
import {Notify} from "@/components/Toastify";
import {Settings} from "@/components/Settings";
import Startup from "@components/Startup";
import {ShowHelp} from "@components/Help";
import CrashReport from "@components/CrashReport";
import BlurEffect from "@components/BlurEffect";

export default function Page() {
    const [TutorialStep, setTutorialStep] = useState(0)
    const [showTutorial, setShowTutorial] = useState(true)
    const [showCrashReport , setShowCrashReport] = useState(false)

    async function checkCrashAndShowReport() {
        const result = await CheckCrash();
        setShowCrashReport(result);
        console.log(`result: ${result}`)
    }


    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (DoStartup) {
                clearInterval(intervalId);
            } else {
                await checkCrashAndShowReport();
            }
            console.log(DoStartup)
        }, 1000);

        ShowTutorial().then((result) => {
            setShowTutorial(result)
        })

        InitializeConfig().then((result) => {
            Settings.formatNumbers = result.formatNumbers
            Settings.lineFormat = result.lineFormat
            Settings.maxWorkers = result.maxWorkers
            Settings.hardwareAcceleration = result.hardwareAcceleration
            Settings.alwaysOnTop = result.alwaysOnTop
        })

        if (TutorialStep === 5 ){
            Notify("Tutorial Completed", "Congratulations! You've completed the tutorial. Enjoy exploring!")
        }
    }, [TutorialStep]);

    function increaseTutorial() {
        setTutorialStep(TutorialStep + 1)
        if (TutorialStep === 4) {
            TutorialCompleted();
        }
    }

    const tutorialSteps = [
        {
            step: 0,
            title: "(1/5) Home",
            description: "Where it begins 😀",
        },
        {
            step: 1,
            title: "(2/5) Password Validator",
            description: "Validate a Password List using your Own or Given Presets",
        },
        {
            step: 2,
            title: "(3/5) Password Modifier",
            description: "Modify a Password List with your own or given Presets",
        },
        {
            step: 3,
            title: "(4/5) Password Analysis",
            description: "Analyse a Password List shows Statistics and generates Regex Preset",
        },
        {
            step: 4,
            title: "(5/5) Smart Filter",
            description: "Filter out unwanted stuff in a .txt file and make it to ur geschwünschte format",
        }
    ];

    return (
        <>
            { showTutorial && (
                <>
                    {tutorialSteps.map(step => (
                        <ShowHelp
                            key={step.step}
                            x={200 + step.step * 60}
                            y={90}
                            Open={TutorialStep === step.step}
                            OnCloseFunc={increaseTutorial}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </>
            )}

            {
                showCrashReport && (
                    <CrashReport />
                )
            }

            <Layout>
                <GridContainer cols={3} inline={3}>
                    <Card
                        title={"Developed By"}
                        icon={"solar:station-minimalistic-bold-duotone"}
                        description={"Fourier (github.com/9dl)"}
                    />
                    <Card
                        title={"Version"}
                        icon={"solar:history-2-bold-duotone"}
                        description={require("../../package.json").version}
                    />
                </GridContainer>
                <div className={`p-2`}>
                    <Divider/>
                </div>
                <GridContainer cols={2} inline={true} customGap={4}>
                    <Changelogs />
                    <Socials/>
                </GridContainer>
            </Layout>
        </>
    );
}

function Socials() {
    return (
        <div className={`flex-col card h-full w-full p-3 min-h-[290px]`}>
            <p className="text-2xl flex-grow text-center mx-auto font-thin tracking-widest uppercase">
                Reach Us
            </p>
            <Divider className={`my-2 h-[1.5px] rounded-lg`}/>
            <div className={`card p-2 text-left space-y-1`}>
                <SocialsButton title={"Github"} icon={"logos:github-icon"} link={Links.github}/>
                <SocialsButton title={"Website"} icon={"solar:link-minimalistic-2-bold-duotone"} link={Links.website}/>
            </div>
        </div>
    )
}

function Changelogs() {
    return (
        <div className={`flex-col card h-full w-full p-3 min-h-[290px]`}>
            <p className="text-2xl flex-grow text-center mx-auto font-thin tracking-widest uppercase">
                Changelogs
            </p>
            <Divider className={`my-2 h-[1.5px] rounded-lg`}/>
            <div className={`card p-2 text-left`}>
                {changelogs.added.length > 0 && (
                    <Added changeList={changelogs.added}/>
                )}
                {changelogs.improved.length > 0 && (
                    <Improved changeList={changelogs.improved}/>
                )}
                {changelogs.fixed.length > 0 && (
                    <Fixed changeList={changelogs.fixed}/>
                )}
            </div>
        </div>
    )
}


function Card({title, icon, description, showCopy = false, blurDisabled = true}) {
    const [isHovered, setIsHovered] = useState(false);

    function copyToClipboard(text) {
        ClipboardSetText(text)
        Notify("Success", "The content has been successfully copied to the clipboard.", null, 1);
    }

    return (
        <div key={title} className={`flex-col card h-full w-full p-3`}>
            <div className="flex items-center w-full">
                <Icon icon={icon} height={36} width={36}/>
                <p className="text-xl flex-grow text-center mx-auto font-thin tracking-widest uppercase">
                    {title}
                </p>
                {/*
                <Tooltip showArrow={true} content="I am a tooltip">
                    <Icon icon={"solar:question-circle-bold-duotone"} className={`translate-x-2 -translate-y-[14px] opacity-30`} height={21} width={21}/>
                </Tooltip>
                */}
            </div>
            <div className={`cardNoRadius rounded-md my-1 text-white/70`}>
                <p
                    className={"transition-filter duration-500"}
                    style={{
                        filter: blurDisabled || isHovered ? 'none' : 'blur(4px)',
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {description || "No value found."}
                </p>
                {showCopy &&
                    <button
                        onClick={() => copyToClipboard(description)}
                        className="absolute top-1/2 -right-1 transform -translate-y-1/2 text-white font-bold py-1 px-3 rounded-lg transition-all duration-500 cursor-pointer"
                    >
                        <Icon icon="solar:copy-bold-duotone"/>
                    </button>
                }
            </div>
        </div>
    )
}


function SocialsButton({title, icon, link}) {
    return (
        <Button key={title} onClick={() => BrowserOpenURL(link)} variant={"flat"} color={"default"} fullWidth={true}
                className={`flex justify-between hover:scale-[1.02]`}
                startContent={<Icon icon={icon} height={24} width={24}/>}>
            <p className={`text-lg font-thin uppercase`}>
                {title}
            </p>
            <span/>
        </Button>
    )
}

const StatCard = ({ entry, module, top }) => {
    const { created_at, failed, lines, passed, preset, applicant } = entry;

    return (
        <div className="card p-2 my-1 flex flex-col items-center">
            <div className={`flex flex-row justify-between w-full`}>
                <p className={`text-sm text-default-700 uppercase font-thin tracking-widest`}>
                    {module}
                </p>
                <p className={`text-sm text-default-700 uppercase font-thin tracking-widest`}>
                    {timeAgo(created_at)}
                </p>
            </div>
            <div className={`flex flex-row justify-between w-full`}>
                <div>
                    <p className={`text-sm text-white/70 uppercase font-light tracking-wide`}>
                        TOP:
                        <span className={`pl-1 text-cyan-400/60`}>{top + 1}</span>
                    </p>
                    <p className={`text-sm text-white/70 uppercase font-light tracking-wide`}>
                        User:
                        <span className={`pl-1 text-yellow-400/60`}>{applicant.name}</span>
                    </p>
                </div>
                <div className={`grid grid-cols-2 text-right space-x-3`}>
                    <BlurEffect blurValue={"lg"} scaleValue={105}>
                        <p className={`text-sm text-white/70 uppercase font-light tracking-wide`}>
                            Failed:
                            <span className={`pl-1 text-red-400/60`}>{failed}</span>
                        </p>
                    </BlurEffect>
                    <BlurEffect blurValue={"lg"} scaleValue={105}>
                        <p className={`text-sm text-white/70 uppercase font-light tracking-wide`}>
                            Lines:
                            <span className={`pl-1 text-yellow-400/60`}>{lines}</span>
                        </p>
                    </BlurEffect>
                    <BlurEffect blurValue={"lg"} scaleValue={105}>
                        <p className={`text-sm text-white/70 uppercase font-light tracking-wide`}>
                            Passed:
                            <span className={`pl-1 text-indigo-400/60 underline underline-offset-2`}>{passed}</span>
                        </p>
                    </BlurEffect>
                    <BlurEffect blurValue={"lg"} scaleValue={105}>
                        <p className={`text-sm text-white/70 uppercase font-light tracking-wide`}>
                            Preset:
                            <span className={`pl-1 text-pink-400/60`}>{preset}</span>
                        </p>
                    </BlurEffect>
                </div>
            </div>
        </div>
    );
};

function timeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / (3600 * 24));

    if (days > 30) {
        return `30+ days ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        return 'Today';
    }
}