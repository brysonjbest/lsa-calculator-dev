import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import getFormErrorMessage from "../../services/helpers/ErrorMessage";
import "./LSADetails.css";
import classNames from "classnames";

/**
 * LSA Details reusable component.
 * @param {object} props
 * @param {object} props.errors errors object
 * @param {string} props.panelName string describing what panel these contact details belong to ex: Supervisor, Personal
 * @returns
 */

export default function LSADetails(props) {
  //fix this formatting in milestones and contactdetails
  const today = new Date();
  const year = today.getFullYear();
  const startYear = new Date(year, 0, 0);
  const endYear = new Date(year, 11, 31);

  let panelGroupName = props.panelName
    ? `${props.panelName.replace(/\s/g, "")}`
    : "default";

  panelGroupName =
    props.panelName && props.itemNumber
      ? `${props.panelName.replace(/\s/g, "")} ${props.itemNumber}`
      : panelGroupName;

  const { control, watch, setValue } = useFormContext();

  const errors = props.errors;

  const isRetiring = watch("retiringcurrentyear");

  return (
    <div className={`lsa-attendance-form-${panelGroupName}`}>
      <div className="container">
        <div className={`lsa-attendance-${panelGroupName}`}>
          <div className="lsa-attendance-details">
            <div className="lsa-attendance-form-field-container">
              <label
                htmlFor={`bcgeumember`}
                className={classNames("block", {
                  "p-error": errors.bcgeumember,
                })}
              >
                {`Are you a BCGEU member?`}
              </label>
              <div>
                <Controller
                  name="bcgeumember"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      id={`${field.name}`}
                      aria-describedby={`bcgeumember-help`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      inputId={field.name}
                      onChange={(e) => field.onChange(e.checked)}
                      checked={field.value}
                    />
                  )}
                />
                <small>Yes, I am a BCGEU member.</small>
              </div>
              {getFormErrorMessage(`bcgeumember`, `bcgeumember-help`, errors)}
            </div>

            <div className="lsa-attendance-form-field-container">
              <label
                htmlFor={`retiringcurrentyear`}
                className={classNames("block", {
                  "p-error": errors.retiringcurrentyear,
                })}
              >
                {`Are you retiring this year?`}
              </label>
              <div>
                <Controller
                  name="retiringcurrentyear"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      id={`${field.name}`}
                      aria-describedby={`retiringcurrentyear-help`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      inputId={field.name}
                      onChange={(e) => {
                        setValue("retirementdate", null);
                        field.onChange(e.checked);
                      }}
                      checked={field.value}
                    />
                  )}
                />
                <small>Yes, I am retiring this year.</small>
              </div>
              {getFormErrorMessage(
                `retiringcurrentyear`,
                `retiringcurrentyear-help`,
                errors
              )}
            </div>
            {isRetiring ? (
              <div className="lsa-attendance-form-field-container">
                <label
                  htmlFor={`retirementdate`}
                  className={classNames("block", {
                    "p-error": errors.retirementdate,
                  })}
                >
                  {`Please select your retirement date:`}
                </label>

                <Controller
                  name="retirementdate"
                  control={control}
                  rules={{
                    required:
                      "Error: Retirement date is required if you are retiring this year.",
                  }}
                  render={({ field, fieldState }) => (
                    <Calendar
                      id={`${field.name}`}
                      aria-describedby={`retirementdate-help`}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.value);
                      }}
                      dateFormat="dd/mm/yy"
                      mask="99/99/9999"
                      showIcon
                      placeholder="Select retirement date"
                      minDate={startYear}
                      maxDate={endYear}
                    />
                  )}
                />
                <small>Please select your retirement date.</small>

                {getFormErrorMessage(
                  `retirementdate`,
                  `retirementdate-help`,
                  errors
                )}
              </div>
            ) : null}
            <div className="lsa-attendance-form-field-container">
              <label
                htmlFor={`ceremonyoptout`}
                className={classNames("block", {
                  "p-error": errors.ceremonyoptout,
                })}
              >
                {`Would you prefer to opt out of the Long Service Awards Ceremony?`}
              </label>
              <div>
                <Controller
                  name="ceremonyoptout"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      id={`${field.name}`}
                      aria-describedby={`ceremonyoptout-help`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      inputId={field.name}
                      onChange={(e) => field.onChange(e.checked)}
                      checked={field.value}
                    />
                  )}
                />
                <small>
                  Yes, I want to receive my award only and opt out of attending
                  the ceremony.
                </small>
              </div>
              {getFormErrorMessage(
                `ceremonyoptout`,
                `ceremonyoptout-help`,
                errors
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}