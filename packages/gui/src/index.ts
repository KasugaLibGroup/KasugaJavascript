import Registries from '@kasugalib/registry'
import {RootContainer} from "./minecraft";

declare module '@kasugalib/registry'{
    export interface Registries{
        'kasuga_lib:gui': (root:RootContainer)=>void
    }
}

export function registerComponent(id:string, render:(root:RootContainer)=>void){
    Registries.getRegistry("kasuga_lib:gui").register(id,render)
}

export default {
    registerComponent
}


export * from './minecraft'