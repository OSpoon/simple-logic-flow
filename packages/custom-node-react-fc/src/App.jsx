import LogicFlow from "@logicflow/core";
import { DndPanel } from "@logicflow/extension";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import ReactButtonNode from "./components/button/index.tsx";
import { Modal } from "antd";

const buttonTypes = ["primary", "ghost", "dashed", "link", "text", "default"];

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonType, setButtonType] = useState("primary");
  const [nodeId, setNodeId] = useState("");
  const container = useRef(null);
  const lf = useRef(null);

  const showModal = (data) => {
    setNodeId(data.id);
    setButtonType(buttonTypes[Math.floor(Math.random() * 6)]);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    lf.current.setProperties(nodeId, {
      type: buttonType,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (container.current) {
      lf.current = new LogicFlow({
        container: container.current,
        grid: true,
        stopMoveGraph: true,
        stopScrollGraph: true,
        stopZoomGraph: true,
        adjustNodePosition: true,
        plugins: [DndPanel],
      });
      lf.current.register(ReactButtonNode);
      lf.current.extension.dndPanel.setPatternItems([
        {
          type: "react-button-node",
          label: "按钮",
          properties: {
            type: "primary",
            content: "我是一个按钮",
          },
        },
      ]);
      lf.current.render();
      lf.current.on("node:click", (event) => {
        showModal(event.data);
      });
    }
  }, []);

  return (
    <>
      <div className="container" ref={container}></div>
      <Modal
        title="修改按钮类型"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        确认修改按钮类型为: {buttonType}
      </Modal>
    </>
  );
};
export default App;
