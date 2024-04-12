import LogicFlow from "@logicflow/core";
import { Collapse } from "antd";
import ReactDOM from "react-dom/client";
import "./dnd-panel-react.css";

type ShapeItem = {
  type?: string;
  text?: string;
  icon?: string;
  label?: string;
  className?: string;
  properties?: Record<string, unknown>;
  callback?: (lf: LogicFlow, container: HTMLElement) => void;
};

type GroupItem = {
  group: string;
  items?: ShapeItem[];
};

class DndPanelReact {
  lf: LogicFlow;
  groupList!: GroupItem[];
  panelEl!: HTMLDivElement;
  static pluginName = "dndPanelReact";
  domContainer!: HTMLElement;

  constructor(options: { lf: LogicFlow }) {
    this.lf = options.lf;
    this.lf.setPatternItems = (groupList: GroupItem[]) => {
      this.setPatternItems(groupList);
    };
  }

  render(_lf: LogicFlow, domContainer: HTMLElement) {
    this.destroy();
    if (!this.groupList || this.groupList.length === 0) {
      // 首次render后失败后，后续调用setPatternItems支持渲染
      this.domContainer = domContainer;
      return;
    }

    const items = this.groupList.map((groupItem, index) => {
      return {
        key: index,
        label: groupItem.group,
        children: (
          <div className="collapse-container">
            {groupItem.items?.map((shapeItem, index) => {
              return (
                <div
                  key={index}
                  onMouseDown={() => {
                    if (shapeItem.type) {
                      this.lf.dnd.startDrag({
                        type: shapeItem.type,
                        properties: shapeItem.properties,
                        text: shapeItem.text,
                      });
                    }
                    if (shapeItem.callback) {
                      shapeItem.callback(this.lf, this.domContainer);
                    }
                  }}
                  onDoubleClick={(e) => {
                    this.lf.graphModel.eventCenter.emit("dnd:panel-dbclick", {
                      e,
                      data: shapeItem,
                    });
                  }}
                  onClick={(e) => {
                    this.lf.graphModel.eventCenter.emit("dnd:panel-click", {
                      e,
                      data: shapeItem,
                    });
                  }}
                  onContextMenu={(e) => {
                    this.lf.graphModel.eventCenter.emit(
                      "dnd:panel-contextmenu",
                      {
                        e,
                        data: shapeItem,
                      }
                    );
                  }}
                >
                  {shapeItem.icon && (
                    <div
                      className="lf-dnd-shape"
                      style={{ backgroundImage: `url(${shapeItem.icon})` }}
                    ></div>
                  )}
                  {shapeItem.label && (
                    <div className="lf-dnd-text">{shapeItem.label}</div>
                  )}
                </div>
              );
            })}
          </div>
        ),
      };
    });
    ReactDOM.createRoot(domContainer!).render(
      <Collapse className="lf-dndpanel" items={items} />
    );
    this.domContainer = domContainer;
  }

  destroy() {
    if (
      this.domContainer &&
      this.panelEl &&
      this.domContainer.contains(this.panelEl)
    ) {
      this.domContainer.removeChild(this.panelEl);
    }
  }

  setPatternItems(groupList: GroupItem[]) {
    this.groupList = groupList;
    // 支持渲染后重新设置拖拽面板
    if (this.domContainer) {
      this.render(this.lf, this.domContainer);
    }
  }
}

export { DndPanelReact };
