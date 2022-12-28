import React, { useEffect, useRef, useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import classNames from "classnames";
import AppButton from "./AppButton";
import "./GalleryDisplay.css";

/**
 * Gallery Display common display component to display items in list with details
 * @param {object} props
 * @returns
 */

export default function GalleryDisplay(props) {
  // const [items, setItems] = useState([]);
  const [layout, setLayout] = useState("grid");
  //testing data
  const [items, setItems] = useState([
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      description: "Product Description",
      image: "bamboo-watch.jpg",
    },
    {
      id: "1001",
      code: "nvklal433",
      name: "Black Watch",
      description: "Product Description",
      image: "black-watch.jpg",
    },
    {
      id: "1002",
      code: "zz21cz3c1",
      name: "Blue Band",
      description: "Product Description",
      image: "blue-band.jpg",
    },
    {
      id: "1003",
      code: "244wgerg2",
      name: "Blue T-Shirt",
      description: "Product Description",
      image: "blue-t-shirt.jpg",
    },
  ]);

  useEffect(() => {
    //fill items array
  }, []);

  const renderListItem = (data) => {
    return (
      <div>
        <div className="item-list-item">
          <img
            src={`images/item/${data.image}`}
            onError={(e) =>
              (e.target.src =
                "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
            }
            alt={data.name}
          />
          <div className="item-list-detail">
            <div className="item-name">{data.name}</div>
            <div className="item-description">{data.description}</div>
          </div>
          <div className="item-list-action">
            <AppButton secondary>{"View"}</AppButton>
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
              src={`images/items/${data.image}`}
              onError={(e) =>
                (e.target.src =
                  "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
              }
              alt={data.name}
            />
            <div className="item-name">{data.name}</div>
            <div className="item-description">{data.description}</div>
          </div>
          <div className="item-grid-item-bottom">
            <AppButton secondary>{"View"}</AppButton>
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
