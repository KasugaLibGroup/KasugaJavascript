import * as fs from "fs";
import path from "node:path";

export function findResource(packetName:string){
    let packageName;
    let paths = packetName.split("/");
    if(packetName.startsWith("@")){
        packageName = paths[0] + "/" + paths[1];
        paths = paths.slice(2);
    }else{
        packageName = paths[0];
        paths = paths.slice(1);
    }

    let packagePath
    let packageJson;
    try{
        packagePath = require.resolve(packageName + "/package.json");
        packageJson = require(packagePath);
    }catch (e) {
        return null;
    }

    let resourcePath = packageJson['minecraft']['resource'];

    let packageRoot = path.resolve(packagePath, "..", resourcePath)

    try{
        return fs.readFileSync(path.resolve(packageRoot, ...paths));
    }catch (e) {
        return null;
    }
}