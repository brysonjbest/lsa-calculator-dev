import { Tooltip } from "primereact/tooltip";
import classNames from "classnames";

/**
 * Information tooltip icon component
 * @param {object} props
 * @param {string} props.target the custom target classname for the icon
 * @param {string} props.content the content of the tooltip
 * @returns
 */

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
