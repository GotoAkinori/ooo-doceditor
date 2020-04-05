namespace ooo.doceditor {
    export function ioSave(data: any, id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.addEventListener("load", () => { resolve(); });
            req.addEventListener("error", () => { console.warn("Error"); reject(); });
            req.addEventListener("abort", () => { console.warn("Abort"); reject(); });
            req.addEventListener("timeout", () => { console.warn("Timeout"); reject(); });
            req.open("POST", "../../form/" + id);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(data));
        });
    }
    export function ioLoad(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.addEventListener("load", (res) => {
                resolve(JSON.parse(req.responseText));
            });
            req.addEventListener("error", () => { console.warn("Error!"); reject(); });
            req.addEventListener("abort", () => { console.warn("Abort!"); reject(); });
            req.addEventListener("timeout", () => { console.warn("Timeout!"); reject(); });
            req.open("GET", "../../form/" + id);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-type", "application/json");
            req.send();
        });
    }
}

