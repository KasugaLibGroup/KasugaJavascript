export interface RootContainer<R extends Node = Node, T extends Node = Node> {
    getRootNode() : R;
    createNode(name:string): T;
    createTextNode(name:string, content:string): T;
}

export interface Node {
    addChildAt(index:number, child:Node):void;
    addChild(child:Node):void;
    removeChild(child:Node):void;
    addEventListener(eventName: string, callback: Function):void;
    removeEventListener(eventName: string, callback: Function):void;
    dispatchEvent(eventName: string, event: any):void;
    getAttribute(name:string):string | null;
    setAttribute(name:string,value:string|null):void;
    close():void;
    hasFeature(featureName: string): boolean;
}

export interface StyleSheet{
    setStyle(name:string, value:string):void;
    removeStyle(name:string):void;
}

export interface GuiNode extends Node{
    styles:StyleSheet
}

export interface GuiText extends Node{}