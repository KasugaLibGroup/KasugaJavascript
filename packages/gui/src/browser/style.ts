export function parseUV(string:string, width:number, height:number):[number,number,number,number]{
    let [x,y,w,h] = (string || '').split(' ').map(v=>parseInt(v));
    return [x||0,y||0,w||width,h||height];
}

function updateBackgroundStyle(root: HTMLElement, styles: any[], scale: number){
    let image = new Image();
    const draw = function (){
        let rect = root.getBoundingClientRect();
        let realWidth = rect.width / scale;
        let realHeight = rect.height / scale;
        console.info(scale,"x")
        const canvas = new OffscreenCanvas(rect.width,rect.height);
        if(realWidth == 0 || realHeight == 0 || isNaN(realWidth) || isNaN(realHeight)){
            return;
        }
        canvas.height = rect.height;
        canvas.width = rect.width;
        const uv = parseUV(styles['backgroundUV'], image.width, image.height);
        canvas.getContext('2d')!.drawImage(
            image,uv[0],uv[1],uv[2],uv[3],0,0,rect.width,rect.height
        );
        canvas.convertToBlob().then((blob)=>{
            const dataUrl = URL.createObjectURL(blob);
            root.style.backgroundImage = `url("${dataUrl}")`;
            root.style.backgroundSize = 'cover'
        })
    }
    image.onload = draw;
    image.onerror = function (e){
        console.error(e);
    }
    image.src = getImage(styles['backgroundImage']);
}

export function adaptStyle(name: string, value: string, root: HTMLElement, styles: any[], container: any):boolean{
    switch (name){

        case "width":
        case "height":
        case "top":
        case "left":
            root.style.setProperty(name, value.endsWith("%")?value:value+'px');
            return true;
        case 'backgroundImage':
        case 'backgroundUV':
            updateBackgroundStyle(root,styles,container.getConfig().scale || 1)
            return true;
    }

    return false;
}

function getImage(path:string){
    return '/assets/'+path;
}