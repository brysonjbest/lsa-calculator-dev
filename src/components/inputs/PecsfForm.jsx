import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import getFormErrorMessage from "../../services/helpers/ErrorMessage";
import classNames from "classnames";

/**
 * Pecsf Award Options Component.
 * @param {object} props
 * @returns
 */

export default function PecsfForm(props) {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const formName = `awardoptions.${0}`;
  const [regions1, setRegions1] = useState([
    "Vancouver",
    "Victoria",
    "Lower Mainland",
  ]);
  const [regions2, setRegions2] = useState([
    "Prince George",
    "Tofino",
    "Cranbrook",
  ]);
  const [charity1, setCharity1] = useState(["Helping", "Testing", "charity1"]);
  const [charity2, setCharity2] = useState(["Charlie", "Bobtail", "charity2"]);

  const methods = useFormContext();
  const errors = props.errors;
  const {
    control,
    getValues,
    register,
    watch,
    formState: { isDirty, isValid },
  } = methods;

  //to update regions/charities by api
  useEffect(() => {}, []);

  function RenderDropdown({
    name,
    options,
    required,
    placeholder,
    disabled,
    errormessage,
  }) {
    return (
      <div>
        <Controller
          name={`${formName}.${name}`}
          control={control}
          defaultValue=""
          rules={{
            required: {
              value: required,
              message: `${errormessage} is required`,
            },
          }}
          render={({ field, fieldState }) => (
            <Dropdown
              disabled={disabled}
              id={`${field.name}`}
              value={field.value}
              options={options}
              aria-describedby={`${field.name}-help`}
              {...field}
              className={classNames("form-field block", {
                "p-invalid": fieldState.error,
              })}
              placeholder={placeholder}
            />
          )}
        />
        {getFormErrorMessage(
          `awardoptions.${0}.${name}`,
          `awardoptions.${0}.${name}-help`,
          errors,
          ["awardoptions", 0, name]
        )}
      </div>
    );
  }

  const watchRegion1 = watch(`${formName}.firstregion`);
  const watchRegion2 = watch(`${formName}.secondregion`);

  return (
    <div className="pecsf-award-options">
      <div>
        <p>
          {" "}
          In lieu of receiving a Long Service Award, you may opt to make a
          charitable donation via PRovincial Employees Community Services Fund
          (PECSF).{" "}
          <b>
            Please Note - charitable tax receipts are not issued for LSA
            donations.
          </b>
        </p>
        <p>You may choose one of two donation options:</p>

        <ol>
          <li>
            to donate to the <b>PECSF Regional Pool Fund</b> Supported pool of
            charities in your region, OR,
          </li>
          <li>
            to donate to a registered charitable organization (maximum of two)
            of your choice.
          </li>
        </ol>
      </div>
      <div className="donation-choice-block">
        <li className="award-option-block">
          <label
            htmlFor={`${formName}.donation-choice`}
            className={classNames("block", {
              "p-error": errors[`${formName}.donation-choice`],
            })}
          >
            Choose Your Donation
          </label>

          {/* <RadioButton
            inputId="regionalpool"
            name="donation-choice"
            value="regionalpool"
            onChange={(e) => setSelectedDonation(e.value)}
            checked={selectedDonation === "regionalpool"}
          /> */}

          <input
            {...register(`${formName}.donation-choice`, {
              required: {
                value: true,
                message: `Option selection is required`,
              },
            })}
            type="radio"
            onClick={(e) => {
              setSelectedDonation(`${e.target.value}`);
            }}
            value={"regionalpool"}
          />
          <label
            htmlFor={`${formName}.donation-choice-regionalpool`}
            className="block"
          >
            Donate to the PECSF Regional Pool Fund
          </label>
          <input
            {...register(`${formName}.donation-choice`, {
              required: {
                value: true,
                message: `Option selection is required`,
              },
            })}
            type="radio"
            onClick={(e) => {
              setSelectedDonation(`${e.target.value}`);
            }}
            value={"choosecharity"}
            className={classNames("form-field block", {
              "p-invalid": errors["awardoptions"]
                ? errors["awardoptions"][0]["donation-choice"]
                : false,
            })}
          />
          {/* <RadioButton
            inputId="choosecharity"
            name="donation-choice"
            value="choosecharity"
            onChange={(e) => setSelectedDonation(e.value)}
            checked={selectedDonation === "choosecharity"}
          /> */}
          <label
            htmlFor={`${formName}.donation-choice-regionalpool`}
            className="block"
          >
            Donate to a registered charitable organization (maximum of two)
          </label>
          {getFormErrorMessage(
            `${"donation-choice"}`,
            `${"donation-choice"}-help`,
            errors,
            ["awardoptions", 0, "donation-choice"]
          )}
        </li>
      </div>
      <div className="pecsf-charity-selections">
        <div className="pecsf-choice-1">
          <li className="award-option-block">
            <label
              htmlFor={"firstregion"}
              className={classNames("block", {
                "p-error": errors["firstregion"],
              })}
            >
              Choose a region for your first donation
            </label>
            <RenderDropdown
              name="firstregion"
              options={regions1}
              required
              placeholder="Please select a PECSF region"
              disabled={false}
              errormessage="PECSF region"
            />
          </li>
          <li className="award-option-block">
            <label
              htmlFor={"donation-choice"}
              className={classNames("block", {
                "p-error": errors["donation-choice"],
              })}
            >
              Choose a charity for your first donation
            </label>
            <RenderDropdown
              name="firstcharity"
              options={charity1}
              required
              placeholder="Select a region to view charities"
              disabled={!watchRegion1}
              errormessage="Charity selection"
            />
            <small>
              Optional. If you do not see your charity listed, please contact
              PECSF@gov.bc.ca
            </small>
          </li>
        </div>
        {selectedDonation === "choosecharity" ? (
          <div className="pecsf-choice-2">
            <li className="award-option-block">
              <label
                htmlFor={"secondregion"}
                className={classNames("block", {
                  "p-error": errors["secondregion"],
                })}
              >
                Choose a region for your second donation
              </label>
              <RenderDropdown
                name="secondregion"
                options={regions2}
                required={false}
                placeholder="Please select a PECSF region"
                disabled={selectedDonation !== "choosecharity"}
                errormessage="PECSF region"
              />
              <small>Optional</small>
            </li>
            <li className="award-option-block">
              <label
                htmlFor={"donation-choice"}
                className={classNames("block", {
                  "p-error": errors["donation-choice"],
                })}
              >
                Choose a charity for your second donation
              </label>
              <RenderDropdown
                name="secondcharity"
                options={charity2}
                required={getValues(`${formName}.secondregion`)}
                placeholder="Select a region to view charities"
                disabled={!watchRegion2}
                errormessage="Charity selection"
              />
              <small>
                Optional. If you do not see your charity listed, please contact
                PECSF@gov.bc.ca
              </small>
            </li>
          </div>
        ) : null}
      </div>

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
          name={`${formName}.donation-certificate`}
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
              ref={field.ref}
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
        <small>
          You can make the donation in memory or in honour of someone
        </small>
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
