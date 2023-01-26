import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import InfoToolTip from "../../components/common/InfoToolTip";
import DataDisplay from "../../components/common/DataDisplay";
import EmployeeList from "../../components/composites/EmployeeList";
import ContactDetails from "../../components/inputs/ContactDetails";
import AddressInput from "../../components/inputs/AddressInput";
import "./CalculatorDelegated.css";

/**
 * Delegated Calculator Page. Allows users to submit delegated applications for LSA/Service Pin registration.
 */

export default function CalculatorDelegated() {
  const defaultValues = {
    "supervisor-firstname": "",
    "supervisor-lastname": "",
    "supervisor-governmentemail": "",
    supervisorstreetaddress: "",
    supervisorstreetaddress2: "",
    supervisorcitycommunity: "",
    supervisorpostalcode: "",
    supervisorpobox: "",
    employee: [
      {
        firstname: "",
        lastname: "",
        governmentemail: "",
        employeenumber: "",
        ministryorganization: null,
        yearsofservice: "",
        currentmilestone: "",
        qualifyingyear: "",
        priormilestones: "",
      },
    ],
  };

  const methods = useForm({ defaultValues });
  const [employeeData, setEmployeeData] = useState([]);
  const [submissionData, setSubmissionData] = useState({});
  const [formComplete, setFormComplete] = useState(false);
  const [formChanged, setFormChanged] = useState(true);

  const {
    formState: { errors },
    watch,
    handleSubmit,
  } = methods;

  watch(() => setFormChanged(true));

  const onSubmit = (data) => {
    setFormComplete(true);
    setFormChanged(false);
    const finalData = Object.assign({}, data);
    setSubmissionData(finalData);

    const employeeData = [...data.employee];
    employeeData.map((each, index) => {
      each["employee"] = each["firstname"] ? `${index + 1}` : "";
    });
    setEmployeeData(employeeData);
  };

  //Final step in creating submission - will be api call to backend to update

  const submitDelegated = (e) => {
    e.preventDefault();
    console.log(submissionData, "this is final submission data");
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AppPanel header="Supervisor Details">
            <ContactDetails basic panelName="supervisor" errors={errors} />
          </AppPanel>
          <AppPanel header="Supervisor Address">
            <AddressInput
              pobox
              addressIdentifier="supervisor"
              errors={errors}
            />
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
            <div className="employee-add-panel">
              <EmployeeList errors={errors} />
            </div>
            <div className="employee-add-buttons">
              <AppButton type="submit" onClick={handleSubmit(onSubmit)}>
                {!formComplete
                  ? "Finished? Check Submission."
                  : "Recheck data if updated."}
              </AppButton>
            </div>
          </AppPanel>
        </form>
      </FormProvider>
      {employeeData.length > 0 ? (
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
            recognition period. If employees are eligible for previous years
            that they have not claimed, they will have the opportunity to update
            their registrations prior to submission. Please confirm that the
            information you have entered is correct prior to submission, and
            then proceed by clicking on “Submit”.
          </div>

          <DataDisplay
            category="delegated"
            data={submissionData}
            identifier="employee"
          />
          <AppButton disabled={formChanged} onClick={(e) => submitDelegated(e)}>
            {!formChanged
              ? "Submit"
              : "Data has been updated, please resubmit above to check input."}
          </AppButton>
        </AppPanel>
      ) : null}
    </>
  );
}
