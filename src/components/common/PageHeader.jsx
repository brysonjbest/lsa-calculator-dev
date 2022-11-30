import { Card } from "primereact/card";
import classNames from "classnames";
import "./PageHeader.css";

export default function PageHeader(props) {
  const pageHeaderClass = classNames(
    "page-header-card",
    { "page-header-single-line": props.singleLine },
    { "page-header-gradient-1": props.gradient1 },
    { "page-header-gradient-2": props.gradient2 },
    { "page-header-gradient-3": props.gradient3 }
  );

  const cardTitle = props.title ? props.title : "Registration";
  const cardSubtitle = props.subtitle
    ? props.subtitle
    : "Long Service Awards And Service Pin Registration";

  return (
    <div>
      <Card
        className={pageHeaderClass}
        title={props.title}
        subTitle={props.subtitle}
        header={props.header}
        footer={props.footer}
      >
        {props.children}
      </Card>
    </div>
  );
}
