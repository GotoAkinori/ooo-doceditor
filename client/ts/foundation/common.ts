namespace ooo.doceditor {

    let _initialized = false;
    export function init() {
        if (_initialized == false) {
            initMessage();
            elements.init();
            _initialized = true;
        }
    }

    export function newDataDiv(closed: boolean = false): [HTMLDivElement, HTMLDivElement, HTMLDivElement] {
        let _closed = closed;
        let top = document.createElement("div");
        let header = document.createElement("div");
        let body = document.createElement("div");
        let icon = document.createElement("img");

        top.classList.add("DeDataPane_top");
        header.classList.add("DeDataPane_header");
        body.classList.add("DeDataPane_body");
        icon.classList.add("DeDataPane_icon");

        top.appendChild(header);
        top.appendChild(body);
        top.appendChild(icon);

        function setState() {
            if (_closed) {
                icon.src = "../icon/tree-closed.svg";
                body.style.height = "0px";
            } else {
                icon.src = "../icon/tree-open.svg";
                body.style.height = "";
            }
        }
        setState();
        header.addEventListener("click", () => {
            _closed = !_closed;
            setState();
        });

        return [top, header, body];
    }

    export function addInput(container: HTMLElement, className?: string): HTMLInputElement {
        let input = document.createElement("input");
        container.appendChild(input);
        if (className) {
            input.classList.add(className);
        }
        return input;
    }
    export function addButton(container: HTMLElement, className?: string): HTMLButtonElement {
        let button = document.createElement("button");
        container.appendChild(button);
        if (className) {
            button.classList.add(className);
        }
        return button;
    }

    let imageBasePath = "../icon/"
    export function setImagePath(imagePath: string) {
        imageBasePath = imagePath;
    }
    export function addImage(container: HTMLElement, iconName: string, className?: string): HTMLImageElement {
        let img = document.createElement("img");
        container.appendChild(img);
        img.src = imageBasePath + iconName;
        if (className) {
            img.classList.add(className);
        }
        return img;
    }

    export function getCamelCase(s: string): string {
        let result = "";
        for (let i = 0; i < s.length; i++) {
            if (s.charAt(i) == "-") {
                i++;
                result += s.charAt(i).toUpperCase();
            } else {
                result += s.charAt(i);
            }
        }
        return result;
    }
    export function getChainCase(s: string): string {
        const codeA = 'A'.charCodeAt(0);
        const codeZ = 'Z'.charCodeAt(0);

        let result = "";
        for (let i = 0; i < s.length; i++) {
            const code = s.charCodeAt(i);
            if (codeA <= code && code <= codeZ) {
                result += "-" + s.charAt(i).toLowerCase();
            } else {
                result += s.charAt(i);
            }
        }
        return result;
    }
}
