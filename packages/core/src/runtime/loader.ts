export function polyfillLoader(target:Partial<typeof globalThis>){
    const require = function(moduleName:string):any{
        return globalThis['__KASUGA_REQUIRE__'].require(moduleName);
    }

    Object.defineProperty(target,"require",{
        value:require
    });
}