import { Button } from "primereact/button";
import classNames from "classnames";
import "./AppButton.css";

export default function AppButton(props) {
  const buttonClass = classNames(
    "p-button-raised",
    { "p-button-secondary": props.secondary },
    { "p-button-info": props.info },
    { "p-button-danger": props.danger }
  );

  const iconPos = props.iconPosition ? props.iconPosition : "right";
  const icons = props.icon ? props.icon : "null";

  return (
    <Button
      className={buttonClass}
      onClick={props.onClick}
      disabled={props.disabled}
      label={props.children}
      icon={icons}
      iconPos={iconPos}
    ></Button>
  );
}
