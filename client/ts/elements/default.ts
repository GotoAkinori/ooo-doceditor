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
    }
}
