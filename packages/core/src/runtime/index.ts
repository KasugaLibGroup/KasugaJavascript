import {polyfillTimer} from "./timer";
import {polyfillLoader} from "./loader";
import {polyfillWebsocket} from "./websocket";
export function initializeRuntime(target:Partial<typeof globalThis>){
    Object.defineProperty(globalThis,"window",{
        value: globalThis,
        configurable: false
    })

    Object.defineProperty(globalThis,"global",{
        value: globalThis,
        configurable: false
    });

    Object.defineProperty(globalThis,"self",{
        value: globalThis,
        configurable: false
    })

    polyfillLoader(target);
    polyfillTimer(target);
    polyfillWebsocket(target);
}

export type {} from './native'