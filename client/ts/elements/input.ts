namespace ooo.doceditor.elements {
    export function defineElementInput() {
        let def = new DeElementDef();
        def.check = (conf) => {
            return conf.content === "input";
        }
        def.onCreate = (element, text) => {
            element.element = document.createElement(element.conf.content);
            (element.element as HTMLInputElement).value = text;
            element.values.attributes["value"] = text;

            element.element.addEventListener("click", (ev) => {
                element.editor?.focus(element, ev);
            });
        }
        def.onLoad = (element) => {
            (element.element as HTMLInputElement).value = element.values.attributes["value"] ?? "";
            element.element.addEventListener("click", (ev) => {
                element.editor?.focus(element, ev);
            });
        }
        def.onGetData = (element, dataHolder) => {
            dataHolder[(element.element as HTMLInputElement).name] = (element.element as HTMLInputElement).value ?? "";
        }
        def.onSetData = (element, dataHolder) => {
            (element.element as HTMLInputElement).value = dataHolder[(element.element as HTMLInputElement).name];
        }
    }
}
