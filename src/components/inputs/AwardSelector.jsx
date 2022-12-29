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
          type: "null",
          name: "Whale Tail painting Selection",
          required: true,
          value: "",
          description: "This is a painting of a whale tail.",
          customizable: false,
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

  const methods = useFormContext();
  const errors = props.errors;
  const {
    control,
    setValue,
    clearErrors,
    resetField,
    getValues,
    formState: { isDirty, isValid },
  } = methods;

  const renderAwardOptions = (data) => {
    // console.log(data, "this is data selected");
    const options = data.options || [];
    console.log("this is data.name", data.name);
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

          <Controller
            name={`awardoptions.${0}.${option.name}`}
            control={control}
            defaultValue=""
            rules={{
              required: {
                value: option.required,
                message: `Option selection is required`,
              },
            }}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${field.name}-help`}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder={`${option.description}`}
              />
            )}
          />
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
          <ul className="options-list">
            {pecsfOptions ? <PecsfForm errors={props.errors} /> : listOptions}
          </ul>
          <div className="options-list-action">
            <AppButton
              disabled={!isValid}
              onClick={(e) => {
                e.preventDefault();
                console.log(errors);
                props.submitAward ? props.submitAward(data.id) : null;
                setAwardDialog(false);
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

    // console.log("this is deselected");
  };

  const optionDisplay = renderAwardOptions(awardOptions);

  return (
    <div className={`award-selection-form`}>
      <GalleryDisplay
        onClick={awardSelect}
        header="Award Options"
        itemSet={availableAwards}
        chosenAward={props.award}
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
