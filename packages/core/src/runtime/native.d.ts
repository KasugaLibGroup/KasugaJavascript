declare module globalThis{
    var require : (module:string)=>any;
}

declare global{
    var require : (module:string)=>any;
}

declare module globalThis{
    let setTimeout: (handler: TimerHandler, timeout?: number | undefined, ...args: any[]) => number;
    let setInterval: (handler: TimerHandler, interval?: number | undefined, ...args: any[]) => number;
    let clearTimeout: (handler: number) => void;
    let clearInterval: (handler: number) => void;
}