import LogicFlow from "@logicflow/core";
import { DndPanel } from "@logicflow/extension";
import React from "react";
import "./App.css";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import ReactButtonNode from "./components/button/index.tsx";
import { Modal } from "antd";

const buttonTypes = ["primary", "ghost", "dashed", "link", "text", "default"];

export default class App extends React.Component {
  container;
  lf;

  constructor(props) {
    super(props);
    this.state = {
      nodeId: "",
      isModalOpen: false,
      buttonType: "primary",
    };
  }

  showModal(data) {
    this.setState({
      nodeId: data.id,
      buttonType: buttonTypes[Math.floor(Math.random() * 6)],
    });
    this.setState({
      isModalOpen: true,
    });
  }

  handleOk = () => {
    this.setState({
      isModalOpen: false,
    });
    this.lf.setProperties(this.state.nodeId, {
      type: this.state.buttonType,
    });
  };

  handleCancel = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  componentDidMount() {
    this.lf = new LogicFlow({
      container: this.container,
      grid: true,
      stopMoveGraph: true,
      stopScrollGraph: true,
      stopZoomGraph: true,
      adjustNodePosition: true,
      plugins: [DndPanel],
    });
    this.lf.register(ReactButtonNode);
    this.lf.extension.dndPanel.setPatternItems([
      {
        type: "react-button-node",
        label: "按钮",
        properties: {
          type: "primary",
          content: "我是一个按钮",
        },
      },
    ]);
    this.lf.render();
    this.lf.on("node:click", (event) => {
      this.showModal(event.data);
    });
  }

  refContainer = (container) => {
    this.container = container;
  };

  render() {
    const { isModalOpen, buttonType } = this.state;

    return (
      <>
        <div className="container" ref={this.refContainer}></div>
        <Modal
          title="修改按钮类型"
          open={isModalOpen}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          确认修改按钮类型为: {buttonType}
        </Modal>
      </>
    );
  }
}
