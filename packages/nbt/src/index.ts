const nbt = require("kasuga:nbt");
import type { CompoundTagWrapper } from './types';

export function createCompoundTag(): CompoundTagWrapper {
    return nbt.createCompoundTag();
}

export type { CompoundTagWrapper } from './types'; 