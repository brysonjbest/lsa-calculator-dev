import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import "./BasicProfile.css";
import { useLocation, useNavigate } from "react-router";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function BasicProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state ? location.state : null;
  const pageIndex = 0;

  const defaultValues = {
    "personal-firstname": "",
    "personal-lastname": "",
    "personal-governmentemail": "",
    "personal-governmentphone": "",
    "personal-employeenumber": "",
    "personal-ministryorganization": null,
    "personal-branch": "",
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

  //to include try/catch api request block to save submitted data

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
      const ministryData = getValues("personal-ministryorganization");
      const newState = { ...stateData, ministryData };
      console.log(newState, "this is newstate");
      navigate("/register/milestone", { state: newState });
    } catch (error) {}
  };

  useEffect(() => {
    const stepsTemplate = formServices.get("selfregistrationsteps");
    const finalSteps = stepsTemplate.map(({ label, route }, index) => ({
      label: label,
      command: () => navigate(route),
      disabled: index >= pageIndex,
    }));
    //to update all steps setting with conditoinal LSA/not recipient
    setSteps(finalSteps);
  }, []);

  return (
    <>
      <div className="self-registration basic-profile">
        <PageHeader
          title="Registration"
          subtitle="Your Basic Profile Information"
        ></PageHeader>
        <FormSteps data={steps} stepIndex={pageIndex} category="Registration" />
        <FormProvider {...methods}>
          <form
            className="basic-details-form"
            // onSubmit={methods.handleSubmit(submitData)}
          >
            <AppPanel header="Profile Details">
              <ContactDetails
                basic
                extended
                panelName="personal"
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
