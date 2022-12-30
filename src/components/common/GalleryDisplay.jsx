import React, { useEffect, useRef, useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import classNames from "classnames";
import AppButton from "./AppButton";
import "./GalleryDisplay.css";

/**
 * Gallery Display common display component to display items in list with details
 * @param {object} props
 * @param {Array} props.itemSet Array of objects to display in gallery view
 * @returns
 */

export default function GalleryDisplay(props) {
  // const [items, setItems] = useState([]);
  const [layout, setLayout] = useState("grid");
  //testing data
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(props.itemSet);
  }, [props.itemSet]);

  const renderListItem = (data) => {
    return (
      <div>
        <div className="item-list-item">
          <img
            src={`images/item/${data.image_url}`}
            onError={(e) =>
              (e.target.src =
                "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
            }
            alt={data.name}
          />
          <div className="item-list-detail">
            <div className="item-name">{data.name}</div>
            {/* <div className="item-description">{data.description}</div> */}
          </div>
          <div className="item-list-action">
            <AppButton
              secondary
              info={data.id === props.chosenAward}
              onClick={(e) => {
                e.preventDefault();
                props.onClick(data.id);
              }}
            >
              {data.id === props.chosenAward ? "Selected" : "View"}
            </AppButton>
          </div>
        </div>
      </div>
    );
  };

  const renderGridItem = (data) => {
    return (
      <div>
        <div className="item-grid-item card">
          <div className="item-grid-item-content">
            <img
              // src={`images/items/${data.image_url}`}
              src={`${data.image_url}`}
              onError={(e) =>
                (e.target.src =
                  "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
              }
              alt={data.name}
            />
            <div className="item-name">{data.name}</div>
            {/* <div className="item-description">{data.description}</div> */}
          </div>
          <div className="item-grid-item-bottom">
            <AppButton
              secondary
              info={data.name === props.chosenAward}
              onClick={(e) => {
                e.preventDefault();
                props.onClick(data.id);
              }}
            >
              {data.name === props.chosenAward ? "Selected" : "View"}
            </AppButton>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (item, layout) => {
    if (!item) {
      return;
    }

    if (layout === "list") return renderListItem(item);
    else if (layout === "grid") return renderGridItem(item);
  };

  const renderHeader = () => {
    return (
      <div className="gallery-display-header">
        <div style={{ textAlign: "left" }}>
          {props.header ? props.header : ""}
        </div>
        <div style={{ textAlign: "right" }}>
          <DataViewLayoutOptions
            layout={layout}
            onChange={(e) => setLayout(e.value)}
          />
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div
      className={classNames(
        "gallery-display-items",
        { "grid-view-dataview": layout === "grid" },
        { "list-view-dataview": layout === "list" }
      )}
    >
      <div className="card">
        <DataView
          value={items}
          layout={layout}
          header={header}
          itemTemplate={itemTemplate}
          paginator
          rows={9}
        />
      </div>
    </div>
  );
}
