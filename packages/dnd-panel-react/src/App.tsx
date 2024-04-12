import LogicFlow from "@logicflow/core";
import { DndPanelReact } from "./extension/dnd-panel-react";
import React from "react";
import "./App.css";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import { icons } from "./icons";

export default class App extends React.Component {
  private container!: HTMLDivElement;
  private data = {
    nodes: [],
  };

  componentDidMount(): void {
    const lf = new LogicFlow({
      container: this.container,
      grid: true,
      stopMoveGraph: true,
      stopScrollGraph: true,
      stopZoomGraph: true,
      adjustNodePosition: true,
      plugins: [DndPanelReact],
    });
    lf.extension.dndPanelReact.setPatternItems([
      {
        group: "功能节点",
        items: [
          {
            label: "选区",
            icon: icons.select,
          },
        ],
      },
      {
        group: "起始节点",
        items: [
          {
            type: "circle",
            text: "开始",
            label: "开始节点",
            icon: icons.start,
          },
          {
            type: "circle",
            text: "结束",
            label: "结束节点",
            icon: icons.end,
            group: "GruopB",
          },
        ],
      },
      {
        group: "任务节点",
        items: [
          { type: "rect", label: "用户任务", icon: icons.task },
          {
            type: "rect",
            label: "系统任务",
            icon: icons.task,
            group: "GruopC",
          },
        ],
      },
      {
        group: "条件节点",
        items: [{ type: "diamond", label: "条件判断", icon: icons.condition }],
      },
    ]);
    lf.render(this.data);
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  render(): React.ReactNode {
    return (
      <>
        <div className="container" ref={this.refContainer}></div>
      </>
    );
  }
}
