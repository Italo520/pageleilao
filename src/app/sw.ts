import { defaultCache } from "@serwist/next/worker";
import { type PrecacheEntry, Serwist } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
    __SW_MANIFEST: Array<PrecacheEntry | string>;
};


const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    precacheOptions: {
        cleanupOutdatedCaches: true,
    },
    runtimeCaching: defaultCache,
});

serwist.addEventListeners();

