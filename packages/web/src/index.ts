import * as vite from "vite";
import {InlineConfig, PluginOption, ViteDevServer} from "vite";
import viteReact from "@vitejs/plugin-react";
import Koa from "koa";
import KoaRouter from '@koa/router';
import path from "node:path";
import {NodePackage, PackageJson} from "./scanner.ts";
import {findResource} from "./resource.ts";

export function watchNodeModules(modules: string[]): PluginOption {
    console.info({ignored: modules.map(t=>path.resolve(t,"**"))})
    return {
        name: 'watch-node-modules',
        config() {
            return {
                server: {
                    watch: {
                        ignored: modules.map(t=>'!'+path.resolve(t,"**")),
                    },
                },
            };
        },
    };
}

export async function createServer(modules:string[]){
    return await vite.createServer(vite.mergeConfig(
        {
            root: path.resolve(__dirname , '../'),
            server: {
                middlewareMode: "html",
                fs: {
                    allow: [process.cwd()]
                }
            },
            plugins:[
                viteReact()
            ],
            build: {
                rollupOptions: {
                    input: {
                        main: path.resolve(__dirname, '../index.html')
                    }
                }
            }
        },{
            plugins:[
                watchNodeModules(modules),
                {
                    name:'watcherPolyfill',
                    configureServer(server:ViteDevServer){
                        console.info("MOD",modules.map(t=>path.resolve(t,'src')))
                        server.watcher.add(modules.map(t=>path.resolve(t,'src')))
                    }
                }
            ]
        }
    ) as InlineConfig);
}

function getEntrypoint(packages: NodePackage[]) {
    return packages.filter((_package)=>'minecraft' in _package.package && 'development' in _package.package['minecraft'])
        .map(_package=>{
            console.info(_package)
            const entrypointConfigure = [];
            const devEntries : Record<string, any> = _package.package['minecraft']['development'];
            for(const entriesName in devEntries) {
                const entries = devEntries[entriesName];
                console.info("Entries",entries)
                for (const entry of entries) {
                    entrypointConfigure.push({
                        name: _package.package.name,
                        type: entriesName,
                        entry: path.resolve(_package.path, entry)
                    });
                }
            }
            return entrypointConfigure;
        }).flat();
}

export async function createWebServer(root: string, packages: NodePackage[]){
    const koaServer = new Koa();
    const router = new KoaRouter();
    console.info("Loading....")
    const vite = await createServer(packages.map(t=>t.path));
    console.info("Vite")
    koaServer
        .use(router.routes())
        .use(router.allowedMethods())

    router.get('/entrypoint', (ctx) => {
        let entries = getEntrypoint(packages);
        if(ctx.query['type'] != null){
            console.info("QueryType",ctx.query['type'])
            entries = entries.filter(entry=>entry.type == ctx.query['type'])
        }
        ctx.body = entries;
    });
    router.get('/assets/(.+)*', (ctx) => {
        let resourcePath = ctx.params[0];
        let resource = findResource(resourcePath);
        if(resource){
            ctx.body = resource;
            ctx.type = path.extname(resourcePath);
        }
    });

    router.all('/(.+)*', (ctx) => new Promise((resolve) => {
        vite.middlewares(ctx.req, ctx.res, resolve)
    }))


    koaServer.listen(7800,"localhost")

    console.info("Server started on localhost:7800")
}