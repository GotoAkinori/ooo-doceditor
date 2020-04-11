namespace ooo.doceditor {
    type valueMap = { [key: string]: string | null };
    type values = { style: valueMap, attributes: valueMap, data: valueMap };
    const deElementList: { [key: string]: DeElement } = {};

    export let nextId = 0;
    function getNextId(): string {
        nextId++;
        return "__DeSystem_" + nextId;
    }

    export class DeElement {
        public conf!: deElementConf;
        public element!: HTMLElement;
        public id!: string;

        public editor?: DeEditor;
        public extValues: any = {};

        public values: values = {
            style: {},
            attributes: {},
            data: {}
        }

        public constructor(editor?: DeEditor) {
            this.editor = editor;
        }

        public createNew(conf: deElementConf, text: string) {
            this.conf = conf;
            elements.DeElementDef.fireCreate(this, text);

            this.id = getNextId();
            this.element.id = this.id;

            deElementList[this.id] = this;
        }

        public getSaveFormInfo(): any {
            return {
                values: this.values,
                id: this.id,
                confName: this.conf.name,
                extValues: this.extValues
            }
        }

        public setLoadFormInfo(info: any) {
            this.values = info.values;
            this.id = info.id;
            this.extValues = info.extValues;
            this.element = document.getElementById(info.id)!;
            this.conf = getElementConfByName(info.confName)!;
            elements.DeElementDef.fireLoad(this);

            deElementList[this.id] = this;
        }

        public static getElementsSaveFormInfo() {
            let info: { [key: string]: any } = {};
            for (let key in deElementList) {
                info[key] = deElementList[key].getSaveFormInfo();
            }
            return info;
        }

        public static setElementsLoadFormInfo(editor: DeEditor | undefined, info: { [key: string]: any }) {
            for (let key in info) {
                let loadedElem = new DeElement(editor);
                loadedElem.setLoadFormInfo(info[key]);
            }
        }

        public static getElementsSaveDocumentInfo(dataHolder: { [key: string]: any }, fileHolder: { [key: string]: { filename: string, file: Blob }[] }) {
            for (let key in deElementList) {
                elements.DeElementDef.fireGetData(deElementList[key], dataHolder, fileHolder);
            }
        }

        public static setElementsLoadDocumentInfo(dataHolder: { [key: string]: any }) {
            for (let key in deElementList) {
                elements.DeElementDef.fireSetData(deElementList[key], dataHolder);
            }
        }

        public remove() {
            elements.DeElementDef.fireDelete(this);
            delete deElementList[this.id];
        }
    }
}
