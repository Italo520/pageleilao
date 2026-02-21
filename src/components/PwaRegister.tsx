"use client";
import { useEffect } from "react";

export function PwaRegister() {
    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            "serviceWorker" in navigator &&
            window.serwist !== undefined
        ) {
            window.serwist.register();
        }
    }, []);

    return null;
}
