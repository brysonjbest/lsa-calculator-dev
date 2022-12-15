import React, { useEffect, useRef, useState } from "react";
import AppButton from "../common/AppButton";
import ServiceCalculator from "./ServiceCalculator";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputMask } from "primereact/inputmask";
import { InputNumber } from "primereact/inputnumber";
import formServices from "../../services/settings.services";

import classNames from "classnames";
import "./MilestoneSelector.css";

/**
 * Address Input reusable component. Conditional PO Box requirement for address's identified for supervisors.
 * @param {object} props
 * @param {ref} props.submitReference reference for form submission to be handled by parent component
 * @param {boolean} props.selfregister state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.delegated state variable boolean for controlling if all fields are displayed
 * @param {string} props.ministry state describing what ministry has been selected for the user
 * @param {string} props.panelName string describing what panel these contact details belong to ex: Supervisor, Personal
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function MilestoneSelector(props) {
  const panelGroupName = props.panelName ? props.panelName : "default";
  const panelCapitalized =
    props.panelName === "personal"
      ? ""
      : props.panelName.charAt(0).toUpperCase() +
          props.panelName.slice(1).toLowerCase() || "defaultCapitalized";
  const panelPlaceholder =
    props.panelName === "personal"
      ? "your"
      : props.panelName.charAt(0).toUpperCase() +
          props.panelName.slice(1).toLowerCase() || "";

  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [availableMilestones, setAvailableMilestones] = useState({});
  const [priorMilestonesAvailable, setPriorMilestonesAvailable] = useState({});
  const [qualifyingYears, setQualifyingYears] = useState([]);
  const [milestoneSelected, setMilestoneSelected] = useState(false);

  const [calculatorButton, setCalculatorButton] = useState(false);
  const [calculatorDropdown, setCalculatorDropdown] = useState(false);
  const [ministry, setMinistry] = useState("");

  //state has to be in the main view being submitted. This has to be moved up to be managed on the individual views for form submission to function.
  const [formValues, setFormValues] = useState([
    { field: "yearsofservice", value: null },
    { field: "currentmilestone", value: "" },
    { field: "qualifyingyear", value: null },
    { field: "priormilestones", value: [] },
  ]);

  const defaultValues = {
    yearsofservice: null,
    currentmilestone: null,
    qualifyingyear: null,
    priormilestones: [],
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    resetField,
    getValues,
  } = useForm({ defaultValues });

  useEffect(() => {
    setAvailableMilestones(formServices.get("milestones") || []);
    setPriorMilestonesAvailable(formServices.get("milestones") || []);
    const date = new Date().getFullYear();
    const yearsDateRange = [];
    for (let i = 0; i < 4; i++) {
      yearsDateRange.push(date - i);
    }
    const yearsList = yearsDateRange.map((each) => ({
      value: each,
      text: each,
    }));
    setQualifyingYears(yearsList);
  }, []);

  useEffect(() => {
    setMinistry(props.ministry);
  }, [props.ministry]);

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

  const onYearsOfServiceChange = () => {
    resetField("currentmilestone");
    resetField("priormilestones");
    resetField("qualifyingyear");

    const milestones = formServices.get("milestones") || [];
    const filteredMilestones = milestones.filter(
      (milestone) => milestone["value"] <= getValues("yearsofservice")
    );
    const filteredPriorMilestones = milestones.filter(
      (milestone) => milestone["value"] < getValues("yearsofservice")
    );
    setAvailableMilestones(filteredMilestones);
    setPriorMilestonesAvailable(filteredPriorMilestones);
  };

  const onMilestoneSelection = (e) => {
    console.log(e.value, "this is testing event");
    e.value.length > 0 || e.value > 0
      ? setMilestoneSelected(true)
      : setMilestoneSelected(false);
  };

  const currentPinsOnlyOrgs =
    formServices.get("currentPinsOnlyOrganizations") || [];

  const ministryEligible = currentPinsOnlyOrgs.some(
    (org) => org["text"] === ministry
  )
    ? false
    : true;

  const toggleCalculator = () => {
    setCalculatorButton(!calculatorButton);
    setCalculatorDropdown(!calculatorDropdown);
  };

  const calculateTotal = (newValue) => {
    if (newValue !== 0) {
      setValue("yearsofservice", newValue);
      clearErrors("yearsofservice");
      onYearsOfServiceChange();
    }
  };

  return (
    <div className={`milestone-form-${panelGroupName}`}>
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`milestoneselector-${panelGroupName} milestone-form-details`}
          >
            <div className="milestone-form-field-container yearsofservice-block">
              <div className="milestone-form-yearsofservice-block">
                <label
                  htmlFor={`${panelGroupName}-yearsofservice`}
                  className={classNames("block", {
                    "p-error": errors.yearsofservice,
                  })}
                >
                  {`${panelCapitalized} Years of Service`}
                </label>
                <Controller
                  name="yearsofservice"
                  control={control}
                  rules={{ required: "Error: Years of Service is required." }}
                  render={({ field, fieldState }) => (
                    <InputNumber
                      inputId="withoutgrouping"
                      min={0}
                      max={99}
                      id={`${panelGroupName}-${field.name}`}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.value);
                        onYearsOfServiceChange();
                      }}
                      aria-describedby={`${panelGroupName}-yearsofservice-help`}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      placeholder={`Enter ${panelPlaceholder} years of service`}
                    />
                  )}
                />
                {getFormErrorMessage(
                  "yearsofservice",
                  `${panelGroupName}-yearsofservice-help`
                )}
              </div>
              <div className="calculator-button-toggle">
                <AppButton
                  danger={calculatorButton}
                  secondary={!calculatorButton}
                  onClick={toggleCalculator}
                >
                  {calculatorButton ? "Hide Calculator" : "Show Calculator"}
                </AppButton>
              </div>
            </div>
            {calculatorDropdown ? (
              <ServiceCalculator
                formSubmit={calculateTotal}
              ></ServiceCalculator>
            ) : null}
            <div className="milestone-form-field-container">
              <label
                htmlFor={`${panelGroupName}-currentmilestone`}
                className={classNames("block", {
                  "p-error": errors.currentmilestone,
                })}
              >
                {`${panelCapitalized} Current Milestone`}
              </label>
              <Controller
                name="currentmilestone"
                control={control}
                rules={{
                  required: {
                    value: !milestoneSelected,
                    message: "Error: Milestone selection is required.",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    disabled={!getValues("yearsofservice")}
                    id={`${panelGroupName}-${field.name}`}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value);
                      onMilestoneSelection(e);
                    }}
                    aria-describedby={`${panelGroupName}-currentmilestone-help`}
                    options={availableMilestones}
                    optionLabel="text"
                    className={classNames("form-field block", {
                      "p-invalid": fieldState.error,
                    })}
                    placeholder={`Select ${panelPlaceholder} current milestone.`}
                  />
                )}
              />
              {getFormErrorMessage(
                "currentmilestone",
                `${panelGroupName}-currentmilestone-help`
              )}
            </div>
            {getValues("currentmilestone") && props.selfregister ? (
              <div className="milestone-form-field-container">
                <label
                  htmlFor={`${panelGroupName}-qualifyingyear`}
                  className={classNames("block", {
                    "p-error": errors.qualifyingyear,
                  })}
                >
                  {`${panelCapitalized} Qualifying Year`}
                </label>
                <Controller
                  name="qualifyingyear"
                  control={control}
                  rules={{
                    required: {
                      value: getValues("currentmilestone"),
                      message: "Error: Qualifying Year is required.",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      disabled={!getValues("yearsofservice")}
                      id={`${panelGroupName}-${field.name}`}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      aria-describedby={`${panelGroupName}-qualifyingyear-help`}
                      options={qualifyingYears}
                      optionLabel="text"
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      placeholder={`During which year was this milestone reached.`}
                    />
                  )}
                />
                {getFormErrorMessage(
                  "qualifyingyear",
                  `${panelGroupName}-qualifyingyear-help`
                )}
              </div>
            ) : null}

            {ministryEligible ? (
              <div className="milestone-form-field-container">
                <label
                  htmlFor={`${panelGroupName}-priormilestones`}
                  className={classNames("block", {
                    "p-error": errors.priormilestones,
                  })}
                >
                  {`${panelCapitalized} Prior Unclaimed Milestone(s) Selected`}
                </label>
                <Controller
                  name="priormilestones"
                  control={control}
                  rules={{
                    required: {
                      value: !milestoneSelected,
                      message: "Error: Milestone selection is required.",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      disabled={!getValues("yearsofservice")}
                      id={`${panelGroupName}-${field.name}`}
                      display="chip"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.value);
                        onMilestoneSelection(e);
                      }}
                      aria-describedby={`${panelGroupName}-priormilestones-help`}
                      options={priorMilestonesAvailable}
                      optionLabel="text"
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      placeholder={`Select ${panelPlaceholder} prior milestones.`}
                    />
                  )}
                />
                {getFormErrorMessage(
                  "priormilestones",
                  `${panelGroupName}-priormilestones-help`
                )}
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
