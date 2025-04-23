"use client"
import Layout from "@/components/Layout";
import {useEffect, useRef, useState} from "react";
import {Button, Divider, Input, Select, SelectItem, Textarea, Tooltip} from "@nextui-org/react";
import GridContainer from "@/components/GridContainer";
import HighlightWithinTextarea from "react-highlight-within-textarea";
import {FileDialog, RunPasswordAnalysis, RunSmartFilter} from "@wailsjs/go/backend/App";
import {Icon} from "@iconify/react";
import {ClipboardSetText, OnFileDrop, OnFileDropOff} from "@wailsjs/runtime";
import {Notify} from "@components/Toastify";
import {Settings} from "@components/Settings";

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("Waiting...");
    const [result, setResult] = useState({
        TotalPasswords: 0,
        UniquePasswords: 0,
        AveragePasswordLength: 0,
        MinimumPasswordLength: 0,
        MaximumPasswordLength: 0,
        LowercasePercentage: 0,
        MostUsedLowercase: '?',
        UppercasePercentage: 0,
        MostUsedUppercase: '?',
        DigitsPercentage: 0,
        MostUsedDigit: '?',
        TotalSymbols: 0,
        MostUsedSymbol: '?',
        Top3MostUsedChars: ["?", "?", "?"],
        RegexPattern: 'Waiting...',
        Error: '',
        Success: false,
    });
    const [filePath, setFilePath] = useState("");

    function fileDialog() {
        FileDialog("txt").then((result) => {
            setFilePath(result)
        })
    }

    useEffect(() => {
        OnFileDrop((x, y, paths) => {
            setFilePath(paths[0])
        }, true);
        return () => OnFileDropOff();
    }, []);

    async function Run() {
        setIsLoading(true)
        setStatus("Processing...")

        const result = await RunPasswordAnalysis(filePath)
        setResult(result)

        setIsLoading(false)
        setStatus("Done.")
    }

    function copyToClipboard(text) {
        ClipboardSetText(text)
        Notify("Success", "The content has been successfully copied to the clipboard.", null, 1);
    }

    return (
        <Layout isRunning={status === "Processing..."}>
            <GridContainer cols={3} customGap={3} inline={true}>
                <div className={`min-h-[36rem] max-h-[36rem] flex-col card h-full w-full p-3`}>
                    <p className="text-2xl flex-grow text-center mx-auto font-thin tracking-widest uppercase">
                        LAUNCHPAD
                    </p>
                    <Divider className={`my-2 h-[1.5px] rounded-lg`}/>
                    <div className={`card text-left p-2 text-white/60 h-full`}>
                        <div
                            className={`flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1`}>
                            <p>File Path:</p>
                            <p>{filePath || "Not set"}</p>
                        </div>
                        <div
                            className={`flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1`}>
                            <p>STATUS:</p>
                            <p>{status || "Not set"}</p>
                        </div>
                        <div
                            className={`flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1`}>
                            <p>LINE FORMAT:</p>
                            <p>{Settings.lineFormat}</p>
                        </div>
                        <Divider className={`my-2 h-[1.5px] rounded-lg`}/>
                        <div className="flex items-center justify-center w-full">
                            <div onClick={fileDialog}
                                 className="h-[150px] items-center drag-and-drop flex flex-col items-center justify-center w-full transition-colors duration-200 ease-in-out h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Icon icon={"solar:cloud-upload-bold-duotone"} width={38}/>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                        className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">.txt only</p>
                                </div>
                            </div>
                        </div>
                        <Button
                            isDisabled={!filePath}
                            isLoading={isLoading}
                            onClick={Run}
                            color="default"
                            variant={"flat"}
                            fullWidth={true}
                            className={`my-2 card`}
                            startContent={isLoading ? null :
                                <Icon icon={"solar:mouse-minimalistic-bold-duotone"} width={22} height={22}/>}
                            spinner={
                                <svg
                                    className="animate-spin h-5 w-5 text-current"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        fill="currentColor"
                                    />
                                </svg>
                            }
                        >
                            {isLoading ? "Loading..." : "Run now."}
                        </Button>
                    </div>
                </div>
                <div className={`min-h-[36rem] max-h-[36rem] flex-col card h-full w-full p-3`}>
                    <p className="text-2xl flex-grow text-center mx-auto font-thin tracking-widest uppercase">
                    RESULTS
                    </p>
                    <Divider className={`my-2 h-[1.5px] rounded-lg`}/>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Total Passwords:</p>
                        <p>{result.TotalPasswords}</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Unique Passwords:</p>
                        <p>{result.UniquePasswords}</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Average Password Length:</p>
                        <p>{Math.round(result.AveragePasswordLength)}</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Minimum Password Length:</p>
                        <p>{result.MinimumPasswordLength}</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Maximum Password Length:</p>
                        <p>{result.MaximumPasswordLength}</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Lowercase Percentage:</p>
                        <p>{Math.round(result.LowercasePercentage)}%</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Most Used Lowercase:</p>
                        <p>{result.MostUsedLowercase}</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Uppercase Percentage:</p>
                        <p>{Math.round(result.UppercasePercentage)}%</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Most Used Uppercase:</p>
                        <p>{result.MostUsedUppercase}</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Digits Percentage:</p>
                        <p>{Math.round(result.DigitsPercentage)}%</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Most Used Digit:</p>
                        <p>{result.MostUsedDigit}</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Total Symbols:</p>
                        <p>{result.TotalSymbols}</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Most Used Symbol:</p>
                        <p>{result.MostUsedSymbol}</p>
                    </div>
                    <div className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                        <p>Top 3 Most Used Characters:</p>
                        <p>{result.Top3MostUsedChars.join(', ')}</p>
                    </div>
                    <Tooltip showArrow={true} delay={100} closeDelay={100} placement={"bottom"} content={result.RegexPattern}>
                        <div
                            className="flex flex-row justify-between text-sm items-center uppercase cardNoRadius rounded-md px-2 my-1">
                            <p>Regex Pattern:</p>
                            <p className={`px-2 mx-4 m-1 card truncate normal-case max-w-[360px]`}>{result.RegexPattern}</p>
                            <button
                                onClick={() => copyToClipboard(result.RegexPattern)}
                                className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-white font-bold py-1 px-3 rounded-lg transition-all duration-500 cursor-pointer"
                            >
                                <Icon icon="solar:copy-bold-duotone" width={16}/>
                            </button>
                        </div>
                    </Tooltip>
                    <p className="text-default-500/70 uppercase text-sm">Regex pattern derived from comprehensive data
                        analysis</p>
                </div>
            </GridContainer>
        </Layout>
    );
}
