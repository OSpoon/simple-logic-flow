import { HtmlNode, HtmlNodeModel } from "@logicflow/core";
import { createApp, h } from "vue";
import Button from './Button.vue';

class VueButtonModel extends HtmlNodeModel {

    setAttributes() {
        this.width = 115;
    }
}

class VueButtonNode extends HtmlNode {
    isMounted = false;
    app: any;
    r: any;

    constructor(props: any) {
        super(props)
        this.isMounted = false
        const { type, content } = props.model.getProperties();
        this.r = h(Button, {
            type,
            content,
        })
        this.app = createApp({
            render: () => this.r
        })
    }

    setHtml(rootEl: HTMLElement): void {
        if (!this.isMounted) {
            this.isMounted = true
            const node = document.createElement('div')
            rootEl.appendChild(node)
            this.app.mount(node)
        } else {
            const { type, content } = this.props.model.getProperties();
            this.r.component.props.type = type;
            this.r.component.props.content = content;
        }
    }
}

export default {
    type: 'vue-button-node',
    view: VueButtonNode,
    model: VueButtonModel,
}