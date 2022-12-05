import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AddressAutoComplete from "../../services/AddressAutoComplete";
import { InputText } from "primereact/inputtext";
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
  const [poBoxField, setPoBoxField] = useState();
  let autoCompleteBody = "";
  const addressAutoComplete = AddressAutoComplete();
  const addressGroupName = props.addressIdentifier
    ? props.addressIdentifier
    : "default";

  const {
    handleSubmit,
    register,
    setFocus,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({});

  const handleAddressSelect = async () => {
    let fullAddressObject = await addressAutoComplete.getAddressDetails(
      autoCompleteBody
    );
    address.current.value = fullAddressObject.streetAddress;
    setValue("streetaddress", fullAddressObject.streetAddress);
    setValue("citycommunity", fullAddressObject.cityCommunity);
    props.province &&
      setValue("provincestate", fullAddressObject.provinceStateLong);
    setPoBoxField(getValues("citycommunity").match(/Victoria/i));
    setValue("country", fullAddressObject.countryLong);
    setValue("postalcode", fullAddressObject.postalCode);
    setFocus("streetaddress2");
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="address-container">
          <div className="address-form-field-container">
            <label
              htmlFor={`streetaddress-${addressGroupName}`}
              className="block"
            >
              {`${addressGroupName} Street Address 1`}
            </label>
            <InputText
              id={`streetaddress-${addressGroupName}`}
              type="text"
              aria-describedby={`streetaddress-${addressGroupName}-help`}
              className="form-field block"
              placeholder="123 W Street Rd"
              {...register("streetaddress", { required: true })}
              ref={address}
            />
            {errors.streetaddress && (
              <small
                id={`streetaddress-${addressGroupName}-help`}
                className="validation-error p-error block"
              >
                Error: Street address is required.
              </small>
            )}
          </div>
          <div className="address-form-field-container">
            <label
              htmlFor={`streetaddress2-${addressGroupName}`}
              className="block"
            >
              {`${addressGroupName} Street Address 2`}
            </label>
            <InputText
              id={`streetaddress2-${addressGroupName}`}
              type="text"
              className="form-field"
              placeholder="Suite 123"
              {...register("streetaddress2")}
            />
          </div>
          <div className="address-form-field-container">
            <label
              htmlFor={`city-community-${addressGroupName}`}
              className="block"
            >
              {`${addressGroupName} City/Community`}
            </label>
            <InputText
              id={`city-community-${addressGroupName}`}
              aria-describedby={`city-community-${addressGroupName}-help`}
              type="text"
              className="form-field"
              placeholder="Victoria"
              {...register("citycommunity", {
                required: true,
                onChange: () => {
                  setPoBoxField(getValues("citycommunity").match(/Victoria/i));
                },
              })}
            />
            {errors.citycommunity && (
              <small
                id={`city-community-${addressGroupName}-help`}
                className="validation-error p-error block"
              >
                Error: City or Community is required.
              </small>
            )}
          </div>
          {props.province ? (
            <div className="address-form-field-container">
              <label
                htmlFor={`province-state-${addressGroupName}`}
                className="block"
              >
                {`${addressGroupName} Province/State`}
              </label>
              <InputText
                id={`province-state-${addressGroupName}`}
                type="text"
                aria-describedby={`province-state-${addressGroupName}-help`}
                className="form-field"
                placeholder="BC"
                {...register("provincestate", { required: props.province })}
              />
              {errors.provincestate && (
                <small
                  id={`province-state-${addressGroupName}-help`}
                  className="validation-error p-error block"
                >
                  Error: Province or State is required.
                </small>
              )}
            </div>
          ) : null}
          <div className="address-form-field-container">
            <label htmlFor={`postalcode-${addressGroupName}`} className="block">
              {`${addressGroupName} Postal Code`}
            </label>
            <InputText
              id={`postalcode-${addressGroupName}`}
              type="text"
              aria-describedby={`postalcode-${addressGroupName}-help`}
              className="short-form-field"
              placeholder="A0A 0A0"
              {...register("postalcode", { required: true })}
            />
            {errors.postalcode && (
              <small
                id={`postalcode-${addressGroupName}-help`}
                className="validation-error p-error block"
              >
                Error: Postal code is required.
              </small>
            )}
          </div>
        </div>

        {props.pobox && props.addressIdentifier.match(/Supervisor/i) ? (
          <div className="address-form-field-container">
            <label htmlFor={`pobox-${addressGroupName}`} className="block">
              {`${addressGroupName} P.O. Box`}
            </label>
            <InputText
              id={`pobox-${addressGroupName}`}
              type="text"
              aria-describedby={`pobox-${addressGroupName}-help`}
              className="form-field block"
              placeholder={`${addressGroupName} P.O. Box number`}
              {...register("pobox", {
                required: poBoxField,
              })}
            />
            {errors.pobox && (
              <small
                id={`pobox-${addressGroupName}-help`}
                className="validation-error p-error block"
              >
                Error: P.O. Box is required for Victoria addresses. Please use
                the BC Government{" "}
                <a target="_blank" href="https://govposearch.pss.gov.bc.ca/">
                  P.O. Box Lookup tool
                </a>{" "}
                to find the appropriate P.O. Box number:
              </small>
            )}
          </div>
        ) : null}

        <button
          ref={props.submitReference}
          type="submit"
          style={{ display: "none" }}
        />
      </form>
    </div>
  );
}
