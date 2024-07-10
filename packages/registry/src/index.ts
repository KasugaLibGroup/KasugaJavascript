function createSimpleRegistry(){
    const registry =  {
        registry:{},
        getRegistry(id:string){
            const registry = this.registry[id] || (this.registry[id] = {});
            return {
                register(name:string,item:any){
                    registry[name] = item;
                },
                getItem(name:string) {
                    return registry[name];
                }
            }
        }
    }

    globalThis['KASUGA_LIB_REGISTRY_HOOK'] = registry;
    return registry;
}

const native = (typeof require !== "undefined" && require("kasuga:registry")) ||  globalThis['KASUGA_LIB_REGISTRY_HOOK'] || createSimpleRegistry();

export interface Registries{}

export function getRegistry<T extends keyof Registries>(registry:T):Registry<Registries[T]>{
    return new Registry(registry);
}

export class Registry<T>{
    nativeInterface:any
    constructor(name:string) {
        this.nativeInterface = native.getRegistry(name);
    }

    register(name:string,item:T){
        this.nativeInterface.register(name,item);
    }
}

export default {
    getRegistry
}