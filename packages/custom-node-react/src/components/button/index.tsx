import { HtmlNode, HtmlNodeModel } from "@logicflow/core";
import React from "react";
import { Button } from "antd";
import ReactDOM from "react-dom";

function ReactButton(props) {
  return (
    <>
      <Button type={props.type}>{props.content}</Button>
    </>
  );
}

class ReactButtonModel extends HtmlNodeModel {
  setAttributes() {
    this.width = 115;
  }
}

class ReactButtonNode extends HtmlNode {
  setHtml(rootEl: HTMLElement): void {
    const { properties } = this.props.model;
    // 警告:ReactDOM。渲染在React 18中不再被支持。请使用createRoot。在你切换到新的API之前，你的应用程序会像运行React 17一样运行。了解更多:https://reactjs.org/link/switch-to-createroot
    ReactDOM.render(
      <ReactButton type={properties.type} content={properties.content} />,
      rootEl
    );
  }
}

export default {
  type: "react-button-node",
  view: ReactButtonNode,
  model: ReactButtonModel,
};
