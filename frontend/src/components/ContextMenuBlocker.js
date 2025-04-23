"use client"
import { useEffect } from 'react';

export default function Blocker() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "development") {
            const disableRightClick = (event) => {
                event.preventDefault();
            };
            document.addEventListener('contextmenu', disableRightClick);
            return () => {
                document.removeEventListener('contextmenu', disableRightClick);
            };
        }
    }, []);
};
