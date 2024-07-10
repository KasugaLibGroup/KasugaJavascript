import { promises as fs } from 'fs'
export interface PackageJson{
    name:string
    version:string
    description:string
    main:string
    scripts:Record<string,string>
    repository:{
        type:string
        url:string
    }
    keywords:string[]
}

export interface NodePackage{
    package: PackageJson
    path: string
}

export async function discoveryPackage(path:string, filter:(pack:NodePackage)=>boolean){
    const packages = [];

    try{
        const packageJson = JSON.parse(await fs.readFile(path + '/package.json','utf-8')) as PackageJson
        let packInfo = {
            package: packageJson,
            path: path
        };
        if(filter(packInfo))packages.push(packInfo);
    }catch (e) {}

    try{
        const directories = await fs.readdir(path + '/node_modules')
        for(const directory of directories){
            if(directory.startsWith("."))
                continue;
            if(directory.startsWith("@")) {
                const subdirectories = await fs.readdir(path + '/node_modules/' + directory)
                for (const subdirectory of subdirectories) {
                    if (subdirectory.startsWith("."))
                        continue;
                    packages.push(...await discoveryPackage(path + '/node_modules/' + directory + '/' + subdirectory, filter))
                }
                continue;
            }
            packages.push(...await discoveryPackage(path + '/node_modules/' + directory, filter))
        }
    }catch (e) {}

    return packages
}