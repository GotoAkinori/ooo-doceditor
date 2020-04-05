namespace ooo.doceditor {
    type valueMap = { [key: string]: string | null };
    type values = { style: valueMap, attributes: valueMap, data: valueMap };
    const deElementList: { [key: string]: DeElement } = {};
    const elementDefinitions: any[] = [];

    export let nextId = 0;
    function getNextId(): string {
        nextId++;
        return "__DeSystem_" + nextId;
    }

    export class DeElement {
        public conf!: deElementConf;
        public element!: HTMLElement;
        public id!: string;
        public name: string = "";

        public editor: DeEditor;
        public extValues: any = {};

        public values: values = {
            style: {},
            attributes: {},
            data: {}
        }

        public constructor(editor: DeEditor) {
            this.editor = editor;
        }

        public createNew(conf: deElementConf, text: string) {
            this.conf = conf;
            elements.DeElementDef.fireCreate(this, text);

            this.id = getNextId();
            this.element.id = this.id;

            deElementList[this.id] = this;
        }

        public getSaveInfo(): any {
            return {
                values: this.values,
                id: this.id,
                confName: this.conf.name,
                extValues: this.extValues
            }
        }

        public setLoadInfo(info: any) {
            this.values = info.values;
            this.id = info.id;
            this.extValues = info.extValues;
            this.element = document.getElementById(info.id)!;
            this.name = info.confName;
            this.conf = getElementConfByName(info.confName)!;
            elements.DeElementDef.fireLoad(this);

            deElementList[this.id] = this;
        }

        public static getElementsSaveInfo() {
            let info: { [key: string]: any } = {};
            for (let key in deElementList) {
                info[key] = deElementList[key].getSaveInfo();
            }
            return info;
        }

        public static setElementsLoadInfo(editor: DeEditor, info: { [key: string]: any }) {
            for (let key in info) {
                let loadedElem = new DeElement(editor);
                loadedElem.setLoadInfo(info[key]);
            }
        }
    }
}
