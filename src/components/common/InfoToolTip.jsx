import { Tooltip } from "primereact/tooltip";
import classNames from "classnames";

export default function InfoToolTip(props) {
  const infoClass = classNames("pi pi-info-circle", {
    [`info-${props.target}`]: props.target,
  });

  return (
    <div>
      <Tooltip
        target={`.info-${props.target}`}
        content={props.content}
        event="both"
      />

      <i className={infoClass}></i>
    </div>
  );
}
