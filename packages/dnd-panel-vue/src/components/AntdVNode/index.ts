import { HtmlNode, HtmlNodeModel } from "@logicflow/core";
import { createApp, h } from "vue";
import AButton from 'ant-design-vue/es/button';
import 'ant-design-vue/es/button/style'

class AntdVModel extends HtmlNodeModel {

    setAttributes() {
        this.height = 35;
    }
}

class AntdVNode extends HtmlNode {
    isMounted = false;
    app: any;

    constructor(props: any) {
        super(props);
        this.isMounted = false;
        this.app = createApp({
            render: () => h(AButton, {
                ...props.model.getProperties(),
            }),
        })
    }

    setHtml(rootEl: HTMLElement): void {
        if (!this.isMounted) {
            this.isMounted = true;
            const node = document.createElement('div')
            rootEl.appendChild(node)
            this.app.mount(node)
        }
    }
}

export default {
    type: 'antdv-node',
    view: AntdVNode,
    model: AntdVModel,
}