namespace ooo.doceditor {
    let message: any = null;
    export function initMessage() {
        let req = new XMLHttpRequest();
        req.addEventListener("load", () => {
            message = JSON.parse(req.response);
        });

        req.open("get", "../conf/message_ja.json");
        req.send();
    }

    export function showMessage(code: string) {
        const message = getMessage(code);
        if (message) {
            alert(message);
        }
    }

    export function getMessage(code: string): string | null {
        const codeList = code.split(".");
        let cur = message;
        for (let c of codeList) {
            cur = cur[c];
            if (cur === undefined) {
                alert("MESSAGE ERROR");
                return null;
            }
        }
        return cur;
    }
}