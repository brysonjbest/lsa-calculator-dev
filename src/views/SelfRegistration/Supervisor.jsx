import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import AddressInput from "../../components/inputs/AddressInput";
import { useNavigate } from "react-router";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function Supervisor() {
  const navigate = useNavigate();
  const pageIndex = 4;
  const defaultValues = {
    "supervisor-firstname": "",
    "supervisor-lastname": "",
    "supervisor-governmentemail": "",
    supervisorstreetaddress: "",
    supervisorstreetaddress2: "",
    supervisorcitycommunity: "",
    supervisorpostalcode: "",
    supervisorpobox: "",
  };

  const methods = useForm({ defaultValues });
  const [steps, setSteps] = useState([]);
  const [submissionData, setSubmissionData] = useState({});
  const [formComplete, setFormComplete] = useState(false);
  const [formChanged, setFormChanged] = useState(true);

  const {
    formState: { errors, isValid, isDirty },
    watch,
    getValues,
    handleSubmit,
  } = methods;

  //extend isDirty status to monitor for change and warn about leaving without saving
  watch(() => setFormChanged(true));

  const saveData = (e) => {
    e.preventDefault();
    const finalData = { ...getValues() };
    console.log("final Data before set submission", finalData);
    setSubmissionData(finalData);
    console.log(submissionData, "this is saved data");
  };

  //Final step in creating submission - will be api call to backend to update

  const submitData = (data) => {
    console.log(data);
    const finalData = Object.assign({}, data);
    setSubmissionData(finalData);
    console.log(submissionData, "this is final submission data");
    try {
      //submit to api
      //then statement
      //navigate to next page on success
      navigate("/register/confirmation");
    } catch (error) {}
  };

  useEffect(() => {
    const stepsTemplate = formServices.get("selfregistrationsteps");
    const finalSteps = stepsTemplate.map(({ label, route }, index) => ({
      label: label,
      command: () => navigate(route),
      disabled: index >= pageIndex,
    }));
    //to update all steps setting with conditional LSA/not recipient
    setSteps(finalSteps);
  }, []);

  return (
    <>
      <div className="self-registration supervisor-profile">
        <PageHeader
          title="Registration"
          subtitle="Your Supervisor Information"
        ></PageHeader>
        <FormSteps data={steps} stepIndex={pageIndex} category="Registration" />
        <FormProvider {...methods}>
          <form className="supervisor-details-form">
            <AppPanel header="Supervisor Details">
              <ContactDetails basic panelName="supervisor" errors={errors} />
            </AppPanel>
            <AppPanel header="Supervisor Office Address">
              <AddressInput
                pobox
                addressIdentifier="supervisor"
                errors={errors}
              />
            </AppPanel>
            <div className="submission-buttons">
              <AppButton secondary onClick={(e) => saveData(e)}>
                Save
              </AppButton>
              <AppButton
                type="submit"
                onClick={handleSubmit(submitData)}
                // disabled={!isValid}
              >
                Confirm/Submit
              </AppButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
