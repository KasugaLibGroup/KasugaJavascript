import {initializeRuntime} from "./runtime";
import {KASUGA_LIB_BRAND} from "./brand";

if('KASUGA_POLYFILL' in globalThis){
    console.warn("Kasuga Lib is already running. (have multi-instance?)")
}else{
    globalThis['KASUGA_POLYFILL'] = true;
    if('navigator' in globalThis) {
        console.info(KASUGA_LIB_BRAND);
        console.info("Kasuga Lib Javascript Runtime V1.0 - browser mode")
    }else{
        console.info("Kasuga Lib Javascript Runtime V1.0 - minecraft native mode")
        initializeRuntime(globalThis);
    }
}
export type {} from "./runtime"