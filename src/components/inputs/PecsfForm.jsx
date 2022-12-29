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

/**
 * Pecsf Award Options Component.
 * @param {object} props
 * @returns
 */

export default function PecsfForm(props) {
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

  return (
    <div className="pecsf-award-options">
      <li className="award-option-block">
        <label
          htmlFor={"donation-certificate"}
          className={classNames("block", {
            "p-error": errors["donation-certificate"],
          })}
        >
          How you would like your name to appear on your PECSF Donation
          certificate?
        </label>

        <Controller
          name={`awardoptions.${0}.donation-certificate}`}
          control={control}
          defaultValue=""
          rules={{
            required: {
              value: true,
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
              placeholder={`Enter the full name of the individual`}
            />
          )}
        />
        {getFormErrorMessage(
          `${"donation-certificate"}`,
          `${"donation-certificate"}-help`,
          errors,
          ["awardoptions", 0, "donation-certificate"]
        )}
      </li>
    </div>
  );
}
