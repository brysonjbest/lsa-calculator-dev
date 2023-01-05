import React, { useEffect, useRef, useState, useMemo } from "react";

import { Dialog } from "primereact/dialog";

import AppButton from "../common/AppButton";
import ServiceCalculator from "./ServiceCalculator";
import {
  useForm,
  Controller,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputMask } from "primereact/inputmask";
import { InputNumber } from "primereact/inputnumber";
import formServices from "../../services/settings.services";
import getFormErrorMessage from "../../services/helpers/ErrorMessage";

import classNames from "classnames";
import "./AwardSelector.css";
import GalleryDisplay from "../common/GalleryDisplay";
import PecsfForm from "./PecsfForm";
import AwardForm from "./AwardForm";

/**
 * Award Selection Component.
 * @param {object} props
 * @returns
 */

export default function AwardSelector(props) {
  const [availableAwards, setAvailableAwards] = useState([
    {
      id: "1000",
      vendor: "f230fh0g3",
      name: "PECSF Donation",
      description: "PECSF Donation Options",
      image_url: "https://picsum.photos/200",
      options: [
        {
          id: "",
          type: "dropdown",
          name: "donationtype",
          required: true,
          value: "donationtype",
          description: "Choose your pecsf donation",
          customizable: true,
        },
        {
          id: "",
          type: "text",
          name: "donationextra",
          required: true,
          value: "donationtype",
          description: "These are additional details",
          customizable: true,
        },
      ],
    },
    {
      id: "1001",
      vendor: "nvklal433",
      name: "Whale Tail Painting",
      description: "Whale Tail Painting",
      image_url: "https://picsum.photos/200",
      options: [
        {
          id: "",
          type: "text",
          name: "inscription",
          required: true,
          value: "",
          description: "What would you like the inscription to say.",
          customizable: true,
        },
        {
          id: "",
          type: "dropdown",
          name: "paintingtype",
          required: true,
          value: "",
          description: "Select type of painting.",
          customizable: true,
          options: ["oil", "watercolour"],
        },
        {
          id: "",
          type: "multiselect",
          name: "paintingtools",
          required: true,
          value: "",
          description: "Select tools used in painting.",
          customizable: false,
          options: ["fork", "brush", "spoon"],
        },
        {
          id: "",
          type: "radio",
          name: "whaletype",
          required: true,
          value: "",
          description: "Please select type of whale",
          customizable: false,
          options: ["orca", "grey"],
        },
      ],
    },
    {
      id: "1002",
      vendor: "zz21cz3c1",
      name: "Blue Band",
      description: "Product Description",
      image_url: "https://picsum.photos/200",
      options: [],
    },
    {
      id: "1003",
      vendor: "244wgerg2",
      name: "Blue T-Shirt",
      description: "Product Description",
      image_url: "https://picsum.photos/200",
    },
  ]);

  const [awardOptions, setAwardOptions] = useState({});
  const [awardDialog, setAwardDialog] = useState(false);
  const [awardChosen, setAwardChosen] = useState("");
  const [formChanged, setFormChanged] = useState(false);

  const methods = useFormContext();
  const errors = props.errors;
  const {
    control,
    setValue,
    clearErrors,
    resetField,
    getValues,
    watch,
    formState: { isDirty, isValid },
  } = methods;

  watch(() => setFormChanged(true));

  const renderAwardOptions = (data) => {
    // console.log(data, "this is data selected");
    const options = data.options || [];
    const pecsfOptions = data.name
      ? data.name.toLowerCase().includes("pecsf")
      : false;
    const listOptions = options.map((option, index) => (
      <div key={index}>
        <li className="award-option-block">
          <label
            htmlFor={option.name}
            className={classNames("block", {
              "p-error": errors[option.name],
            })}
          >
            {option.description}
          </label>
          <AwardForm errors={errors} option={option} />
          {getFormErrorMessage(
            `${option.name}`,
            `${option.name}-help`,
            errors,
            ["awardoptions", 0, option.name]
          )}
        </li>
      </div>
    ));
    return (
      <div>
        <div className="award-selection-options">
          <div>{data.description}</div>
          <div>
            <img
              src={`${data.image_url}`}
              onError={(e) =>
                (e.target.src =
                  "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
              }
              alt={data.name}
            />
          </div>
          <ul className="options-list">
            {pecsfOptions ? <PecsfForm errors={props.errors} /> : listOptions}
          </ul>
          <div className="options-list-action">
            <AppButton
              disabled={!isValid}
              onClick={(e) => {
                e.preventDefault();
                props.submitAward ? props.submitAward(e, data.id) : null;
                if (isValid) {
                  setValue("awardID", data.id);
                  setValue("awardname", data.name);
                  setValue("awarddescription", data.description);
                  setAwardDialog(false);
                  setAwardChosen(data.name);
                }
              }}
            >
              Select Award
            </AppButton>
          </div>
        </div>
      </div>
    );
  };

  const awardSelect = (itemID) => {
    setAwardDialog(true);
    const awardLookup = availableAwards.filter(function (item) {
      return item.id === itemID;
    });
    setAwardOptions(awardLookup[0]);
    // const defaultOptions = awardLookup[0].options.map((option) => {
    //   const name = option.name;
    //   return { [name]: "" };
    // });
    // console.log(defaultOptions, "this should be all options");

    // setValue([{ awardoptions: defaultOptions }]);

    // console.log(itemID, "this is selected", awardLookup);

    // return;
  };

  const awardHide = () => {
    setAwardDialog(false);
    setAwardOptions([]);
    //currently fully resets - will have to be selective
    setValue("awardoptions", []);

    // console.log("this is deselected");
  };

  const optionDisplay = renderAwardOptions(awardOptions);

  return (
    <div className={`award-selection-form`}>
      <GalleryDisplay
        onClick={awardSelect}
        header="Award Options"
        itemSet={availableAwards}
        // chosenAward={props.award}
        chosenAward={awardChosen}
      />
      <Dialog
        visible={awardDialog}
        onHide={() => awardHide()}
        maximizable
        modal
        style={{ width: "80vw" }}
        breakpoints={{ "960px": "75vw" }}
      >
        {optionDisplay}
      </Dialog>
    </div>
  );
}
