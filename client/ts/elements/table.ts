namespace ooo.doceditor.elements {
    export function defineElementTable() {
        let table: EdCommonTable;

        let def = new DeElementDef();
        def.check = (conf) => {
            return conf.content === "table";
        }
        def.onCreate = (element, text?) => {
            element.element = document.createElement(element.conf.content);

            // create 3 * 3
            const initRows = 3;
            const initCols = 3;
            table = new EdCommonTable(element.element, initCols);
            for (let i = 0; i < initRows; i++) {
                table.addRow();
            }

            element.element.addEventListener("click", (ev) => {
                element.editor?.focus(element, ev);
            });
        }
        def.onLoad = (element) => {
            table = new EdCommonTable(element.element);
            element.element.addEventListener("click", (ev) => {
                element.editor?.focus(element, ev);
            });
        }
        def.onView = (element, container, ev) => {
            let [top, header, body] = newDataDiv();
            container.appendChild(top);
            header.innerHTML = "Table";

            function makeBody(target?: HTMLTableCellElement) {
                body.innerHTML = "";

                // Add Row
                {
                    let button = addButton(body, "DeButton");
                    button.innerText = "Add Row";
                    button.addEventListener("click", () => { table.addRow() });
                }

                // Add Col
                {
                    let button = addButton(body, "DeButton");
                    button.innerText = "Add Column";
                    button.addEventListener("click", () => { table.addCol() });
                }

                if (target) {
                    body.appendChild(document.createElement("br"));

                    // Delete Row
                    {
                        let button = addButton(body, "DeButton");
                        button.innerText = "Delete Row";
                        button.addEventListener("click", () => {
                            table.deleteRow(target as HTMLTableCellElement);
                            makeBody();
                        });
                    }

                    // Delete Col
                    {
                        let button = addButton(body, "DeButton");
                        button.innerText = "Delete Column";
                        button.addEventListener("click", () => {
                            table.deleteCol(target as HTMLTableCellElement);
                            makeBody();
                        });
                    }

                    // Add ColSpan
                    {
                        let button = addButton(body, "DeButton");
                        button.innerText = "Add ColSpan";
                        button.addEventListener("click", () => {
                            table.addColSpan(target);
                        });
                    }

                    // Add RowSpan
                    {
                        let button = addButton(body, "DeButton");
                        button.innerText = "Add RowSpan";
                        button.addEventListener("click", () => {
                            table.addRowSpan(target);
                        });
                    }

                    // Unmerge Cell
                    {
                        let button = addButton(body, "DeButton");
                        button.innerText = "Unmerge Cell";
                        button.addEventListener("click", () => {
                            table.unMergeCell(target);
                        });
                    }
                }
            }

            if (ev?.target instanceof HTMLTableCellElement) {
                makeBody(ev.target);
            } else {
                makeBody();
            }
        }
    }
}
