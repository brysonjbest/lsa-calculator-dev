import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import classNames from "classnames";

import getFormErrorMessage from "../../services/helpers/ErrorMessage";
import formServices from "../../services/settings.services";

import "./ContactDetails.css";

/**
 * Address Input reusable component. Conditional PO Box requirement for address's identified for supervisors.
 * @param {object} props
 * @param {(index) => void} props.ministryRef function for minstry choice to be handled by parent component
 * @param {integer} props.index index of item within form
 * @param {boolean} props.basic state variable boolean for controlling if basic fields are displayed
 * @param {boolean} props.extended state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.delegated state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.personalContact state variable boolean for controlling if personal contact information displayed
 * @param {string} props.panelName string describing what panel these contact details belong to ex: Supervisor, Personal
 * @param {integer} props.itemNumber index of item within sublist; when used multiple times in a form, contact details will be registered as a separate item on form
 * @param {object} props.errors inherited errors object
 * @returns
 */

export default function ContactDetails({
  ministryRef,
  index,
  basic,
  extended,
  delegated,
  personalContact,
  panelName,
  itemNumber,
  errors,
}) {
  const { control } = useFormContext();
  //Organization dropdown list - to be moved up
  const organizations = formServices.get("organizations") || [];
  const fullOrgList = organizations.concat(
    formServices.get("currentPinsOnlyOrganizations") || []
  );

  //Form input name formatting
  let panelGroupName = panelName
    ? `${panelName.replace(/\s/g, "")}`
    : "default";
  if (panelName && itemNumber) {
    panelGroupName += ` ${itemNumber}`;
  }
  const panelTitle =
    panelName === "personal" ? "" : formServices.capitalize(panelName) || "";
  const panelPlaceholder =
    panelName === "personal"
      ? "Your"
      : formServices.capitalize(panelName) || "";

  const formItemName = itemNumber
    ? `${panelName}.${itemNumber - 1}.`
    : `${panelGroupName}-`;

  //On blur of ministry selection runs callback with given form value
  const onBlurMinistry = (event) => {
    const currentFormValue =
      formServices.lookup("organizations", event) ||
      formServices.lookup("currentPinsOnlyOrganizations", event);
    ministryRef ? ministryRef(index, currentFormValue) : null;
  };

  return (
    <div className={`contact-details-form-${panelGroupName}`}>
      <div className="container">
        <div
          className={`contact-information-${panelGroupName} contact-form-personal-details`}
        >
          {basic ? (
            <div className="contact-form-basic-details">
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${formItemName}firstname`}
                  className={classNames("block", {
                    "p-error": errors.firstname,
                  })}
                >
                  {`${panelTitle} First Name`}
                </label>
                <Controller
                  name={`${formItemName}firstname`}
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
                  errors,
                  panelName,
                  itemNumber - 1,
                  "firstname"
                )}
              </div>
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${formItemName}lastname`}
                  className={classNames("block", {
                    "p-error": errors.lastname,
                  })}
                >
                  {`${panelTitle} Last Name`}
                </label>
                <Controller
                  name={`${formItemName}lastname`}
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
                  errors,
                  panelName,
                  itemNumber - 1,
                  "lastname"
                )}
              </div>
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${formItemName}governmentemail`}
                  className={classNames("block", {
                    "p-error": !!errors.governmentemail,
                  })}
                >
                  {`${panelTitle} Government Email`}
                </label>
                <Controller
                  name={`${formItemName}governmentemail`}
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
                  errors,
                  panelName,
                  itemNumber - 1,
                  "governmentemail"
                )}
              </div>
            </div>
          ) : null}
          <div>
            <div className="contact-form-extended-details">
              {extended ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${formItemName}governmentphone`}
                    className={classNames("block", {
                      "p-error": errors.governmentphone,
                    })}
                  >
                    {`${panelTitle} Government Phone Number`}
                  </label>
                  <Controller
                    name={`${formItemName}governmentphone`}
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
                    errors,
                    panelName,
                    itemNumber - 1,
                    "governmentphone"
                  )}
                </div>
              ) : null}
              {extended || delegated ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${formItemName}employeenumber`}
                    className={classNames("block", {
                      "p-error": errors.employeenumber,
                    })}
                  >
                    {`${panelTitle} Employee Number`}
                  </label>
                  <Controller
                    name={`${formItemName}employeenumber`}
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
                    errors,
                    panelName,
                    itemNumber - 1,
                    "employeenumber"
                  )}
                </div>
              ) : null}
              {extended || delegated ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`organization`}
                    className={classNames("block", {
                      "p-error": errors.organization,
                    })}
                  >
                    {`${panelTitle} Ministry/Organization`}
                  </label>
                  <Controller
                    name={`organization`}
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
                        aria-describedby={`${panelGroupName}-organization-help`}
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
                    `${panelGroupName}-organization`,
                    errors,
                    panelName,
                    itemNumber - 1,
                    "organization"
                  )}
                </div>
              ) : null}
              {extended ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`branch`}
                    className={classNames("block", {
                      "p-error": errors.branch,
                    })}
                  >
                    {`${panelTitle} Branch`}
                  </label>
                  <Controller
                    name={`branch`}
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
                    errors,
                    panelName,
                    itemNumber - 1,
                    "branch"
                  )}
                </div>
              ) : null}
            </div>
          </div>
          {personalContact ? (
            <div className="contact-form-personalcontact-details">
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${formItemName}personalphone`}
                  className={classNames("block", {
                    "p-error": errors.personalphone,
                  })}
                >
                  {`${panelTitle} Personal Phone Number`}
                </label>
                <Controller
                  name={`${formItemName}personalphone`}
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
                  errors,
                  panelName,
                  itemNumber - 1,
                  "personalphone"
                )}
              </div>
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${formItemName}personalemail`}
                  className={classNames("block", {
                    "p-error": !!errors.personalemail,
                  })}
                >
                  {`${panelTitle} Personal Email Address`}
                </label>
                <Controller
                  name={`${formItemName}personalemail`}
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
                  errors,
                  panelName,
                  itemNumber - 1,
                  "personalemail"
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
