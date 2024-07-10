import {useEffect, useState} from "react";
import {Button, Input, Select, Space} from "antd";
import Search from "antd/es/input/Search";
import GuiDebuggerBox from "./GUIDebuggerBox.tsx";

export default function (){
    let memorizedSize = [100,100,1];
    try{
        memorizedSize = JSON.parse(localStorage.getItem('size')) || memorizedSize;
    }catch (e) {}
    const [size,setSize] = useState([memorizedSize[0],memorizedSize[1],memorizedSize[2]]);
    const [sizeInput, setInputSize] = useState([memorizedSize[0],memorizedSize[1],memorizedSize[2]]);
    function applySize(){
        setSize([sizeInput[0],sizeInput[1],sizeInput[2]]);
        localStorage.setItem('size',JSON.stringify([sizeInput[0],sizeInput[1],sizeInput[2]]));
        memorizedSize = [sizeInput[0],sizeInput[1],sizeInput[2]];
    }

    function freshElements(){
        return Object.keys(window['KASUGA_LIB_REGISTRY_HOOK']?.registry?.['kasuga_lib:gui'] || {}) || [];
    }

    useEffect(()=>{
        document.addEventListener("entrypoint-loaded",()=>{
            setElement(freshElements());
        })
    },[]);
    const [element,setElement] = useState(freshElements());

    const [currentDebuggingElement, _setCurrentDebuggingElement] = useState(
        localStorage.getItem('currentDebuggingElement') || element[0]
    );

    function setCurrentDebuggingElement(v){
        _setCurrentDebuggingElement(v)
        localStorage.setItem('currentDebuggingElement',v);
    }

    return <>
        <div style={{
            display:'flex',
            flexDirection:'column'
        }}>
            <div>
                <div style={{
                    outline: '1px solid black',
                    width:(size[0] * size[2]) + 'px',
                    height:(size[1] * size[2]) + 'px',
                    overflow:'hidden'
                }}>
                    <div style={{
                        width:size[0] + 'px',
                        height:size[1] + 'px',
                        transformOrigin:'0 0',
                        scale:size[2]
                    }}>
                        <GuiDebuggerBox
                            renderFunc={window['KASUGA_LIB_REGISTRY_HOOK']?.registry?.['kasuga_lib:gui'][currentDebuggingElement] || (()=>{})}
                            scale={size[2]}
                            size={size}
                        />
                    </div>
                </div>
            </div>
            <div style={{
                margin:10
            }}>
                <Space direction="vertical" size="middle">
                    <Space.Compact>
                        <Input value={sizeInput[0]} onChange={(size)=>{
                            setInputSize([size.target.value,sizeInput[1],sizeInput[2]])
                        }} />
                        <Input value={sizeInput[1]} onChange={(size)=>{
                            setInputSize([sizeInput[0],size.target.value,sizeInput[2]])
                        }} />
                        <Input value={sizeInput[2]} onChange={(size)=>{
                            setInputSize([sizeInput[0],sizeInput[1],size.target.value])
                        }} />
                        <Button onClick={ applySize }>设置大小</Button>
                    </Space.Compact>
                    <Space.Compact>
                        <Select
                            options={
                                element.map((v)=>({
                                    value: v,
                                    label: <span>{v}</span>
                                }))
                            }
                            value={currentDebuggingElement}
                            onChange={(v)=>setCurrentDebuggingElement(v)}
                            style={{width:200}}/>
                        <Button onClick={()=>setElement(freshElements())}>刷新</Button>
                    </Space.Compact>
                </Space>
            </div>
        </div>
    </>
}