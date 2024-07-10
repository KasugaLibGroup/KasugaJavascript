import {createWebServer} from "./index.ts";
import {discoveryPackage} from "./scanner.ts";

async function run(){
    createWebServer(process.cwd(),await discoveryPackage(process.cwd(),(_package)=>{
        if(!_package.package.keywords.includes("minecraft"))
            return false;
        console.info("Sub package discovered", _package.package.name)
        return true;
    }))
}

run();