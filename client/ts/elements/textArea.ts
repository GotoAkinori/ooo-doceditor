namespace ooo.doceditor.elements {
    export function defineElementTextArea() {
        let def = new DeElementDef();
        def.check = (conf) => {
            return conf.content === "textarea";
        }
        def.onGetData = (element, dataHolder) => {
            dataHolder[(element.element as HTMLTextAreaElement).name] = (element.element as HTMLTextAreaElement).value ?? "";
        }
        def.onSetData = (element, dataHolder) => {
            (element.element as HTMLTextAreaElement).value = dataHolder[(element.element as HTMLTextAreaElement).name] ?? "";
        }
    }
}
