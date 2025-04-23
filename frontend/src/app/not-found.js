"use client"

import Layout from "@/components/Layout";
import BlurEffect from "@/components/BlurEffect";

export default function NotFound() {
    return (
        <Layout>
            <div className={`flex flex-col -space-y-2 h-full w-full justify-center items-center text-center`}>
                <BlurEffect blurValue={"lg"} scaleValue={"105"}>
                    <p
                        className={`text-white/70 text-2xl font-thin tracking-widest`}
                    >
                        SOMETHING WENT WRONG.
                    </p>
                    <p
                        className={`text-white/70 text-2xl font-thin tracking-widest`}
                    >
                        CONTACT <span className={`underline underline-offset-2 tracking-tight`}>SUPPORT</span>
                    </p>
                </BlurEffect>
            </div>
        </Layout>
    )
}