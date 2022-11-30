import { Panel } from "primereact/panel";
import { Ripple } from "primereact/ripple";
import classNames from "classnames";
import "./AppPanel.css";

export default function AppPanel(props) {
  const template = (options) => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className}`;
    const panelClass = classNames("justify-content-start", className);
    const titleClassName = `${options.titleClassName} pl-1`;

    return (
      <div className={panelClass}>
        {props.toggleable && (
          <button
            className={options.togglerClassName}
            onClick={options.onTogglerClick}
          >
            <span className={toggleIcon}></span>
            <Ripple />
          </button>
        )}
        <span className={titleClassName}>{props.header}</span>
      </div>
    );
  };

  return (
    <Panel
      headerTemplate={template}
      toggleable={props.toggleable}
      collapsed={props.collapsed}
    >
      {props.children}
    </Panel>
  );
}
