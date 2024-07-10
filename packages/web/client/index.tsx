import ReactDOM from 'react-dom/client';
import App from "./App.tsx";
import * as React from "react";

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

fetch('/entrypoint?type=client').then((response)=>{
    return response.json();
}).then((data)=>{
    console.log("Entries",data);
    [...data].forEach((entry)=>{
        import(/* vite-ignore */'/@fs/'+ entry.entry).then(()=>{
            document.dispatchEvent(new Event('entrypoint-loaded'))
        });
    })
})