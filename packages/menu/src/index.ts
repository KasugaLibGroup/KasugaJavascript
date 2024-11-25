import {CompoundTagWrapper, createCompoundTag} from "@kasugalib/nbt";
import {getRegistry, Registries, Registry} from "@kasugalib/registry";



type MenuType = (handle:MenuHandle)=>void | (()=>void);

declare module "@kasugalib/registry"{
    interface Registries {
        'kasuga_lib:menu': MenuType
    }
}


const registry : Registry<MenuType> = getRegistry("kasuga_lib:menu");

export interface MenuHandle{
    addEventListener(name: string, callback:Function);
    removeEventListener(name: string, callback:Function);
    inject(name: string);
    broadcast()
}


export interface ConnectionInfo {}

export interface Channel {
    source(): ConnectionInfo;
    destination(): ConnectionInfo;
}

export interface ChannelHandler {
    sendMessage(message: CompoundTagWrapper): void;
    close(): void;
}

export abstract class MenuEntry{
    protected handle: MenuHandle;
    _connectHandler = (channel, handler)=>this['onConnection'](channel, handler);
    _disconnectHandler = (channel, handler)=>this['onDisconnection'](channel, handler);
    _messageHandler = (message, channel, handler)=>this['onMessage'](message, channel, handler);

    constructor(handle: MenuHandle) {
        this.handle = handle;
        handle.addEventListener("connection",this._connectHandler)
        handle.addEventListener("disconnection",this._disconnectHandler)
        handle.addEventListener("message",this._messageHandler)
    }

    inject<T>(name:string):(T|null){
        return this.handle.inject(name);
    }

    onConnection(channel: Channel, channelHandler: ChannelHandler){}

    onDisconnection(channel: Channel, channelHandler: ChannelHandler){}

    onMessage(message: CompoundTagWrapper,channel: Channel, channelHandler: ChannelHandler){}

    close() {
        this.handle.removeEventListener("connection",this._connectHandler)
        this.handle.removeEventListener("disconnection",this._disconnectHandler)
        this.handle.removeEventListener("message",this._messageHandler)
        this.onClose();
    }

    onClose(){}
}

export function register(location:string ,menu: (handler) => MenuEntry){
    registry.register(location, (handle)=>{
        const menuInstance = menu(handle);
        return ()=>{
            menuInstance.close();
        }
    });
}