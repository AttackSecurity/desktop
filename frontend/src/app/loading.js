import {Spinner} from "@nextui-org/react";

export default function Loading() {
    return (
        <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-[#2c2d31]">
            <Spinner
                label="Loading."
                size={"lg"}
                color={"current"}
                classNames={{
                    base: "scale-125",
                    label: "text-sm uppercase font-thin tracking-widest"
                }}
            />
        </div>
    )
}