namespace ooo.doceditor {
    export const styleList: { section: string, styles: { name: string, key: string, type: string }[] }[] = [
        {
            section: "Size",
            styles: [
                { name: "Width", key: "width", type: "string" },
                { name: "Height", key: "height", type: "string" }
            ]
        }, {
            section: "Font",
            styles: [
                { name: "Size", key: "font-size", type: "string" },
                { name: "Weight", key: "font-weight", type: "string" },
                { name: "Color", key: "color", type: "string" }
            ]
        }, {
            section: "Border",
            styles: [
                { name: "Width", key: "border-width", type: "string" },
                { name: "Style", key: "border-style", type: "select:solid,double,dashed,dotted" },
                { name: "Color", key: "border-color", type: "string" }
            ]
        }
    ];

    export type deElementConf = {
        name: string,
        caption: string,
        content: string,
        class?: string,
        attribute: { [key: string]: { default: string } },
        style: { [key: string]: { default: string } },
        data: { [key: string]: { default: string, message?: string } }
    }

    export const editorConf: {
        elements: ooo.doceditor.deElementConf[];
    } = {
        elements: [
            {
                name: "Bold",
                caption: "<span style='font-weight:bold'>B</span>",
                content: "span",
                attribute: {},
                style: {
                    "font-weight": { default: "bold" }
                },
                data: {}
            },
            {
                name: "Red",
                caption: "<span style='color:red'>Red</span>",
                content: "span",
                attribute: {},
                style: {
                    "color": { default: "red" }
                },
                data: {}
            },
            {
                name: "Enclose",
                caption: "<span style='border:1px black solid'>Enclose</span>",
                content: "span",
                attribute: {},
                style: {
                    "border-color": { default: "black" },
                    "border-style": { default: "solid" },
                    "border-width": { default: "1px" }
                },
                data: {}
            },
            {
                name: "input",
                caption: "Edit Box",
                content: "input",
                attribute: {
                    value: {
                        default: ""
                    },
                    name: {
                        default: ""
                    }
                },
                style: {},
                data: {}
            },
            {
                name: "textarea",
                caption: "Text Area",
                content: "textarea",
                attribute: {
                    name: {
                        default: ""
                    }
                },
                style: {},
                data: {}
            },
            {
                name: "table",
                caption: "<span style='border:1px black solid'>Table</span>",
                content: "table",
                class: "deEditor deAlter deHeader",
                attribute: {},
                style: {},
                data: {}
            }
        ]
    }

    export function getElementConfByName(name: string): deElementConf | null {
        for (let conf of editorConf.elements) {
            if (conf.name === name) { return conf; }
        }
        return null;
    }
}
