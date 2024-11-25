declare global{
    export const module : {
        require: (id:string)=>any;
    };
}

const native = (typeof module['require'] !== "undefined" && module['require']("kasuga:nbt"))

import type { CompoundTagWrapper } from './types';

export function createCompoundTag(): CompoundTagWrapper {
    return native.createCompoundTag();
}

export type { CompoundTagWrapper } from './types'; 