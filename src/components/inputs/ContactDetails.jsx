import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import formServices from "../../services/settings.services";
import getFormErrorMessage from "../../services/helpers/ErrorMessage";
import classNames from "classnames";
import "./ContactDetails.css";

/**
 * Address Input reusable component. Conditional PO Box requirement for address's identified for supervisors.
 * @param {object} props
 * @param {ref} props.submitReference reference for form submission to be handled by parent component
 * @param {(index) => void} props.ministryRef function for minstry choice to be handled by parent component
 * @param {integer} props.index index of item within form
 * @param {boolean} props.basic state variable boolean for controlling if basic fields are displayed
 * @param {boolean} props.extended state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.delegated state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.personalContact state variable boolean for controlling if personal contact information displayed
 * @param {string} props.panelName string describing what panel these contact details belong to ex: Supervisor, Personal
 * props.itemNumber
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function ContactDetails(props) {
  //fix this formatting in milestones and contactdetails
  let panelGroupName = props.panelName
    ? `${props.panelName.replace(/\s/g, "")}`
    : "default";
  panelGroupName =
    props.panelName && props.itemNumber
      ? `${props.panelName.replace(/\s/g, "")} ${props.itemNumber}`
      : panelGroupName;
  const panelCapitalized =
    props.panelName === "personal"
      ? ""
      : props.panelName.charAt(0).toUpperCase() +
          props.panelName.slice(1).toLowerCase() || "defaultCapitalized";
  const panelPlaceholder =
    props.panelName === "personal"
      ? "Your"
      : props.panelName.charAt(0).toUpperCase() +
          props.panelName.slice(1).toLowerCase() || "";

  const { control } = useFormContext();

  const errors = props.errors;

  const onBlurMinistry = (event) => {
    const currentFormValue =
      formServices.lookup("organizations", event) ||
      formServices.lookup("currentPinsOnlyOrganizations", event);
    props.ministryRef ? props.ministryRef(props.index, currentFormValue) : null;
  };

  const organizations = formServices.get("organizations") || [];
  const fullOrgList = organizations.concat(
    formServices.get("currentPinsOnlyOrganizations") || []
  );

  return (
    <div className={`contact-details-form-${panelGroupName}`}>
      <div className="container">
        <div
          className={`contact-information-${panelGroupName} contact-form-personal-details`}
        >
          {props.basic ? (
            <div className="contact-form-basic-details">
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${panelGroupName}-firstname`}
                  className={classNames("block", {
                    "p-error": errors.firstname,
                  })}
                >
                  {`${panelCapitalized} First Name`}
                </label>
                <Controller
                  name={
                    props.itemNumber
                      ? `${props.panelName}.${props.itemNumber - 1}.firstname`
                      : `${panelGroupName}-firstname`
                  }
                  control={control}
                  rules={{ required: "Error: First name is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={`${field.name}`}
                      aria-describedby={`${panelGroupName}-firstname-help`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      placeholder={`${panelPlaceholder} first name`}
                    />
                  )}
                />
                {getFormErrorMessage(
                  `${panelGroupName}-firstname`,
                  `${panelGroupName}-firstname-help`,
                  errors,
                  [props.panelName, props.itemNumber - 1, "firstname"]
                )}
              </div>
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${panelGroupName}-lastname`}
                  className={classNames("block", {
                    "p-error": errors.lastname,
                  })}
                >
                  {`${panelCapitalized} Last Name`}
                </label>
                <Controller
                  name={
                    props.itemNumber
                      ? `${props.panelName}.${props.itemNumber - 1}.lastname`
                      : `${panelGroupName}-lastname`
                  }
                  control={control}
                  rules={{ required: "Error: Last name is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={`${field.name}`}
                      aria-describedby={`${panelGroupName}-lastname-help`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      placeholder={`${panelPlaceholder} last name`}
                    />
                  )}
                />
                {getFormErrorMessage(
                  `${panelGroupName}-lastname`,
                  `${panelGroupName}-lastname-help`,
                  errors,
                  [props.panelName, props.itemNumber - 1, "lastname"]
                )}
              </div>
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${panelGroupName}-governmentemail`}
                  className={classNames("block", {
                    "p-error": !!errors.governmentemail,
                  })}
                >
                  {`${panelCapitalized} Government Email`}
                </label>
                <Controller
                  name={
                    props.itemNumber
                      ? `${props.panelName}.${
                          props.itemNumber - 1
                        }.governmentemail`
                      : `${panelGroupName}-governmentemail`
                  }
                  control={control}
                  rules={{
                    required: "Error: Government email is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address. E.g. example@gov.bc.ca",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={`${field.name}`}
                      type="text"
                      aria-describedby={`${panelGroupName}-government-email-help`}
                      placeholder={`${panelPlaceholder} government email`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage(
                  `${panelGroupName}-governmentemail`,
                  `${panelGroupName}-government-email-help`,
                  errors,
                  [props.panelName, props.itemNumber - 1, "governmentemail"]
                )}
              </div>
            </div>
          ) : null}
          <div>
            <div className="contact-form-extended-details">
              {props.extended ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-government-phone`}
                    className={classNames("block", {
                      "p-error": errors.governmentphone,
                    })}
                  >
                    {`${panelCapitalized} Government Phone Number`}
                  </label>
                  <Controller
                    name={
                      props.itemNumber
                        ? `${props.panelName}.${
                            props.itemNumber - 1
                          }.governmentphone`
                        : `${panelGroupName}-governmentphone`
                    }
                    control={control}
                    rules={{
                      required: "Error: Government phone number is required.",
                      pattern: {
                        value:
                          /^(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
                        message: "Invalid phone number. E.g. (555)-555-5555",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <InputMask
                        id={`${field.name}`}
                        mask="(999) 999-9999? x99999"
                        autoClear={false}
                        {...field}
                        placeholder={`${panelPlaceholder} government phone number Ex. (999) 999-9999 x99999`}
                        aria-describedby={`${panelGroupName}-government-phone-help`}
                        className={classNames("form-field block", {
                          "p-invalid": fieldState.error,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage(
                    `${panelGroupName}-governmentphone`,
                    `${panelGroupName}-government-phone-help`,
                    errors,
                    [props.panelName, props.itemNumber - 1, "governmentphone"]
                  )}
                </div>
              ) : null}
              {props.extended || props.delegated ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-employeenumber`}
                    className={classNames("block", {
                      "p-error": errors.employeenumber,
                    })}
                  >
                    {`${panelCapitalized} Employee Number`}
                  </label>
                  <Controller
                    name={
                      props.itemNumber
                        ? `${props.panelName}.${
                            props.itemNumber - 1
                          }.employeenumber`
                        : `${panelGroupName}-employeenumber`
                    }
                    control={control}
                    rules={{
                      required: "Error: Employee number is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={`${field.name}`}
                        aria-describedby={`${panelGroupName}-employeenumber-help`}
                        {...field}
                        className={classNames("form-field block", {
                          "p-invalid": fieldState.error,
                        })}
                        placeholder={`${panelPlaceholder} employee number`}
                      />
                    )}
                  />
                  {getFormErrorMessage(
                    `${panelGroupName}-employeenumber`,
                    `${panelGroupName}-employeenumber-help`,
                    errors,
                    [props.panelName, props.itemNumber - 1, "employeenumber"]
                  )}
                </div>
              ) : null}
              {props.extended || props.delegated ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-ministryorganization`}
                    className={classNames("block", {
                      "p-error": errors.ministryorganization,
                    })}
                  >
                    {`${panelCapitalized} Ministry/Organization`}
                  </label>
                  <Controller
                    name={
                      props.itemNumber
                        ? `${props.panelName}.${
                            props.itemNumber - 1
                          }.ministryorganization`
                        : `${panelGroupName}-ministryorganization`
                    }
                    control={control}
                    rules={{
                      required: "Error: Ministry or Organization is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={`${field.name}`}
                        value={field.value}
                        onChange={(e) => {
                          onBlurMinistry(e.value);
                          field.onChange(e.value);
                        }}
                        aria-describedby={`${panelGroupName}-ministryorganization-help`}
                        options={fullOrgList}
                        optionLabel="text"
                        className={classNames("form-field block", {
                          "p-invalid": fieldState.error,
                        })}
                        placeholder={`Select ${panelPlaceholder} ministry or organization`}
                      />
                    )}
                  />
                  {getFormErrorMessage(
                    `${panelGroupName}-ministryorganization`,
                    `${panelGroupName}-ministryorganization-help`,
                    errors,
                    [
                      props.panelName,
                      props.itemNumber - 1,
                      "ministryorganization",
                    ]
                  )}
                </div>
              ) : null}
              {props.extended ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-branch`}
                    className={classNames("block", {
                      "p-error": errors.branch,
                    })}
                  >
                    {`${panelCapitalized} Branch`}
                  </label>
                  <Controller
                    name={
                      props.itemNumber
                        ? `${props.panelName}.${props.itemNumber - 1}.branch`
                        : `${panelGroupName}-branch`
                    }
                    control={control}
                    rules={{ required: "Error: Branch is required." }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={`${field.name}`}
                        aria-describedby={`${panelGroupName}-branch-help`}
                        {...field}
                        className={classNames("form-field block", {
                          "p-invalid": fieldState.error,
                        })}
                        placeholder={`${panelPlaceholder} branch`}
                      />
                    )}
                  />
                  {getFormErrorMessage(
                    `${panelGroupName}-branch`,
                    `${panelGroupName}-branch-help`,
                    errors,
                    [props.panelName, props.itemNumber - 1, "branch"]
                  )}
                </div>
              ) : null}
            </div>
          </div>
          {props.personalContact ? (
            <div className="contact-form-personalcontact-details">
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${panelGroupName}-personalphone`}
                  className={classNames("block", {
                    "p-error": errors.personalphone,
                  })}
                >
                  {`${panelCapitalized} Personal Phone Number`}
                </label>
                <Controller
                  name={
                    props.itemNumber
                      ? `${props.panelName}.${
                          props.itemNumber - 1
                        }.personalphone`
                      : `${panelGroupName}-personalphone`
                  }
                  control={control}
                  rules={{
                    required: "Error: Personal phone number is required.",
                    pattern: {
                      value:
                        /^(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
                      message: "Invalid phone number. E.g. (555)-555-5555",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputMask
                      id={`${field.name}`}
                      mask="(999) 999-9999? x99999"
                      autoClear={false}
                      {...field}
                      placeholder={`${panelPlaceholder} personal phone number Ex. (999) 999-9999 x99999`}
                      aria-describedby={`${panelGroupName}-personalphone-help`}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage(
                  `${panelGroupName}-personalphone`,
                  `${panelGroupName}-personalphone-help`,
                  errors,
                  [props.panelName, props.itemNumber - 1, "personalphone"]
                )}
              </div>
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${panelGroupName}-personalemail`}
                  className={classNames("block", {
                    "p-error": !!errors.personalemail,
                  })}
                >
                  {`${panelCapitalized} Personal Email Address`}
                </label>
                <Controller
                  name={
                    props.itemNumber
                      ? `${props.panelName}.${
                          props.itemNumber - 1
                        }.personalemail`
                      : `${panelGroupName}-personalemail`
                  }
                  control={control}
                  rules={{
                    required: "Error: Personal email address is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address. E.g. example@email.com",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={`${field.name}`}
                      type="text"
                      aria-describedby={`${panelGroupName}-personalemail-help`}
                      placeholder={`${panelPlaceholder} personal email address`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage(
                  `${panelGroupName}-personalemail`,
                  `${panelGroupName}-personalemail-help`,
                  errors,
                  [props.panelName, props.itemNumber - 1, "personalemail"]
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
