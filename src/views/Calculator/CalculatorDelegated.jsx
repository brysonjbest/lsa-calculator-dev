import React, { useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import AddressInput from "../../components/inputs/AddressInput";
import MilestoneSelector from "../../components/inputs/MilestoneSelector";
import InfoToolTip from "../../components/common/InfoToolTip";
import DataDisplay from "../../components/common/DataDisplay";
import "./CalculatorDelegated.css";

/**
 * Calculator Splash Page.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function CalculatorDelegated() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      employeeAdd: [{}],
    },
  });
  const [formComplete, setFormComplete] = useState(false);
  const [employees, setEmployees] = useState({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employeeAdd",
  });

  const onFormCompletion = () => {
    //add step to update in state what is displayed
    setFormComplete(true);
  };

  const onChange = (id, ministry) => {
    setEmployees({ ...employees, [id]: ministry });
  };

  return (
    <div className="calculator-splash">
      <PageHeader
        title="Long Service Awards and Service Pins Eligibility Calculator"
        singleLine
        gradient1
      ></PageHeader>
      <AppPanel header="Calculate Your Eligibility" toggleable collapsed>
        When calculating your eligibility, count the calendar years you’ve been
        in service, don’t worry about the exact months and days. If you have
        worked any portion of a calendar year, it counts as one full year of
        long service recognition time. This tool will help you check your total
        years of service. You can use this calculator to enter your work history
        and apply for your recognition awards in one easy process.
      </AppPanel>
      <AppPanel header="Eligible Service" toggleable collapsed>
        Register for the Long Service Awards if you’ve worked for 25+ years in a
        BC Public Service organization under the BC Public Service Act. Attend a
        Long Service Awards ceremony every five years after you’ve reached 25
        years of service. If you have fewer than 25 years of service, you may be
        eligible for a Service Pin. Long service recognition time is calculated
        differently than seniority and pensionable time. Long service time is
        your total, cumulative years working at an eligible BC Public Service
        organization. Time spent working as a contractor does not count towards
        years of service because contractors are not hired under the BC Public
        Service Act. If you’ve had a break in service, that time may still count
        toward your years of service. Breaks in service include periods of paid
        leave and part-time, auxiliary, or seasonal work. Unpaid leaves of
        absence do not count.
      </AppPanel>
      <AppPanel
        header="Delegated Calculations - Supervisors"
        toggleable
        collapsed
      >
        Supervisors may use this tool to calculate their employee’s eligibility
        for awards. This tool will allow you to enter your employees’
        information and register them for their recognition awards. Employees
        will be sent a link to their completed registration and must confirm the
        information entered and consent to receipt of recognition awards.
      </AppPanel>

      <AppPanel header="Delegated Registration - Instructions" toggleable>
        Supervisors: Enter your information in the contact field below. Add
        employees that you wish to calculate and submit registration requests
        for. For calculation of eligibilty, you only need to input YEARS – do
        not use months or days. Enter start dates in the “Start Date” Field and
        end dates in the “End Date Field”. Since service is cumulative, please
        add additional rows in order to account for any breaks in service. Enter
        each group of continuous years on separate lines. For example: If your
        employee has been working with no breaks in service since 2008, enter
        “2008” as the start year and the current calendar year as the end year.
        If your employee worked from 2008 to 2010, had a two year break in
        service and then resumed service in 2012, enter “2008” as the start year
        and “2010” as the end year. Then move to the next row and enter “2012”
        as the start year and current calendar year as the end year.
        Alternatively, if you know the total years of service, please enter in
        the final Total Years field for the employee. Employees entered in this
        form will receive confirmation emails with the link required to confirm
        their registration. Employees must confirm their registration in order
        to consent to receive a recognition award.
      </AppPanel>

      <AppPanel header="Supervisor Details">
        <ContactDetails basic panelName="supervisor" />
      </AppPanel>
      <AppPanel header="Supervisor Address">
        <AddressInput pobox addressIdentifier="Supervisor" />
      </AppPanel>

      <AppPanel
        header={
          <span>
            Add Employees
            <InfoToolTip
              target="p-panel-title"
              content="This section allows you to add employees that you wish to calculate and submit registration requests for. Please include all information and complete fields in full. "
            />
          </span>
        }
      >
        <div onSubmit={handleSubmit()} className="employee-add-panel">
          <ul>
            {fields.map((item, index) => {
              return (
                <li key={item.id}>
                  <AppPanel
                    header={
                      <div className="employee-header-bar">
                        <span className="employee-header-text">
                          Employee {index + 1}
                        </span>
                        {index !== 0 ? (
                          <AppButton
                            className="employee-add-delete-button"
                            passClass="p-button-raised p-button-rounded"
                            icon="pi pi-times-circle"
                            danger
                            onClick={() => {
                              remove(index);
                            }}
                          ></AppButton>
                        ) : null}
                      </div>
                    }
                  >
                    <ContactDetails
                      basic
                      delegated
                      ministryRef={onChange}
                      index={item.id}
                      panelName={`Employee ${index + 1}`}
                    />
                    <MilestoneSelector
                      delegated
                      ministry={employees[item.id]}
                      panelName={`Employee ${index + 1}`}
                    />
                  </AppPanel>
                </li>
              );
            })}
          </ul>
          <section>
            {/* <button
              type="button"
              onClick={() =>
                reset({
                  employeeAdd: [{}],
                })
              }
            >
              Reset Employees
            </button> */}
          </section>

          <input
            style={{ display: "none" }}
            type="submit"
            onClick={handleSubmit()}
          />
        </div>
        {/* <button
              type="button"
              onClick={() => {
                append({});
              }}
            >
              Add Row
            </button> */}
        <div className="employee-add-buttons">
          <AppButton
            info
            onClick={() => {
              append({});
            }}
          >
            Add Another Employee
          </AppButton>
          <AppButton onClick={() => onFormCompletion()}>
            {!formComplete ? "Finished? Check Submission" : "Update Submission"}
          </AppButton>
        </div>
      </AppPanel>
      <AppPanel
        header={
          <PageHeader
            title="Submit Registration"
            singleLine
            gradient3
          ></PageHeader>
        }
        fullwidth
      >
        <div>
          Based on the input in the calculator above, the following employees
          will receive registration confirmation emails for the CURRENT YEAR
          recognition period. If employees are eligible for previous years that
          they have not claimed, they will have the opportunity to update their
          registrations prior to submission. Please confirm that the information
          you have entered is correct prior to submission, and then proceed by
          clicking on “Submit”.
        </div>
        <DataDisplay category="delegated" />
        <AppButton>Submit</AppButton>
      </AppPanel>
    </div>
  );
}
