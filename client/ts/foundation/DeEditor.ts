namespace ooo.doceditor {
    export class DeEditor {
        public editpane: DeEditPane;
        public toolpane: DeToolPane;
        public datapane: DeDataPane;

        public constructor(
            editpane: HTMLElement | string,
            toolpane: HTMLElement | string,
            datapane: HTMLElement | string
        ) {
            this.editpane = new DeEditPane(this, editpane);
            this.toolpane = new DeToolPane(this, toolpane);
            this.datapane = new DeDataPane(this, datapane);

            if (DeEditor.initialized == false) {
                DeEditor.init();
            }
        }

        public append(conf: deElementConf) {
            if (this.editpane.checkAppend()) {
                let text = this.editpane.getSelectString();
                let newElement = new DeElement(this);
                newElement.createNew(conf, text);
                this.editpane.append(newElement);
                this.datapane.show(newElement);
            }
        }

        private __onfocusSyncFlag = true;
        public focus(element: DeElement, ev?: MouseEvent) {
            if (this.__onfocusSyncFlag) {
                setTimeout(() => {
                    this.__onfocusSyncFlag = true;
                    this.datapane.show(element, ev);
                }, 0);
            }
            this.__onfocusSyncFlag = false;
        }

        static initialized = false;
        public static init() {
            initMessage();
            elements.init();

            this.initialized = true;
        }

        public async save(id: string) {
            await ioSave({
                nextElementId: nextId,
                html: this.editpane.getHtml(),
                elements: DeElement.getElementsSaveInfo()
            }, id);
        }
        public async load(id: string) {
            let result = await ioLoad(id);

            nextId = result.nextId;
            this.editpane.setHtml(result.html);
            DeElement.setElementsLoadInfo(this, result.elements);
        }
    }
}
