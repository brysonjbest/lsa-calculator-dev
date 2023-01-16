import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import MilestoneSelector from "../../components/inputs/MilestoneSelector";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import { useNavigate, useLocation } from "react-router";
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

export default function MilestoneSelection() {
  const navigate = useNavigate();
  const pageIndex = 1;
  const location = useLocation();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const { registration, setRegistration } = useContext(RegistrationContext);
  const isLSAEligible = registration["personal-yearsofservice"] >= 25;

  // console.log(location.state);
  const yearsData = location.state ? location.state["qualifyingYears"] : "";
  const ministryInherited = location.state
    ? location.state["ministryData"]
    : null;

  const ministryRegistration =
    registration && registration["personal-ministryorganization"]
      ? registration["personal-ministryorganization"]
      : null;

  const defaultFormValues = {
    "personal-yearsofservice": "",
    "personal-currentmilestone": null,
    "personal-qualifyingyear": "",
    "personal-priormilestones": [],
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      console.log(defaultSetting, "this is default settings");
      return defaultSetting;
    }, [registration]),
  });

  const [steps, setSteps] = useState([]);
  const [submissionData, setSubmissionData] = useState({});
  const [formComplete, setFormComplete] = useState(false);
  const [formChanged, setFormChanged] = useState(true);
  const [ministrySelected, setMinistrySelected] = useState("");

  const {
    formState: { errors, isValid, isDirty },
    watch,
    getValues,
    setValue,
    handleSubmit,
    reset,
  } = methods;

  //extend isDirty status to monitor for change and warn about leaving without saving
  watch(() => setFormChanged(true));

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
      toast.current.show(formServices.lookup("messages", "save"));
      setLoading(true);
      //submit to api
      //then statement
      //activates next page if valid
      const registrationUpdate = { ...registrationData, ...finalData };
      console.log(
        registrationUpdate,
        "this update is checking spread operator"
      );
      setRegistration(registrationUpdate);
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
    // console.log(data);
    const finalData = { ...getValues() };
    console.log("final Data before set submission", finalData);
    // const finalData = Object.assign({}, data);
    setSubmissionData(finalData);
    // console.log(submissionData, "this is final submission data");
    try {
      //submit to api
      //then statement
      //navigate to next page on success
      navigate("/register/details");
    } catch (error) {}
  };

  useEffect(() => {
    //to update with api call to get ministry selection from prior profile page
    let minData = "org-1";
    const getMinistry = async () => {
      //update with api call for prior data
      if (ministryInherited) {
        minData = ministryInherited;
      }
      if (ministryRegistration) {
        minData = ministryRegistration;
      }
      console.log(minData, "this is minData");
      const ministry =
        (await formServices.lookup("organizations", minData)) ||
        (await formServices.lookup("currentPinsOnlyOrganizations", minData)) ||
        "";
      setMinistrySelected(ministry);
      yearsData ? setValue("personal-yearsofservice", yearsData) : null;
    };
    getMinistry();
  }, []);

  useEffect(() => {
    const stepsTemplate = isLSAEligible
      ? formServices.get("selfregistrationsteps")
      : formServices.get("pinOnlyselfregistrationsteps");
    const finalSteps = stepsTemplate.map(({ label, route }, index) => ({
      label: label,
      command: () => navigate(route),
      disabled: index >= pageIndex,
    }));
    //to update all steps setting with conditional LSA/not recipient
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
          title="Milestone Details"
          subtitle="Identify your milestones"
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
          subtitle="Identify your milestones"
        ></PageHeader>
        <FormSteps data={steps} stepIndex={pageIndex} category="Registration" />
        <FormProvider {...methods}>
          <form className="milestones-form">
            <AppPanel header="Milestone Details">
              <MilestoneSelector
                selfregister
                panelName="personal"
                errors={errors}
                ministry={ministrySelected}
              />
            </AppPanel>
            <div className="submission-buttons">
              <AppButton secondary onClick={handleSubmit(saveData)}>
                Save
              </AppButton>
              <AppButton
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
