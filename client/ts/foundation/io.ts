namespace ooo.doceditor {
    export function ioRequestJson(method: string, data: any, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.addEventListener("load", (result) => {
                if (req.status == 200) {
                    if (req.responseText && req.responseText.length > 0) {
                        resolve(JSON.parse(req.responseText));
                    } else {
                        resolve();
                    }
                } else {
                    reject(req.responseText);
                }
            });
            req.addEventListener("error", (err) => { console.log("Error"); reject(err); });
            req.addEventListener("abort", (err) => { console.log("Abort"); reject(err); });
            req.addEventListener("timeout", (err) => { console.log("Timeout"); reject(err); });
            req.open(method, "../../data/" + path);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(data));
        });
    }
    export async function ioSaveForm(data: any, id: string): Promise<void> {
        return await ioRequestJson("POST", data, "form/" + id);
    }
    export async function ioLoadForm(id: string): Promise<any> {
        return await ioRequestJson("GET", undefined, "form/" + id);
    }
    export async function ioSaveDocument(data: any, id: string): Promise<any> {
        return await ioRequestJson("POST", data, "document/" + id);
    }
    export async function ioLoadDocument(id: string): Promise<any> {
        return await ioRequestJson("GET", undefined, "document/" + id);
    }

    export function ioRequestBlob(method: string, data: any, path: string): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.addEventListener("load", (result) => {
                if (req.status == 200) {
                    resolve(req.response);
                } else {
                    reject(req.response);
                }
            });
            req.addEventListener("error", (err) => { console.log("Error"); reject(err); });
            req.addEventListener("abort", (err) => { console.log("Abort"); reject(err); });
            req.addEventListener("timeout", (err) => { console.log("Timeout"); reject(err); });
            req.open(method, "../../data/" + path);
            req.responseType = "blob";
            req.send(data);
        });
    }
    export async function ioSaveFile(data: Blob, id: string, attribute: string, fileName: string): Promise<void> {
        await ioRequestBlob("POST", data, "file/" + id + "/" + attribute + "/" + fileName);
    }
    export async function ioLoadFile(id: string, attribute: string, fileName: string): Promise<Blob> {
        return await ioRequestBlob("GET", undefined, "file/" + id + "/" + attribute + "/" + fileName);
    }
    export async function ioGetFileList(id: string, attribute: string): Promise<any> {
        return await ioRequestJson("GET", undefined, "filelist/" + id + "/" + attribute);
    }

    export async function ioLocalSave(blob: Blob, filename: string) {
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a); // Firefoxで必要
        a.download = filename;
        a.click();
        document.body.removeChild(a); // Firefoxで必要
        URL.revokeObjectURL(a.href);
    }
}

