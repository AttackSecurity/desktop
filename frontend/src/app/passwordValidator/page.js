"use client"
import Layout from "@/components/Layout";
import {Icon} from "@iconify/react";
import {useEffect, useMemo, useState} from "react";
import {Button, Divider, Input, Listbox, ListboxItem} from "@nextui-org/react";
import {CheckCustomPolicy, FileDialog, GetServiceNames, RunPasswordValidator} from "@wailsjs/go/backend/App";
import GridContainer from "@/components/GridContainer";
import {Chart} from "@/components/Chart";
import {OnFileDrop, OnFileDropOff} from "@wailsjs/runtime";
import {Settings} from "@/components/Settings";
import {Notify} from "@/components/Toastify";

export default function Page() {
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [items, setItems] = useState(new Set([]));
    const [search, setSearch] = useState("");
    const [filePath, setFilePath] = useState("");
    const [customFilePath, setCustomFilePath] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("Waiting...");

    const [lines, setLines] = useState([0,0]);
    const [passed, setPassed] = useState([0,0]);
    const [failed, setFailed] = useState([0,0]);


    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys]
    );

    const addToArray = (setState, value) => {
        setState(prevArray => {
            return [...prevArray, value];
        });
    };

    const filteredItems = useMemo(() => {
        return [...items].filter(item => item.toLowerCase().includes(search.toLowerCase()));
    }, [items, search]);

    useEffect(() => {
        OnFileDrop((x, y, paths) => {
            setFilePath(paths[0])
        }, true);
        return () => OnFileDropOff();
    }, []);


    useEffect(() => {
        GetServiceNames().then((result) => {
            setItems(result)
        })
    }, []);

    function fileDialog() {
        FileDialog("txt").then((result) => {
            setFilePath(result)
        })
    }

    async function useCustomPreset() {
        if (customFilePath === "") {
            await FileDialog("ats").then(async (result) => {
                setCustomFilePath(result)

                CheckCustomPolicy(result)
                    .then(() => {
                        if (result !== "") {
                            setItems(new Set(["Custom"]));
                            setSelectedKeys(new Set(["Custom"]));
                        }
                    })
                    .catch((error) => {
                        setCustomFilePath("")
                        Notify("Something went wrong...", "Invalid Custom Configuration detected:", `${error}`);
                    });
            })
        } else {
            GetServiceNames().then((result) => {
                setItems(result)
            })
            setSelectedKeys(new Set([]));
            setCustomFilePath("")
        }
    }

    function Run() {
        setIsLoading(true)
        setStatus("Processing...")

        RunPasswordValidator(filePath, selectedValue, customFilePath).then((result) => {
            addToArray(setLines, result.Lines);
            addToArray(setPassed, result.Passed);
            addToArray(setFailed, result.Failed);
        })
        setIsLoading(false)
        setStatus("Done.")
    }

    return (
        <Layout isRunning={status === "Processing..."}>
            <GridContainer cols={3} customGap={3} inline={true}>
                <Chart title={"Lines"} scores={lines}/>
                <Chart title={"Passed"} scores={passed}/>
                <Chart title={"Failed"} scores={failed}/>
            </GridContainer>
            <div className={`px-2`}>
                <Divider/>
            </div>
            <GridContainer cols={3} customGap={3} inline={true}>
                <div className={`min-h-[25rem] max-h-[25rem] flex-col card h-full w-full p-3`}>
                    <p className="text-2xl flex-grow text-center mx-auto font-thin tracking-widest uppercase">
                        Launchpad
                    </p>
                    <Divider className={`my-2 h-[1.5px] rounded-lg`}/>
                    <div
                        className={`flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1`}>
                        <p>File Path:</p>
                        <p>{filePath || "Not set"}</p>
                    </div>
                    <div
                        className={`flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1`}>
                        <p>LINE FORMAT:</p>
                        <p>{Settings.lineFormat}</p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <div onClick={fileDialog}
                             className="h-[200px] items-center drag-and-drop flex flex-col items-center justify-center w-full transition-colors duration-200 ease-in-out h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Icon icon={"solar:cloud-upload-bold-duotone"} width={38}/>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                    className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">.txt only</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        isDisabled={!filePath || !selectedValue}
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

                <div className={`min-h-[25rem] max-h-[25rem] flex-col card h-full w-full p-3`}>
                    <p className="text-2xl flex-grow text-center mx-auto font-thin tracking-widest uppercase">
                        PRESETS
                    </p>
                    <Divider className={`my-2 h-[1.5px] rounded-lg`}/>
                    <div
                        className={`flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1`}>
                        <p>PRESET:</p>
                        <p>{selectedValue || "Not set"}</p>
                    </div>
                    <div
                        className={`flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1`}>
                        <p>STATUS:</p>
                        <p>{status}</p>
                    </div>
                    {customFilePath !== "" ? (
                        <div
                            className="flex flex-row justify-between text-sm uppercase cardNoRadius rounded-md px-2 my-1">
                            <p>FILE:</p>
                            <p>{customFilePath || "Something went wrong."}</p>
                        </div>
                    ) : null}
                    <Input
                        label="Search"
                        variant={"faded"}
                        isClearable
                        radius="lg"
                        size={"sm"}
                        placeholder="Type to search..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <div className="flex flex-col card my-2">
                        <Listbox
                            aria-label="Single selection example"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                            classNames={{
                                list: "max-h-[130px] overflow-auto p-1",
                            }}
                            emptyContent={
                                <div className={`flex flex-row gap-2 justify-center text-white/70 items-center`}>
                                    <p>No items found </p>
                                    <Icon icon={"twemoji:sad-but-relieved-face"} width={22} height={22}/>
                                </div>
                            }
                        >
                            {[...filteredItems].map((item) => (
                                <ListboxItem key={item}>{item}</ListboxItem>
                            ))}
                        </Listbox>
                    </div>
                    <Button variant={"flat"} color={"primary"} fullWidth={true} onClick={useCustomPreset}>
                        {customFilePath ? "Go back to presets" : "Load Custom Preset"}
                    </Button>
                </div>
            </GridContainer>
        </Layout>
    );
}
