"use client"
import Layout from "@/components/Layout";
import {useEffect, useRef, useState} from "react";
import {Button, Divider, Input, Select, SelectItem, Textarea} from "@nextui-org/react";
import GridContainer from "@/components/GridContainer";
import HighlightWithinTextarea from "react-highlight-within-textarea";
import {FileDialog, RunSmartFilter} from "@wailsjs/go/backend/App";
import {Icon} from "@iconify/react";
import {OnFileDrop, OnFileDropOff} from "@wailsjs/runtime";

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("Waiting...");
    const [presets, setPresets] = useState("%extract%:%extract%");
    const [format, setFormat] = useState("%s:%s");
    const [result, setResult] = useState(0);
    const [blockSize, setBlockSize] = useState(1);
    const onChange = (value) => setPresets(value);
    const onChange2 = (value) => setFormat(value);
    const [filePath, setFilePath] = useState("");
    const [mode, setMode] = useState(new Set(["batch"]));
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

        const BlockSize = parseInt(blockSize);
        const lines = await RunSmartFilter(Array.from(mode)[0], filePath, presets, format, BlockSize);
        setResult(lines.length)

        setIsLoading(false)
        setStatus("Done.")
    }

    return (
        <Layout isRunning={status === "Processing..."}>
            <GridContainer cols={3} customGap={3} inline={true}>
                <div className={`min-h-[36rem] max-h-[36rem] flex-col card h-full w-full p-3`}>
                    <p className="text-2xl flex-grow text-center mx-auto font-thin tracking-widest uppercase">
                        SETTINGS
                    </p>
                    <Divider className={`my-2 h-[1.5px] rounded-lg`}/>
                    <div className={`flex flex-col gap-3`}>
                        <div>
                            <div className={`flex flex-row gap-1 items-center`}>
                                <p className={`text-left uppercase font-thin tracking-widest`}>
                                    PATTERN
                                </p>
                                <Divider className={`h-3 mx-1`} orientation={"vertical"}/>
                                <p className={`text-left uppercase font-thin text-xs text-white/40 tracking-widest`}>
                                    Specifies text structure to identify and extract data from.
                                </p>
                            </div>
                            <div className={`card p-3 max-h-64 overflow-auto`}>
                                <HighlightWithinTextarea
                                    value={presets}
                                    highlight={{
                                        highlight: /(%extract%)/g,
                                        className: "p-[1px] rounded-md bg-slate-300/40 text-sm uppercase font-thin tracking-wide"
                                    }}
                                    onChange={onChange}
                                />
                            </div>
                        </div>
                        <div>
                            <div className={`flex flex-row gap-1 items-center`}>
                                <p className={`text-left uppercase font-thin tracking-widest`}>
                                    Format
                                </p>
                                <Divider className={`h-3 mx-1`} orientation={"vertical"}/>
                                <p className={`text-left uppercase font-thin text-xs text-white/40 tracking-widest`}>
                                    Defines output structure using placeholders for extracted data.
                                </p>
                            </div>
                            <div className={`card p-3 max-h-14 overflow-auto`}>
                                <HighlightWithinTextarea
                                    value={format}
                                    highlight={{
                                        highlight: /(%s)/g,
                                        className: "p-[1px] rounded-md bg-slate-200/40 text-sm uppercase font-thin tracking-wide"
                                    }}
                                    onChange={onChange2}
                                />
                            </div>
                        </div>
                        {
                            mode.has("batch") && (
                                <div>
                                    <div className={`flex flex-row gap-1 items-center`}>
                                        <p className={`text-left uppercase font-thin tracking-widest`}>
                                            BlockSize
                                        </p>
                                        <Divider className={`h-3 mx-1`} orientation={"vertical"}/>
                                        <p className={`text-left uppercase font-thin text-xs text-white/40 tracking-widest`}>
                                            Block size specifies how many lines are processed at once.
                                        </p>
                                    </div>
                                    <div className={`card p-3`}>
                                        <Input
                                            value={blockSize}
                                            onValueChange={setBlockSize}
                                            type="number"
                                            minLength={1}
                                        />
                                    </div>
                                </div>
                            )
                        }
                        <div>
                            <div className={`flex flex-row gap-1 items-center`}>
                                <p className={`text-left uppercase font-thin tracking-widest`}>
                                    Mode
                                </p>
                                <Divider className={`h-3 mx-1`} orientation={"vertical"}/>
                                <p className={`text-left uppercase font-thin text-xs text-white/40 tracking-widest`}>
                                    Adjusts processing based on settings.
                                </p>
                            </div>
                            <div className={`card p-3`}>
                                <Select
                                    placeholder="Select an Mode"
                                    value={0}
                                    size={"md"}
                                    selectedKeys={mode}
                                    onSelectionChange={setMode}
                                >
                                    <SelectItem key={"batch"} description={"Uses predefined block sizes for data handling."}>Batch Processing</SelectItem>
                                    <SelectItem key={"sequential"} description={"Processes data line-by-line sequentially"}>Line Sequential</SelectItem>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`min-h-[36rem] max-h-[36rem] flex-col card h-full w-full p-3`}>
                    <p className="text-2xl flex-grow text-center mx-auto font-thin tracking-widest uppercase">
                        RESULT
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
                            <p>EXTRACTED:</p>
                            <p>{result || "0"}</p>
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
            </GridContainer>
        </Layout>
    );
}
