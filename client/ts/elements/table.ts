namespace ooo.doceditor.elements {
    export function defineElementTable() {
        let def = new DeElementDef();
        def.check = (conf) => {
            return conf.content === "table";
        }
        def.onCreate = (element, text?) => {
            element.element = document.createElement(element.conf.content);

            // create 3 * 3
            const initRows = 3;
            const initCols = 3;
            let table = new EdCommonTable(element.element, initCols);
            for (let i = 0; i < initRows; i++) {
                table.addRow();
            }

            element.element.addEventListener("click", (ev) => {
                element.editor.focus(element, ev);
            });
        }
        def.onLoad = (element) => {
            element.element.addEventListener("click", (ev) => {
                element.editor.focus(element, ev);
            });
        }
        def.onView = (element, conteiner, ev) => {
            let [, header, body] = newDataDiv();
            header.innerHTML = "Table";
            let button = addButton(body, "DeButton");
            button.innerText = "Delete Table";
            button.addEventListener("click", () => {
                
            });

            if (ev) {
                let target = ev.target;
                if (target instanceof HTMLTableCellElement) {

                }
            }
        }
    }
}
