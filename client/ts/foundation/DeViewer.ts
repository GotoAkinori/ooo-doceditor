namespace ooo.doceditor {
    export class DeViewer {
        public container: HTMLElement;
        public headerInfo?: {
            createTime: number,
            updateTime: number,
            tags: string[]
        };
        public formId: string = "";

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
            DeElement.getElementsSaveDocumentInfo(dataHolder);

            await ioSaveDocument({
                data: dataHolder,
                formId: this.formId
            }, id);
        }

        public async load(id: string) {
            let documentData = await ioLoadDocument(id);
            await this.newDoc(documentData.formId);
            DeElement.setElementsLoadDocumentInfo(documentData.data);
        }
    }
}
