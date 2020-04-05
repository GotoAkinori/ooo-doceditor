namespace ooo.doceditor.elements {
    export function init() {
        // After Win.
        defineElementDefault();
        defineElementInput();
        defineElementTable();
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

        constructor() {
            this.id = DeElementDef.defList.length;
            DeElementDef.defList.push(this);
        }
    }
}
