namespace ooo.doceditor {
    export class DeDataPane {
        private container: HTMLElement;
        private editor: DeEditor;

        public constructor(editor: DeEditor, container: HTMLElement | string) {
            if (typeof (container) == "string") {
                this.container = document.getElementById(container)!;
            } else {
                this.container = container;
            }
            this.editor = editor;
        }

        public clear() {
            this.container.innerHTML = "";
        }

        public show(element: DeElement, ev?: MouseEvent) {
            this.clear();
            this.showBasicCommand(element);
            elements.DeElementDef.fireView(element, this.container, ev);
            this.showData(element);
            this.showAttribute(element);
            this.showStyle(element);
        }

        private showBasicCommand(element: DeElement) {
            // delete button
            {
                let button = addButton(this.container, "DeButton");
                button.innerHTML = "Delete Element";
                button.addEventListener("click", () => {
                    element.remove();
                    this.clear();
                });
            }
        }

        private showAttribute(element: DeElement) {
            let [top, header, body] = newDataDiv();
            this.container.appendChild(top);
            header.innerHTML = "Attributes"

            let table = new DeCommonTable(body, 2);

            for (let key in element.conf.attribute) {
                let [, [td1, td2]] = table.addRow();
                td1.innerHTML = key;

                let input = addInput(td2, "DeDataPane_input");
                input.placeholder = element.conf.attribute[key].default;
                input.value = element.values.attributes[key] ?? "";

                this.setAttribute(element, key, input.value || input.placeholder);
                input.addEventListener("blur", () => {
                    this.setAttribute(element, key, input.value || input.placeholder);
                });
            }
        }

        private showStyle(element: DeElement) {
            let [top, header, body] = newDataDiv();
            this.container.appendChild(top);
            header.innerHTML = "Style"

            {
                // class
                let table = new DeCommonTable(body, 2);
                let [, [td1, td2]] = table.addRow();
                td1.innerText = "Class";
                let input = addInput(td2, "DeDataPane_input");
                if (element.conf.class) {
                    input.value = element.conf.class;
                    element.element.className = element.conf.class;
                }
                input.addEventListener("blur", () => {
                    element.element.className = input.value;
                });
            }

            for (let section of styleList) {
                let [sTop, sHeader, sBody] = newDataDiv();
                body.appendChild(sTop);
                sHeader.innerHTML = section.section;

                let table = new DeCommonTable(sBody, 2);
                for (let style of section.styles) {
                    let [, [td1, td2]] = table.addRow();
                    td1.innerHTML = style.name;

                    let input = addInput(td2, "DeDataPane_input");
                    input.placeholder = element.conf.style[style.key]?.default ?? "";
                    input.value = element.values.style[style.key] ?? "";

                    this.setStyle(element, style.key, input.value || input.placeholder);
                    input.addEventListener("blur", () => {
                        this.setStyle(element, style.key, input.value || input.placeholder);
                    });
                }
            }
        }

        private showData(element: DeElement) {
            let [top, header, body] = newDataDiv();
            this.container.appendChild(top);
            header.innerHTML = "Data"

            let table = new DeCommonTable(body, 3);

            for (let key in element.conf.data) {
                let [, [td1, td2, td3]] = table.addRow();
                td1.innerHTML = key;
                td3.innerHTML = element.conf.data[key].message ?? "";

                let input = addInput(td2, "DeDataPane_input");
                input.placeholder = element.conf.data[key].default;
                input.value = element.values.data[key] ?? "";

                this.setData(element, key, input.value || input.placeholder);
                input.addEventListener("blur", () => {
                    this.setData(element, key, input.value || input.placeholder);
                });
            }
        }

        private setAttribute(element: DeElement, key: string, value: string) {
            (element.element as any)[key] = value;
            element.values.attributes[key] = value || null;
        }

        private setStyle(element: DeElement, key: string, value: string) {
            element.element.style[getCamelCase(key) as any] = value;
            element.values.style[key] = value || null;
        }

        private setData(element: DeElement, key: string, value: string) {
            element.values.data[key] = value || null;
        }
    }
}