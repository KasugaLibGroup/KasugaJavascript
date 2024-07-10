function injectedRequire(original:typeof require){
    return new Proxy(original,{
        apply(target: any, thisArg: any, argArray: any[]): any {
            const [path] = argArray;
            if(path === "kasuga:internal/registry"){
                return {
                    getRegistry(name:string){
                        return {
                            register(name:string,item:any){
                                console.log(`Registered ${name} with ${item}`)
                            }
                        }
                    }
                }
            }
            return original.apply(thisArg,argArray);
        }
    })
}
globalThis.require = injectedRequire(globalThis.require || (()=>{
    throw new Error("")
}));