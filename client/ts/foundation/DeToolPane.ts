namespace ooo.doceditor {
    export class DeToolPane {
        private container: HTMLElement;
        private editor: DeEditor;

        public constructor(editor: DeEditor, container: HTMLElement | string) {
            if (typeof (container) == "string") {
                this.container = document.getElementById(container)!;
            } else {
                this.container = container;
            }
            this.editor = editor;

            this.makeButtons();
        }

        private makeButtons() {
            const elements = ooo.doceditor.editorConf.elements;
            for (let element of elements) {
                const button = document.createElement("button");
                button.innerHTML = element.caption;
                button.addEventListener("click", () => {
                    this.editor.append(element);
                });
                this.container.appendChild(button);
            }
        }
    }
}