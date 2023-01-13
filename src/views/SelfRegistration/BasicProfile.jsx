import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import "./BasicProfile.css";
import { useLocation, useNavigate } from "react-router";
import { RegistrationContext } from "../../UserContext";

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
  const { registration, setRegistration } = useContext(RegistrationContext);

  const defaultFormValues = {
    "personal-firstname": "",
    "personal-lastname": "",
    "personal-governmentemail": "",
    "personal-governmentphone": "",
    "personal-employeenumber": "",
    "personal-ministryorganization": null,
    "personal-branch": "",
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });

  const {
    formState: { errors, isValid, isDirty },
    watch,
    getValues,
    handleSubmit,
    reset,
  } = methods;

  const [steps, setSteps] = useState([]);
  const [submissionData, setSubmissionData] = useState({});
  const [formComplete, setFormComplete] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  //extend isDirty status to monitor for change and warn about leaving without saving
  watch(() => setFormChanged(true));

  //to include try/catch api request block to save submitted data

  const saveData = (data) => {
    // e.preventDefault();
    // const finalData = { ...getValues() };
    // console.log("final Data before set submission", finalData);
    // setSubmissionData(finalData);
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    setSubmissionData(finalData);
    console.log(submissionData, "this is saved data");
    try {
      //submit to api - submits current registration to api and updates current registration context with return from api
      //then statement
      //activates next page if valid
      const ministryData = getValues("personal-ministryorganization");
      const newState = { ...stateData, ministryData };
      const registrationUpdate = { ...registrationData, ...finalData };
      console.log(
        registrationUpdate,
        "this update is checking spread operator"
      );
      setRegistration(registrationUpdate);
      console.log(newState, "this is newstate");
      setFormComplete(true);
      setFormChanged(false);
    } catch (error) {}
  };

  //Final step in creating submission - will be api call to backend to update

  const submitData = (e) => {
    e.preventDefault();
    // console.log(data);
    const finalData = { ...getValues() };
    console.log("final Data before set submission", finalData);

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
      console.log(registration, "this is registration, should be updated");
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

  useEffect(() => {
    reset(registration);
  }, [registration]);

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
              <AppButton secondary onClick={handleSubmit(saveData)}>
                Save
              </AppButton>
              <AppButton
                type="submit"
                onClick={(e) => submitData(e)}
                disabled={!isValid || (isDirty && !formComplete)}
              >
                Continue
              </AppButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
