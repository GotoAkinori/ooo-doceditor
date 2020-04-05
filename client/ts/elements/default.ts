namespace ooo.doceditor.elements {
    export function defineElementDefault() {
        let def = new DeElementDef();
        def.check = (conf) => {
            return true;
        }
        def.onCreate = (element, text?) => {
            element.element = document.createElement(element.conf.content);
            element.element.innerText = text;

            element.element.addEventListener("click", (ev) => {
                element.editor.focus(element, ev);
            });
        }
        def.onLoad = (element) => {
            element.element.addEventListener("click", (ev) => {
                element.editor.focus(element, ev);
            });
        }
        def.onDelete = (element) => {
            let text = element.element.innerText;

            let prev = element.element.previousSibling;
            let next = element.element.nextSibling;
            if (prev instanceof Text) {
                if (next instanceof Text) {
                    prev.nodeValue = prev.nodeValue + text + next.nodeValue;
                    element.element.remove();
                    next.remove();
                } else {
                    prev.nodeValue = prev.nodeValue + text;
                    element.element.remove();
                }
            } else {
                if (next instanceof Text) {
                    next.nodeValue = text + next.nodeValue;
                    element.element.remove();
                } else {
                    let textElement = document.createTextNode(text);
                    element.element.parentElement?.insertBefore(textElement, next);
                    element.element.remove();
                }
            }

        }
    }
}
