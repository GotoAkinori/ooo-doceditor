namespace ooo.doceditor.elements {
    export function init() {
        // After Win.
        defineElementDefault();
        defineElementInput();
        defineElementTable();
        defineElementTextArea();
        defineElementFile();
    }

    export class DeElementDef {
        public static defList: DeElementDef[] = [];

        private id: number;
        private getNext() {
            return DeElementDef.defList[this.id - 1];
        }

        public check!: ((conf: deElementConf) => boolean);

        // Event Clieck
        public onCreate: ((element: DeElement, text: string) => void) | null = null;
        public static fireCreate(element: DeElement, text: string): void {
            for (let i = DeElementDef.defList.length - 1; i >= 0; i--) {
                let def = DeElementDef.defList[i];
                if (def.check(element.conf) && def.onCreate !== null) {
                    def.onCreate(element, text);
                    return;
                }
            }
        }

        // Event Load
        public onLoad: ((element: DeElement) => void) | null = null;
        public static fireLoad(element: DeElement): void {
            for (let i = DeElementDef.defList.length - 1; i >= 0; i--) {
                let def = DeElementDef.defList[i];
                if (def.check(element.conf) && def.onLoad !== null) {
                    def.onLoad(element);
                    return;
                }
            }
        }

        // Event Load
        public onDelete: ((element: DeElement) => void) | null = null;
        public static fireDelete(element: DeElement): void {
            for (let i = DeElementDef.defList.length - 1; i >= 0; i--) {
                let def = DeElementDef.defList[i];
                if (def.check(element.conf) && def.onDelete !== null) {
                    def.onDelete(element);
                    return;
                }
            }
        }

        // Event Data View
        public onView: ((element: DeElement, container: HTMLElement, ev?: MouseEvent) => void) | null = null;
        public static fireView(element: DeElement, container: HTMLElement, ev?: MouseEvent): void {
            for (let i = DeElementDef.defList.length - 1; i >= 0; i--) {
                let def = DeElementDef.defList[i];
                if (def.check(element.conf) && def.onView !== null) {
                    def.onView(element, container, ev);
                    return;
                }
            }
        }

        // Event Get Data
        public onGetData: ((element: DeElement, dataHolder: { [key: string]: any }, fileHolder: { [key: string]: { filename: string, file: Blob }[] }) => void) | null = null;
        public static fireGetData(element: DeElement, dataHolder: { [key: string]: any }, fileHolder: { [key: string]: { filename: string, file: Blob }[] }): void {
            for (let i = DeElementDef.defList.length - 1; i >= 0; i--) {
                let def = DeElementDef.defList[i];
                if (def.check(element.conf) && def.onGetData !== null) {
                    def.onGetData(element, dataHolder, fileHolder);
                    return;
                }
            }
        }

        // Event Set Data
        public onSetData: ((element: DeElement, dataHolder: { [key: string]: any }) => void) | null = null;
        public static fireSetData(element: DeElement, dataHolder: { [key: string]: any }): void {
            for (let i = DeElementDef.defList.length - 1; i >= 0; i--) {
                let def = DeElementDef.defList[i];
                if (def.check(element.conf) && def.onSetData !== null) {
                    def.onSetData(element, dataHolder);
                    return;
                }
            }
        }

        constructor() {
            this.id = DeElementDef.defList.length;
            DeElementDef.defList.push(this);
        }
    }
}
