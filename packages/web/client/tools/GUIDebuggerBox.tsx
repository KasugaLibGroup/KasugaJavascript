import {LegacyRef, useEffect, useRef} from "react";

import {createContainerFor} from '@kasugalib/gui/lib/browser'
export default function GuiDebuggerBox({renderFunc,scale,size}){
    const renderZone = useRef<HTMLElement|null>(null);
    useEffect(()=>{
        // Cleanup
        while (renderZone.current?.firstChild) {
            let child = renderZone.current?.lastChild;
            if(child)renderZone.current?.removeChild(child as any);
        }
        if(renderZone.current){
            renderFunc(createContainerFor(document,renderZone.current, {scale}));
            console.info("Render!")
        }
    },[renderFunc,scale,size]);
    return (<>
        <div style={{height:'100%',width:'100%',fontSize:'9px',lineHeight:'1'}} ref={renderZone}>

        </div>
    </>)
}