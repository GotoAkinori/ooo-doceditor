namespace ooo.doceditor {
    export function ioRequest(method: string, data: any, type: string, id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.addEventListener("load", (result) => {
                if (req.responseText) {
                    resolve(JSON.parse(req.responseText));
                }
            });
            req.addEventListener("error", (err) => { console.log("Error"); reject(err); });
            req.addEventListener("abort", (err) => { console.log("Abort"); reject(err); });
            req.addEventListener("timeout", (err) => { console.log("Timeout"); reject(err); });
            req.open(method, "../../data/" + type + "/" + id);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(data));
        });
    }
    export async function ioSaveForm(data: any, id: string): Promise<void> {
        return await ioRequest("POST", data, "form", id);
    }
    export async function ioLoadForm(id: string): Promise<any> {
        return await ioRequest("GET", undefined, "form", id);
    }
    export async function ioSaveDocument(data: any, id: string): Promise<any> {
        return await ioRequest("POST", data, "document", id);
    }
    export async function ioLoadDocument(id: string): Promise<any> {
        return await ioRequest("GET", undefined, "document", id);
    }
}

