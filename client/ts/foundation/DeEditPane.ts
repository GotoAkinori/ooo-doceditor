namespace ooo.doceditor {
    export class DeEditPane {
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

        public checkAppend(): boolean {
            let selection = window.getSelection();
            if (selection?.anchorNode === selection?.focusNode) {
                let node = selection?.anchorNode;

                let cur = node;
                while (cur) {
                    if (cur === this.container) {
                        return true;
                    } else {
                        cur = cur.parentNode;
                    }
                }
                return false;
            } else {
                return false;
            }
        }

        public getSelectString(): string {
            let selection = window.getSelection()!;
            let start = Math.min(selection.anchorOffset, selection.focusOffset);
            let end = Math.max(selection.anchorOffset, selection.focusOffset);
            let node = selection.anchorNode as Text;
            let text = node.nodeValue;
            if (text) {
                return text.substring(start, end);
            } else {
                return "";
            }
        }

        public append(element: DeElement) {
            let selection = window.getSelection()!;
            let start = Math.min(selection.anchorOffset, selection.focusOffset);
            let end = Math.max(selection.anchorOffset, selection.focusOffset);
            if (selection.anchorNode instanceof Text) {
                let node = selection.anchorNode as Text;
                let wholeText = node.nodeValue;

                if (wholeText) {
                    let textBefore = wholeText.substring(0, start);
                    let textAfter = wholeText.substring(end);

                    node.nodeValue = textBefore;
                    node.parentNode!.insertBefore(element.element, node.nextSibling);

                    let afterNode = document.createTextNode(textAfter);
                    node.parentNode!.insertBefore(afterNode, element.element.nextSibling);
                } else {
                    node.parentNode!.insertBefore(element.element, node.nextSibling);
                }
            } else {
                let node = selection.anchorNode as HTMLElement;
                node.appendChild(element.element);
            }
        }

        public getHtml(): string {
            return this.container.innerHTML;
        }

        public setHtml(html: string) {
            this.container.innerHTML = html;
        }
    }
}