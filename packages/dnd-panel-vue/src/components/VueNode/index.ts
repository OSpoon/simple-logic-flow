import { HtmlNode, HtmlNodeModel } from "@logicflow/core";
import { createApp, h } from "vue";

class VueModel extends HtmlNodeModel {

    setAttributes() {
        this.height = 36;
    }
}

class VueNode extends HtmlNode {
    isMounted = false;
    app: any;

    constructor(props: any) {
        super(props);
        this.isMounted = false;
        this.app = createApp({
            render: () => h('div', {
                ...props.model.getProperties(),
            }),
        })
    }

    setHtml(rootEl: HTMLElement): void {
        if (!this.isMounted) {
            this.isMounted = true;
            const node = document.createElement('div')
            node.style.textAlign = 'center';
            node.style.lineHeight = '34px';
            node.style.border = '1px solid #1890ff'
            rootEl.appendChild(node)
            this.app.mount(node)
        }
    }
}

export default {
    type: 'vue-node',
    view: VueNode,
    model: VueModel,
}