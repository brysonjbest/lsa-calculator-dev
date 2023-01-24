import React, { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import AddressAutoComplete from "../../services/AddressAutoComplete";
import getFormErrorMessage from "../../services/helpers/ErrorMessage";
import { InputText } from "primereact/inputtext";
import classNames from "classnames";
import formServices from "../../services/settings.services";
import "./AddressInput.css";

/**
 * Address Input reusable component. Conditional PO Box requirement for address's identified for supervisors.
 * @param {object} props
 * @param {boolean} props.manualComplete state variable boolean for controlling if autocomplete is used
 * @param {boolean} props.pobox state variable boolean for controlling P.O. Box field required
 * @param {boolean} props.province state variable boolean for controlling province field required
 * @param {string} props.addressIdentifier string describing what field this address belongs to ex: Supervisor, Office, Personal
 * @returns
 */

export default function AddressInput({
  manualComplete,
  pobox,
  province,
  addressIdentifier,
  errors,
}) {
  const address = useRef();
  const methods = useFormContext();
  const [poBoxField, setPoBoxField] = useState(false);
  let autoCompleteBody = "";
  const addressAutoComplete = AddressAutoComplete();
  const addressGroupName = addressIdentifier
    ? formServices.capitalize(addressIdentifier)
    : "default";

  const { setFocus, setValue, getValues, control } = methods;

  const handleAddressSelect = async () => {
    let fullAddressObject = await addressAutoComplete.getAddressDetails(
      autoCompleteBody
    );
    address.current.value = fullAddressObject.streetAddress;
    setValue(
      `${addressIdentifier}streetaddress`,
      fullAddressObject.streetAddress
    );
    setValue(
      `${addressIdentifier}citycommunity`,
      fullAddressObject.cityCommunity
    );
    province &&
      setValue(
        `${addressIdentifier}provincestate`,
        fullAddressObject.provinceStateLong
      );
    setPoBoxField(
      getValues(`${addressIdentifier}citycommunity`).match(/Victoria/i)
    );
    setValue(`${addressIdentifier}country`, fullAddressObject.countryLong);
    setValue(`${addressIdentifier}postalcode`, fullAddressObject.postalCode);
    setFocus(`${addressIdentifier}streetaddress2`);
  };

  useEffect(() => {
    if (!manualComplete) {
      async function googlePlacesAutocomplete() {
        autoCompleteBody = await addressAutoComplete.initializeAutoComplete(
          address.current,
          handleAddressSelect
        );
      }
      googlePlacesAutocomplete();
    }
  }, []);

  useEffect(() => {
    getValues(`${addressIdentifier}citycommunity`)
      ? setPoBoxField(
          getValues(`${addressIdentifier}citycommunity`).match(/Victoria/i)
        )
      : null;
  }, [addressIdentifier]);

  return (
    <div className="container">
      <div className="address-container">
        <div className="address-form-field-container">
          <label
            htmlFor={`${addressIdentifier}streetaddress`}
            className="block"
          >
            {`${addressGroupName} Street Address 1`}
          </label>
          <Controller
            name={`${addressIdentifier}streetaddress`}
            control={control}
            rules={{ required: "Error: Street address is required." }}
            render={({ field: { ref, ...field }, fieldState }) => (
              <InputText
                id={`${field.name}`}
                ref={address}
                aria-describedby={`${addressIdentifier}-streetaddress-help`}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="123 W Street Rd"
              />
            )}
          />
          {getFormErrorMessage(
            `${addressIdentifier}streetaddress`,
            `${addressIdentifier}-streetaddress-help`,
            errors
          )}
        </div>
        <div className="address-form-field-container">
          <label
            htmlFor={`${addressIdentifier}streetaddress2`}
            className="block"
          >
            {`${addressGroupName} Street Address 2`}
          </label>
          <Controller
            name={`${addressIdentifier}streetaddress2`}
            control={control}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${addressIdentifier}-streetaddress2-help`}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="Suite 123"
              />
            )}
          />
          {getFormErrorMessage(
            `${addressIdentifier}streetaddress2`,
            `${addressIdentifier}-streetaddress2-help`,
            errors
          )}
        </div>
        <div className="address-form-field-container">
          <label
            htmlFor={`${addressIdentifier}citycommunity`}
            className="block"
          >
            {`${addressGroupName} City/Community`}
          </label>
          <Controller
            name={`${addressIdentifier}citycommunity`}
            control={control}
            rules={{ required: "Error: City/Community is required." }}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${addressIdentifier}-citycommunity-help`}
                onBlurCapture={() => {
                  setPoBoxField(
                    getValues(`${addressIdentifier}citycommunity`).match(
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
            `${addressIdentifier}citycommunity`,
            `${addressIdentifier}-citycommunity-help`,
            errors
          )}
        </div>
        {province ? (
          <div className="address-form-field-container">
            <label
              htmlFor={`${addressIdentifier}provincestate`}
              className="block"
            >
              {`${addressGroupName} Province/State`}
            </label>
            <Controller
              name={`${addressIdentifier}provincestate`}
              control={control}
              rules={{ required: "Error: Province/State is required." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={`${field.name}`}
                  aria-describedby={`${addressIdentifier}-provincestate-help`}
                  {...field}
                  className={classNames("form-field block", {
                    "p-invalid": fieldState.error,
                  })}
                  placeholder="BC"
                />
              )}
            />
            {getFormErrorMessage(
              `${addressIdentifier}provincestate`,
              `${addressIdentifier}-provincestate-help`,
              errors
            )}
          </div>
        ) : null}
        <div className="address-form-field-container">
          <label htmlFor={`${addressIdentifier}postalcode`} className="block">
            {`${addressGroupName} Postal Code`}
          </label>
          <Controller
            name={`${addressIdentifier}postalcode`}
            control={control}
            rules={{ required: "Error: Postal Code is required." }}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${addressIdentifier}-postalcode-help`}
                {...field}
                className={classNames("form-field block", "short-form-field", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="A0A 0A0"
              />
            )}
          />
          {getFormErrorMessage(
            `${addressIdentifier}postalcode`,
            `${addressIdentifier}-postalcode-help`,
            errors
          )}
        </div>
      </div>

      {pobox && addressIdentifier.match(/supervisor/i) ? (
        <div className="address-form-field-container">
          <label htmlFor={`${addressIdentifier}pobox`} className="block">
            {`${addressGroupName} P.O. Box`}
          </label>
          <Controller
            name={`${addressIdentifier}pobox`}
            control={control}
            rules={{
              required: poBoxField,
            }}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${addressIdentifier}-pobox-help`}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder={`${addressGroupName} P.O. Box number`}
              />
            )}
          />
          {getFormErrorMessage(
            `${addressIdentifier}pobox`,
            `${addressIdentifier}-pobox-help`,
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
