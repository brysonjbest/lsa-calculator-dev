import React, { useEffect, useState } from "react";
import AppButton from "../common/AppButton";
import ServiceCalculator from "./ServiceCalculator";
import { Controller, useFormContext } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import formServices from "../../services/settings.services";
import getFormErrorMessage from "../../services/helpers/ErrorMessage";

import classNames from "classnames";
import "./MilestoneSelector.css";

/**
 * Milestones reusable component.
 * @param {object} props
 * @param {boolean} props.selfregister state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.delegated state variable boolean for controlling if all fields are displayed
 * @param {string} props.ministry state describing what ministry has been selected for the user
 * @param {string} props.panelName string describing what panel these contact details belong to ex: Supervisor, Personal
 * @param {integer} props.index index of item within form
 * @returns
 */

export default function MilestoneSelector({
  panelName,
  itemNumber,
  errors,
  ministry,
  selfregister,
}) {
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
      ? "your"
      : formServices.capitalize(panelName) || "";

  const itemName = itemNumber
    ? `${panelName}.${itemNumber - 1}.`
    : `${panelGroupName}-`;

  const milestones = formServices.get("milestones") || [];

  //Get eligible years
  const date = new Date().getFullYear();
  const yearsDateRange = [];
  for (let i = 0; i < 4; i++) {
    yearsDateRange.push(date - i);
  }
  const yearsList = yearsDateRange.map((each) => ({
    value: each,
    text: each,
  }));

  const [availableMilestones, setAvailableMilestones] = useState(milestones);
  const [priorMilestonesAvailable, setPriorMilestonesAvailable] =
    useState(milestones);
  const [qualifyingYears, setQualifyingYears] = useState(yearsList);
  const [milestoneSelected, setMilestoneSelected] = useState(false);

  const [calculatorButton, setCalculatorButton] = useState(false);
  const [calculatorDropdown, setCalculatorDropdown] = useState(false);
  const [ministryCalc, setMinistryCalc] = useState("");

  const { control, setValue, clearErrors, resetField, getValues, watch } =
    useFormContext();

  useEffect(() => {
    setMinistryCalc(ministry);
  }, [ministry]);

  //Monitor years of service change and update fields any time anything new is entered

  const onYearsOfServiceChange = () => {
    resetField(`${itemName}currentmilestone`, { defaultValue: null });
    resetField(`${itemName}priormilestones`, { defaultValue: [] });
    resetField(`${itemName}qualifyingyear`, { defaultValue: "" });

    const milestones = formServices.get("milestones") || [];
    const filteredMilestones = milestones.filter(
      (milestone) =>
        milestone["value"] <= getValues(`${itemName}yearsofservice`)
    );
    const filteredPriorMilestones = milestones.filter(
      (milestone) => milestone["value"] < getValues(`${itemName}yearsofservice`)
    );
    setAvailableMilestones(filteredMilestones);
    setPriorMilestonesAvailable(filteredPriorMilestones);
  };

  const watchYearsOfService = watch(`${itemName}yearsofservice`);

  useEffect(() => {
    onYearsOfServiceChange();
  }, [watchYearsOfService]);

  const onMilestoneSelection = (e) => {
    e.value.length > 0 || e.value > 0
      ? setMilestoneSelected(true)
      : setMilestoneSelected(false);
  };

  const currentPinsOnlyOrgs =
    formServices.get("currentPinsOnlyOrganizations") || [];

  const ministryEligible = currentPinsOnlyOrgs.some(
    (org) => org["text"] === ministryCalc
  )
    ? false
    : true;

  const toggleCalculator = (e) => {
    e.preventDefault();
    setCalculatorButton(!calculatorButton);
    setCalculatorDropdown(!calculatorDropdown);
  };

  const calculateTotal = (newValue) => {
    if (newValue !== 0) {
      setValue(`${itemName}yearsofservice`, newValue);
      clearErrors(`${itemName}yearsofservice`);
    }
  };

  return (
    <div className={`milestone-form-${panelGroupName}`}>
      <div className="container">
        <div
          className={`milestoneselector-${panelGroupName} milestone-form-details`}
        >
          <div className="milestone-form-field-container yearsofservice-block">
            <div className="milestone-form-yearsofservice-block">
              <label
                htmlFor={`${itemName}yearsofservice`}
                className={classNames("block", {
                  "p-error": errors.yearsofservice,
                })}
              >
                {`${panelTitle} Years of Service`}
              </label>
              <Controller
                name={`${itemName}yearsofservice`}
                control={control}
                rules={{ required: "Error: Years of Service is required." }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    inputId="withoutgrouping"
                    min={0}
                    max={99}
                    id={`${field.name}`}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value);
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
                `${panelGroupName}-yearsofservice`,
                errors,
                panelName,
                itemNumber - 1,
                "yearsofservice"
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
            <ServiceCalculator formSubmit={calculateTotal}></ServiceCalculator>
          ) : null}
          <div className="milestone-form-field-container">
            <label
              htmlFor={`${itemName}currentmilestone`}
              className={classNames("block", {
                "p-error": errors.currentmilestone,
              })}
            >
              {`${panelTitle} Current Milestone`}
            </label>
            <Controller
              name={`${itemName}currentmilestone`}
              control={control}
              rules={{
                required: {
                  value: !milestoneSelected,
                  message: "Error: Milestone selection is required.",
                },
              }}
              render={({ field, fieldState }) => (
                <Dropdown
                  disabled={!getValues(`${itemName}yearsofservice`)}
                  id={`${field.name}`}
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
              `${panelGroupName}-currentmilestone`,
              errors,
              panelName,
              itemNumber - 1,
              "currentmilestone"
            )}
          </div>
          {getValues(`${itemName}currentmilestone`) && selfregister ? (
            <div className="milestone-form-field-container">
              <label
                htmlFor={`${itemName}qualifyingyear`}
                className={classNames("block", {
                  "p-error": errors.qualifyingyear,
                })}
              >
                {`${panelTitle} Qualifying Year`}
              </label>
              <Controller
                name={`${itemName}qualifyingyear`}
                control={control}
                rules={{
                  required: {
                    value: getValues(`${itemName}currentmilestone`),
                    message: "Error: Qualifying Year is required.",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    disabled={!getValues(`${itemName}yearsofservice`)}
                    id={`${field.name}`}
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
                `${panelGroupName}-qualifyingyear`,
                errors,
                panelName,
                itemNumber - 1,
                "qualifyingyear"
              )}
            </div>
          ) : null}

          {ministryEligible ? (
            <div className="milestone-form-field-container">
              <label
                htmlFor={`${itemName}priormilestones`}
                className={classNames("block", {
                  "p-error": errors.priormilestones,
                })}
              >
                {`${panelTitle} Prior Unclaimed Milestone(s) Selected`}
              </label>
              <Controller
                name={`${itemName}priormilestones`}
                control={control}
                render={({ field, fieldState }) => (
                  <MultiSelect
                    disabled={!getValues(`${itemName}yearsofservice`)}
                    id={`${field.name}`}
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
                `${panelGroupName}-priormilestones`,
                errors,
                panelName,
                itemNumber - 1,
                "priormilestones"
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
