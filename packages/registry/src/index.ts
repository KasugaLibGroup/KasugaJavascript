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

declare global{
    export const module : {
        require: (id:string)=>any;
    };
}

const native = (typeof module['require'] !== "undefined" && module['require']("kasuga:registry")) ||  globalThis['KASUGA_LIB_REGISTRY_HOOK'] || createSimpleRegistry();

export interface Registries{}

export function getRegistry<T extends string = keyof Registries>(registry:T):Registry<T extends keyof Registries ? Registries[T] : any>{
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