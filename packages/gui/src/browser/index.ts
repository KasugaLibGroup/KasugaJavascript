import {GuiNode, Node, RootContainer} from "../minecraft";
import {adaptStyle} from "./style";

const DOMSymbol = Symbol("DOM");
const DOMContainerSymbol = Symbol("DOMContainer");
const GetConfig = Symbol("Get Config");

export function createContainerFor(document:Document, root: HTMLElement, params:any):RootContainer{
    const rootNode = adaptNode(root);
    rootNode[DOMContainerSymbol] = this;
    const container= {
        getRootNode() {
            return rootNode;
        },
        createNode(name: string): Node {
            const text = document.createElement('div');
            const node = adaptNode(text);
            node[DOMContainerSymbol] = this;
            text[DOMSymbol] = node;
            return node;
        },
        createTextNode(name: string, content: string): Node {
            const node = this.createNode("text");
            node.setAttribute("content", content);
            console.info(content);
            return node;
        },
        getConfig(){
            return params;
        }
    };
    return container;
}

export function createNode(document:Document, name: string): Node{
    const element = document.createElement(name);
    const node = adaptNode(element);
    element[DOMSymbol] = node;
    return node;
}

function getElementForNode(node:Node):HTMLElement{
    if(node[DOMSymbol] === undefined){
        throw new Error("Node does not have a DOM element");
    }
    return node[DOMSymbol];
}

function checkSpecialAttributes(name: string, value: string | null, node: HTMLElement): boolean{
    if(name == "content"){
        node.innerText = value || "";
        return true;
    }
    return false;
}

export function adaptNode(root: HTMLElement): Node{
    // noinspection UnnecessaryLocalVariableJS
    const node : GuiNode & {[DOMSymbol]:HTMLElement} = {
        [DOMSymbol]: root,
        addChild(child: Node) {
            root.appendChild(getElementForNode(child));
        },
        addChildAt(index: number, child: Node) {
            root.insertBefore(getElementForNode(child), root.children[index]);
        },
        removeChild(child: Node) {
            root.removeChild(getElementForNode(child));
        },
        addEventListener(eventName: string, callback: Function) {
            root.addEventListener(eventName, callback as any);
        },
        removeEventListener(eventName: string, callback: Function) {
            root.removeEventListener(eventName, callback as any);
        },
        getAttribute(name: string): string|null {
            return root.getAttribute(name);
        },
        setAttribute(name: string, value: string|null) {
            if(checkSpecialAttributes(name,value,getElementForNode(this)))
                return;
            if(value === null){
                root.removeAttribute(name);
            }else{
                root.setAttribute(name, value);
            }
        },
        close() {
            return;
        },
        hasFeature(featureName: string): boolean {
            return featureName == "style";

        },
        dispatchEvent(eventName: string, event: any) {
            root.dispatchEvent(event);
        },
        styles: {
            setStyle(name: string, value: string) {
                this.styles[name] = value;
                if(adaptStyle(name, value, root, this.styles,node[DOMContainerSymbol]))
                    return;
                root.style.setProperty(name, value);
            },
            removeStyle(name: string) {
                root.style.removeProperty(name);
                delete this.styles[name];
            },
            styles:[]
        }
    } as Node & any;

    return node;
}