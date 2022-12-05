import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import "./ContactDetails.css";

/**
 * Address Input reusable component. Conditional PO Box requirement for address's identified for supervisors.
 * @param {object} props
 * @param {ref} props.submitReference reference for form submission to be handled by parent component
 * @param {boolean} props.basic state variable boolean for controlling if basic fields are displayed
 * @param {boolean} props.extended state variable boolean for controlling if all fields are displayed
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

  const {
    handleSubmit,
    register,
    setFocus,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({});

  const onSubmit = () => {
    console.log("Success!");
  };

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
                    className="block"
                  >
                    {`${panelCapitalized} First Name`}
                  </label>
                  <InputText
                    id={`${panelGroupName}-firstname`}
                    type="text"
                    aria-describedby={`${panelGroupName}-firstname-help`}
                    className="form-field block"
                    placeholder={`${panelPlaceholder} first name`}
                    {...register(`firstname`, {
                      required: props.basic,
                    })}
                  />
                  {errors.firstname && (
                    <small
                      id={`${panelGroupName}-firstname-help`}
                      className="validation-error p-error block"
                    >
                      {`Error: ${panelCapitalized} first name is required.`}
                    </small>
                  )}
                </div>
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-lastname`}
                    className="block"
                  >
                    {`${panelCapitalized} Last Name`}
                  </label>
                  <InputText
                    id={`${panelGroupName}-lastname`}
                    type="text"
                    aria-describedby={`${panelGroupName}-lastname-help`}
                    className="form-field block"
                    placeholder={`${panelPlaceholder} last name`}
                    {...register("lastname", { required: props.basic })}
                  />
                  {errors.lastname && (
                    <small
                      id={`${panelGroupName}-lastname-help`}
                      className="validation-error p-error block"
                    >
                      {`Error: ${panelCapitalized} last name is required.`}
                    </small>
                  )}
                </div>
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-government-email`}
                    className="block"
                  >
                    {`${panelCapitalized} Government Email`}
                  </label>
                  <InputText
                    id={`${panelGroupName}-government-email`}
                    type="text"
                    aria-describedby={`${panelGroupName}-government-email-help`}
                    className="form-field block"
                    placeholder={`${panelPlaceholder} government email`}
                    {...register("governmentemail", { required: props.basic })}
                  />
                  {errors.governmentemail && (
                    <small
                      id={`${panelGroupName}-email-help`}
                      className="validation-error p-error block"
                    >
                      {`Error: ${panelCapitalized} government email is required.`}
                    </small>
                  )}
                </div>
              </div>
            ) : null}
            {props.extended ? (
              <div className="contact-form-extended-details">
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-government-phone`}
                    className="block"
                  >
                    {`${panelCapitalized} Government Phone Number`}
                  </label>
                  <InputText
                    id={`${panelGroupName}-government-phone`}
                    type="text"
                    aria-describedby={`${panelGroupName}-government-phone-help`}
                    className="form-field block"
                    placeholder={`${panelPlaceholder} government phone number`}
                    {...register("governmentphone", {
                      required: props.extended,
                    })}
                  />
                  {errors.governmentphone && (
                    <small
                      id={`${panelGroupName}-phone-help`}
                      className="validation-error p-error block"
                    >
                      {`Error: ${panelCapitalized} government phone number is required.`}
                    </small>
                  )}
                </div>
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-employeenumber`}
                    className="block"
                  >
                    {`${panelCapitalized} Employee Number`}
                  </label>
                  <InputText
                    id={`${panelGroupName}-employeenumber`}
                    type="text"
                    aria-describedby={`${panelGroupName}-employeenumber-help`}
                    className="form-field block"
                    placeholder={`${panelPlaceholder} employee number`}
                    {...register(`employeenumber`, {
                      required: props.extended,
                    })}
                  />
                  {errors.employeenumber && (
                    <small
                      id={`${panelGroupName}-employeenumber-help`}
                      className="validation-error p-error block"
                    >
                      {`Error: ${panelCapitalized} employee number is required.`}
                    </small>
                  )}
                </div>
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-ministryorganization`}
                    className="block"
                  >
                    {`${panelCapitalized} Ministry/Organization`}
                  </label>
                  <InputText
                    id={`${panelGroupName}-ministryorganization`}
                    type="text"
                    aria-describedby={`${panelGroupName}-ministryorganization-help`}
                    className="form-field block"
                    placeholder={`${panelPlaceholder} ministry or organization`}
                    {...register(`ministryorganization`, {
                      required: props.extended,
                    })}
                  />
                  {errors.ministryorganization && (
                    <small
                      id={`${panelGroupName}-ministryorganization-help`}
                      className="validation-error p-error block"
                    >
                      {`Error: ${panelCapitalized} ministry or organization is required.`}
                    </small>
                  )}
                </div>
                <div className="contact-form-field-container">
                  <label htmlFor={`${panelGroupName}-branch`} className="block">
                    {`${panelCapitalized} Branch`}
                  </label>
                  <InputText
                    id={`${panelGroupName}-branch`}
                    type="text"
                    aria-describedby={`${panelGroupName}-branch-help`}
                    className="form-field block"
                    placeholder={`${panelPlaceholder} branch`}
                    {...register(`branch`, {
                      required: props.extended,
                    })}
                  />
                  {errors.branch && (
                    <small
                      id={`${panelGroupName}-branch-help`}
                      className="validation-error p-error block"
                    >
                      {`Error: ${panelCapitalized} branch is required.`}
                    </small>
                  )}
                </div>
              </div>
            ) : null}
            {props.personalContact ? (
              <div className="contact-form-personalcontact-details">
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-personalphone`}
                    className="block"
                  >
                    {`${panelCapitalized} Personal Phone Number`}
                  </label>
                  <InputText
                    id={`${panelGroupName}-personalphone`}
                    type="text"
                    aria-describedby={`${panelGroupName}-personalphone-help`}
                    className="form-field block"
                    placeholder={`${panelPlaceholder} personal phone number`}
                    {...register(`personalphone`, {
                      required: props.personalContact,
                    })}
                  />
                  {errors.personalphone && (
                    <small
                      id={`${panelGroupName}-personalphone-help`}
                      className="validation-error p-error block"
                    >
                      {`Error: ${panelCapitalized} personal phone number is required.`}
                    </small>
                  )}
                </div>
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${panelGroupName}-personalemail`}
                    className="block"
                  >
                    {`${panelCapitalized} Personal Email Address`}
                  </label>
                  <InputText
                    id={`${panelGroupName}-personalemail`}
                    type="text"
                    aria-describedby={`${panelGroupName}-personalemail-help`}
                    className="form-field block"
                    placeholder={`${panelPlaceholder} personal email address`}
                    {...register(`personalemail`, {
                      required: props.personalContact,
                    })}
                  />
                  {errors.personalemail && (
                    <small
                      id={`${panelGroupName}-personalemail-help`}
                      className="validation-error p-error block"
                    >
                      {`Error: ${panelCapitalized} personal email address is required.`}
                    </small>
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
