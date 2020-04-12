namespace ooo.doceditor {
    export class DeViewer {
        public container: HTMLElement;
        public headerInfo?: {
            createTime: number,
            updateTime: number,
            tags: string[]
        };
        public formId: string = "";
        public docId: string = "";

        public constructor(
            container: HTMLElement | string
        ) {
            if (typeof (container) == "string") {
                this.container = document.getElementById(container)!;
            } else {
                this.container = container;
            }

            init();
        }

        public async newDoc(formId: string) {
            this.formId = formId;
            let result = await ioLoadForm(formId);
            this.container.innerHTML = result.html;

            this.headerInfo = undefined;
            DeElement.setElementsLoadFormInfo(undefined, result.elements);
        }

        public async save(id: string) {
            let dataHolder: { [key: string]: any } = {};
            let fileHolder: { [key: string]: { filename: string, file: Blob }[] } = {};
            DeElement.getElementsSaveDocumentInfo(dataHolder, fileHolder);

            await ioSaveDocument({
                data: dataHolder,
                formId: this.formId
            }, id);

            for (let elementKey in fileHolder) {
                for (let fileInfo of fileHolder[elementKey]) {
                    await ioSaveFile(fileInfo.file, id, elementKey, fileInfo.filename);
                }
            }
        }

        public async load(id: string) {
            this.docId = id;
            let documentData = await ioLoadDocument(id);
            await this.newDoc(documentData.formId);
            DeElement.setElementsLoadDocumentInfo(documentData.data, this);
        }
    }
}
