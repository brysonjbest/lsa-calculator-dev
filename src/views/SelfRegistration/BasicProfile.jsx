import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
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
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import SubmittedInfo from "../../components/composites/SubmittedInfo";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function BasicProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const stateData = location.state ? location.state : null;
  const pageIndex = 0;
  const { registration, setRegistration } = useContext(RegistrationContext);
  const isLSAEligible = registration["personal-yearsofservice"] >= 25;

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
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    setSubmissionData(finalData);
    console.log(submissionData, "this is saved data");
    try {
      toast.current.show(formServices.lookup("messages", "save"));
      setLoading(true);
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
      //this would change to api dependent
      setTimeout(() => {
        toast.current.replace(formServices.lookup("messages", "savesuccess"));
        setLoading(false);
      }, 3000);
    } catch (error) {
      toast.current.replace(formServices.lookup("messages", "saveerror"));
    } finally {
      //update when using real api call to set here vs in try
      // setLoading(false);
    }
  };

  const submitData = (e) => {
    e.preventDefault();
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
    const stepsTemplate = isLSAEligible
      ? formServices.get("selfregistrationsteps")
      : formServices.get("pinOnlyselfregistrationsteps");
    const finalSteps = stepsTemplate.map(({ label, route }, index) => ({
      label: label,
      command: () => navigate(route),
      disabled: index >= pageIndex,
    }));
    setSteps(finalSteps);
  }, []);

  useEffect(() => {
    reset(registration);
  }, [registration]);

  const [submitted, setSubmitted] = useState(registration["submitted"]);
  if (submitted) {
    return (
      <>
        <SubmittedInfo
          title="Profile Details"
          subtitle="Your Basic Profile Information"
        />
      </>
    );
  }

  return (
    <>
      <Toast ref={toast} />
      {loading ? (
        <div className="loading-modal">
          <ProgressSpinner />
        </div>
      ) : null}
      <div className="self-registration basic-profile">
        <PageHeader
          title="Registration"
          subtitle="Your Basic Profile Information"
        ></PageHeader>
        <FormSteps data={steps} stepIndex={pageIndex} category="Registration" />
        <FormProvider {...methods}>
          <form className="basic-details-form">
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
