import React, { useEffect, useRef, useState } from "react";
import { useForm, useFormContext, Controller } from "react-hook-form";
import AddressAutoComplete from "../../services/AddressAutoComplete";
import getFormErrorMessage from "../../services/helpers/ErrorMessage";
import { InputText } from "primereact/inputtext";
import classNames from "classnames";
import "./AddressInput.css";

/**
 * Address Input reusable component. Conditional PO Box requirement for address's identified for supervisors.
 * @param {object} props
 * @param {ref} props.submitReference reference for form submission to be handled by parent component
 * @param {boolean} props.manualComplete state variable boolean for controlling if autocomplete is used
 * @param {boolean} props.pobox state variable boolean for controlling P.O. Box field required
 * @param {boolean} props.province state variable boolean for controlling province field required
 * @param {string} props.addressIdentifier string describing what field this address belongs to ex: Supervisor, Office, Personal
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function AddressInput(props) {
  const address = useRef();
  const methods = useFormContext();
  const [poBoxField, setPoBoxField] = useState();
  let autoCompleteBody = "";
  const addressAutoComplete = AddressAutoComplete();
  const addressGroupName = props.addressIdentifier
    ? props.addressIdentifier.charAt(0).toUpperCase() +
      props.addressIdentifier.slice(1).toLowerCase()
    : "default";

  const { handleSubmit, register, setFocus, setValue, getValues, control } =
    methods;

  const errors = props.errors;

  const handleAddressSelect = async () => {
    let fullAddressObject = await addressAutoComplete.getAddressDetails(
      autoCompleteBody
    );
    address.current.value = fullAddressObject.streetAddress;
    setValue(
      `${props.addressIdentifier}streetaddress`,
      fullAddressObject.streetAddress
    );
    setValue(
      `${props.addressIdentifier}citycommunity`,
      fullAddressObject.cityCommunity
    );
    props.province &&
      setValue(
        `${props.addressIdentifier}provincestate`,
        fullAddressObject.provinceStateLong
      );
    setPoBoxField(
      getValues(`${props.addressIdentifier}citycommunity`).match(/Victoria/i)
    );
    setValue(
      `${props.addressIdentifier}country`,
      fullAddressObject.countryLong
    );
    setValue(
      `${props.addressIdentifier}postalcode`,
      fullAddressObject.postalCode
    );
    setFocus(`${props.addressIdentifier}streetaddress2`);
  };

  const onSubmit = () => {
    console.log("Success!");
  };

  useEffect(() => {
    if (!props.manualComplete) {
      async function googlePlacesAutocomplete() {
        autoCompleteBody = await addressAutoComplete.initializeAutoComplete(
          address.current,
          handleAddressSelect
        );
      }
      document
        .getElementById("google-map-script")
        .addEventListener("load", () => {
          googlePlacesAutocomplete();
        });
    }
  }, []);

  return (
    <div className="container">
      <div className="address-container">
        <div className="address-form-field-container">
          <label
            htmlFor={`${props.addressIdentifier}streetaddress`}
            className="block"
          >
            {`${addressGroupName} Street Address 1`}
          </label>
          <Controller
            name={`${props.addressIdentifier}streetaddress`}
            control={control}
            rules={{ required: "Error: Street address is required." }}
            render={({ field: { ref, ...field }, fieldState }) => (
              <InputText
                id={`${field.name}`}
                ref={address}
                aria-describedby={`${props.addressIdentifier}-streetaddress-help`}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="123 W Street Rd"
              />
            )}
          />
          {getFormErrorMessage(
            `${props.addressIdentifier}streetaddress`,
            `${props.addressIdentifier}-streetaddress-help`,
            errors
          )}
        </div>
        <div className="address-form-field-container">
          <label
            htmlFor={`${addressGroupName}streetaddress2`}
            className="block"
          >
            {`${addressGroupName} Street Address 2`}
          </label>
          <Controller
            name={`${props.addressIdentifier}streetaddress2`}
            control={control}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${props.addressIdentifier}-streetaddress2-help`}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="Suite 123"
              />
            )}
          />
          {getFormErrorMessage(
            `${props.addressIdentifier}streetaddress2`,
            `${props.addressIdentifier}-streetaddress2-help`,
            errors
          )}
        </div>
        <div className="address-form-field-container">
          <label htmlFor={`${addressGroupName}citycommunity`} className="block">
            {`${addressGroupName} City/Community`}
          </label>
          <Controller
            name={`${props.addressIdentifier}citycommunity`}
            control={control}
            rules={{ required: "Error: City/Community is required." }}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${props.addressIdentifier}-citycommunity-help`}
                onBlurCapture={() => {
                  setPoBoxField(
                    getValues(`${props.addressIdentifier}citycommunity`).match(
                      /Victoria/i
                    )
                  );
                }}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="Victoria"
              />
            )}
          />
          {getFormErrorMessage(
            `${props.addressIdentifier}citycommunity`,
            `${props.addressIdentifier}-citycommunity-help`,
            errors
          )}
        </div>
        {props.province ? (
          <div className="address-form-field-container">
            <label
              htmlFor={`${addressGroupName}provincestate`}
              className="block"
            >
              {`${addressGroupName} Province/State`}
            </label>
            <Controller
              name={`${props.addressIdentifier}provincestate`}
              control={control}
              rules={{ required: "Error: Province/State is required." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={`${field.name}`}
                  aria-describedby={`${props.addressIdentifier}-provincestate-help`}
                  {...field}
                  className={classNames("form-field block", {
                    "p-invalid": fieldState.error,
                  })}
                  placeholder="BC"
                />
              )}
            />
            {getFormErrorMessage(
              `${props.addressIdentifier}provincestate`,
              `${props.addressIdentifier}-provincestate-help`,
              errors
            )}
          </div>
        ) : null}
        <div className="address-form-field-container">
          <label htmlFor={`${addressGroupName}postalcode`} className="block">
            {`${addressGroupName} Postal Code`}
          </label>
          <Controller
            name={`${props.addressIdentifier}postalcode`}
            control={control}
            rules={{ required: "Error: Postal Code is required." }}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${props.addressIdentifier}-postalcode-help`}
                {...field}
                className={classNames("form-field block", "short-form-field", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="A0A 0A0"
              />
            )}
          />
          {getFormErrorMessage(
            `${props.addressIdentifier}postalcode`,
            `${props.addressIdentifier}-postalcode-help`,
            errors
          )}
        </div>
      </div>

      {props.pobox && props.addressIdentifier.match(/supervisor/i) ? (
        <div className="address-form-field-container">
          <label htmlFor={`${addressGroupName}pobox`} className="block">
            {`${addressGroupName} P.O. Box`}
          </label>
          <Controller
            name={`${props.addressIdentifier}pobox`}
            control={control}
            rules={{
              required: poBoxField,
            }}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${props.addressIdentifier}-pobox-help`}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder={`${addressGroupName} P.O. Box number`}
              />
            )}
          />
          {getFormErrorMessage(
            `${props.addressIdentifier}pobox`,
            `${props.addressIdentifier}-pobox-help`,
            errors
          ) ? (
            <small
              id={`pobox-${addressGroupName}-help`}
              className="validation-error p-error block"
            >
              P.O. Box is required for Victoria addresses. Please use the BC
              Government{" "}
              <a target="_blank" href="https://govposearch.pss.gov.bc.ca/">
                P.O. Box Lookup tool
              </a>{" "}
              to find the appropriate P.O. Box number.
            </small>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
