export interface CompoundTagWrapper {
    getType(key: string): "byte" | "short" | "int" | "long" | "float" | "double" | 
                         "byteArray" | "string" | "list" | "compound" | "intArray" | 
                         "longArray" | "numeric" | "end";

    getByte(key: string): number;
    getShort(key: string): number;
    getInt(key: string): number;
    getLong(key: string): bigint;
    getFloat(key: string): number;
    getDouble(key: string): number;
    getByteArray(key: string): Int8Array;
    getString(key: string): string;
    getCompound(key: string): CompoundTagWrapper;
    getIntArray(key: string): Int32Array;
    getLongArray(key: string): BigInt64Array;

    putByte(key: string, value: number): void;
    putShort(key: string, value: number): void;
    putInt(key: string, value: number): void;
    putLong(key: string, value: bigint): void;
    putFloat(key: string, value: number): void;
    putDouble(key: string, value: number): void;
    putByteArray(key: string, value: Int8Array): void;
    putString(key: string, value: string): void;
    putCompound(key: string, value: CompoundTagWrapper): void;
    putIntArray(key: string, value: Int32Array): void;
    putLongArray(key: string, value: BigInt64Array): void;
} 