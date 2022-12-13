import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import formServices from "../../services/settings.services";
import classNames from "classnames";
import "./ContactDetails.css";

/**
 * Address Input reusable component. Conditional PO Box requirement for address's identified for supervisors.
 * @param {object} props
 * @param {ref} props.submitReference reference for form submission to be handled by parent component
 * @param {boolean} props.basic state variable boolean for controlling if basic fields are displayed
 * @param {boolean} props.extended state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.delegated state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.personalContact state variable boolean for controlling if personal contact information displayed
 * @param {string} props.panelName string describing what panel these contact details belong to ex: Supervisor, Personal
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function ContactDetails(props) {
  const panelGroupName = props.panelName ? props.panelName : "default";
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

  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});

  //state has to be in the main view being submitted. This has to be moved up to be managed on the individual views for form submission to function.
  const [formValues, setFormValues] = useState([
    { field: "firstname", value: "" },
    { field: "lastname", value: "" },
    { field: "governmentemail", value: "" },
    { field: "governmentphone", value: "" },
    { field: "employeenumber", value: "" },
    { field: "ministryorganization", value: null },
    { field: "branch", value: "" },
    { field: "personalphone", value: "" },
    { field: "personalemail", value: "" },
  ]);

  const defaultValues = {
    firstname: "",
    lastname: "",
    governmentemail: "",
    governmentphone: "",
    employeenumber: "",
    ministryorganization: null,
    branch: "",
    personalphone: "",
    personalemail: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    console.log(formValues, "this is current form values in state");
    console.log(data, "this is data");
    const newFormValues = formValues.map(
      (each) => (each.value = data[each.field])
    );
    setFormValues(newFormValues);
    console.log(formValues, "this is updated form values");
    setFormData(data);
    setShowMessage(true);

    // reset();
  };

  const getFormErrorMessage = (name, id) => {
    const helpid = id ? id : "";
    return (
      errors[name] && (
        <small className={`p-error ${helpid}`}>{errors[name].message}</small>
      )
    );
  };

  const organizations = formServices.get("organizations") || [];
  const fullOrgList = organizations.concat(
    formServices.get("currentPinsOnlyOrganizations") || []
  );

  return (
    <div className={`contact-details-form-${panelGroupName}`}>
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    name="firstname"
                    control={control}
                    rules={{ required: "Error: First name is required." }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={`${panelGroupName}-${field.name}`}
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
                    "firstname",
                    `${panelGroupName}-firstname-help`
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
                    name="lastname"
                    control={control}
                    rules={{ required: "Error: Last name is required." }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={`${panelGroupName}-${field.name}`}
                        {...field}
                        className={classNames("form-field block", {
                          "p-invalid": fieldState.error,
                        })}
                        aria-describedby={`${panelGroupName}-lastname-help`}
                        placeholder={`${panelPlaceholder} last name`}
                      />
                    )}
                  />
                  {getFormErrorMessage(
                    "lastname",
                    `${panelGroupName}-lastname-help`
                  )}
                </div>
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-government-email`}
                    className={classNames("block", {
                      "p-error": !!errors.governmentemail,
                    })}
                  >
                    {`${panelCapitalized} Government Email`}
                  </label>
                  <Controller
                    name="governmentemail"
                    control={control}
                    rules={{
                      required: "Error: Government email is required.",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message:
                          "Invalid email address. E.g. example@gov.bc.ca",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={`${panelGroupName}-government-email`}
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
                    "governmentemail",
                    `${panelGroupName}-government-email-help`
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
                      name="governmentphone"
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
                          id={`${panelGroupName}-government-phone`}
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
                      "governmentphone",
                      `${panelGroupName}-government-phone-help`
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
                      name="employeenumber"
                      control={control}
                      rules={{
                        required: "Error: Employee number is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={`${panelGroupName}-${field.name}`}
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
                      "employeenumber",
                      `${panelGroupName}-employeenumber-help`
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
                      name="ministryorganization"
                      control={control}
                      rules={{
                        required:
                          "Error: Ministry or Organization is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <Dropdown
                          id={`${panelGroupName}-${field.name}`}
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
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
                      "ministryorganization",
                      `${panelGroupName}-ministryorganization-help`
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
                      name="branch"
                      control={control}
                      rules={{ required: "Error: Branch is required." }}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={`${panelGroupName}-branch`}
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
                      "branch",
                      `${panelGroupName}-branch-help`
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
                    name="personalphone"
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
                        id={`${panelGroupName}-personalphone`}
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
                    "personalphone",
                    `${panelGroupName}-personalphone-help`
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
                    name="personalemail"
                    control={control}
                    rules={{
                      required: "Error: Personal email address is required.",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message:
                          "Invalid email address. E.g. example@email.com",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={`${panelGroupName}-personalemail`}
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
                    "personalemail",
                    `${panelGroupName}-personalemail-help`
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <button
            ref={props.submitReference}
            type="submit"
            style={{ display: "none" }}
          />
        </form>
      </div>
    </div>
  );
}
