import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import FormSteps from "../../components/common/FormSteps";
import { Toast } from "primereact/toast";
import formServices from "../../services/settings.services";
import { useLocation, useNavigate } from "react-router";
import { RegistrationContext, ToastContext } from "../../UserContext";
import LSADetails from "../../components/inputs/LSADetails";
import { ProgressSpinner } from "primereact/progressspinner";
import SubmittedInfo from "../../components/composites/SubmittedInfo";

/**
 * LSA Attendance Questions.
 * @returns
 */

export default function LSAAttendance() {
  const navigate = useNavigate();
  // const toast = useRef(null);
  const toast = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const { registration, setRegistration } = useContext(RegistrationContext);
  const isLSAEligible = registration["personal-currentmilestone"] >= 25;
  const pageIndex = 3;

  const defaultFormValues = {
    retiringcurrentyear: false,
    retirementdate: null,
    ceremonyoptout: false,
    bcgeumember: false,
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
    console.log(finalData, "this is final data that is being set");
    toast.current.show(formServices.lookup("messages", "save"));
    try {
      // setLoading(true);
      //submit to api - submits current registration to api and updates current registration context with return from api
      //then statement
      //activates next page if valid
      const registrationUpdate = {
        ...registrationData,
        ...finalData,
        ...{ loading: true },
      };
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
        // setLoading(false);
        setRegistration((state) => ({ ...state, loading: false }));
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
    setSubmissionData(finalData);
    try {
      navigate("/register/award");
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

  // const [submitted, setSubmitted] = useState(registration["submitted"]);
  if (registration["submitted"]) {
    return (
      <>
        <SubmittedInfo
          title="LSA Attendance Details"
          subtitle="Your LSA Attendance Details"
        />
      </>
    );
  }

  return (
    <>
      {/* <Toast ref={toast} />
      {loading ? (
        <div className="loading-modal">
          <ProgressSpinner />
        </div>
      ) : null} */}
      <div className="self-registration basic-profile">
        <PageHeader
          title="Registration"
          subtitle="Your LSA Attendance Details"
        ></PageHeader>
        <FormSteps data={steps} stepIndex={pageIndex} category="Registration" />
        <FormProvider {...methods}>
          <form className="basic-details-form">
            <AppPanel header="LSA Attendance Details">
              <LSADetails panelName="personal" errors={errors} />
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
