namespace ooo.doceditor.elements {
    export function defineElementFile() {
        let def = new DeElementDef();
        def.check = (conf) => {
            return conf.name === "file";
        }
        def.onCreate = (element) => {
            element.element = document.createElement(element.conf.content);
            element.element.contentEditable = "false";
            element.element.addEventListener("drop", (ev) => onDrop(element, ev));
            element.element.addEventListener("click", (ev) => {
                element.editor?.focus(element, ev);
            });
            updateFileName(element);
        }
        def.onLoad = (element) => {
            element.element.contentEditable = "false";
            element.element.addEventListener("dragover", onDragOver, false);
            element.element.addEventListener("drop", (ev) => onDrop(element, ev), false);
            element.element.addEventListener("click", (ev) => {
                element.editor?.focus(element, ev);
            });
            updateFileName(element);
        }
        def.onGetData = (element, dataHolder, fileHolder) => {
            if (element.values.attributes.name) {
                dataHolder[element.values.attributes.name]
                    = {
                    filename: element.extValues.filename
                };
                fileHolder[element.values.attributes.name]
                    = element.extValues.files;
            }
        }
        def.onSetData = (element, dataHolder) => {
            console.log("TODO");
        }

        function onDragOver(ev: DragEvent) {
            ev.stopPropagation();
            ev.preventDefault();
            if (ev.dataTransfer) {
                ev.dataTransfer.dropEffect = 'copy';
            }
        }

        function onDrop(element: DeElement, ev: DragEvent) {
            ev.stopPropagation();
            ev.preventDefault();

            let files = ev.dataTransfer?.files;
            if (files && files.length > 0) {
                let saveFileList: { filename: string, file: Blob }[];
                if (element.extValues.files === undefined) {
                    saveFileList = [];
                    element.extValues.files = saveFileList;
                } else {
                    saveFileList = element.extValues.files;
                }
                for (let i = 0; i < files.length; i++) {
                    saveFileList.push({
                        filename: files[i].name,
                        file: files[i]
                    });
                }
            }

            updateFileName(element);
        }

        function updateFileName(element: DeElement) {
            if (element.extValues.files && element.extValues.files.length > 0) {
                element.element.innerHTML = "";

                for (let file of element.extValues.files) {
                    let div = document.createElement("div");
                    element.element.appendChild(div);

                    // download button
                    let donwloadButton = addButton(div, "file-edit");
                    addImage(donwloadButton, "download-file.svg");
                    donwloadButton.addEventListener("click", () => {
                        ioLocalSave(file.file, file.filename);
                    });

                    // remove button
                    let removeButton = addButton(div, "file-edit");
                    addImage(removeButton, "remove-file.svg");
                    removeButton.addEventListener("click", () => {
                        element.extValues.files = element.extValues.files.filter(
                            (e: { file: Blob, filename: string }) => e.filename != file.filename
                        );
                        div.remove();
                        if (element.extValues.files.length == 0) {
                            element.element.innerHTML = getMessage("element-operation.file.empty") ?? "";
                        }
                    });

                    // file name
                    let text = document.createTextNode(file.filename);
                    div.appendChild(text);
                }
            } else {
                element.element.innerHTML = getMessage("element-operation.file.empty") ?? "";
            }
        }
    }
}
