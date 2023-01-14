import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import AddressInput from "../../components/inputs/AddressInput";
import { useNavigate } from "react-router";
import { RegistrationContext } from "../../UserContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function Supervisor() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const { registration, setRegistration } = useContext(RegistrationContext);
  const isLSAEligible = registration["personal-yearsofservice"] >= 25;
  const pageIndex = isLSAEligible ? 5 : 3;

  const defaultFormValues = {
    "supervisor-firstname": "",
    "supervisor-lastname": "",
    "supervisor-governmentemail": "",
    supervisorstreetaddress: "",
    supervisorstreetaddress2: "",
    supervisorcitycommunity: "",
    supervisorpostalcode: "",
    supervisorpobox: "",
  };

  // const methods = useForm({ defaultValues });
  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });
  const [steps, setSteps] = useState([]);
  const [submissionData, setSubmissionData] = useState({});
  const [formComplete, setFormComplete] = useState(false);
  const [formChanged, setFormChanged] = useState(true);

  const {
    formState: { errors, isValid, isDirty },
    watch,
    getValues,
    handleSubmit,
    reset,
  } = methods;

  //extend isDirty status to monitor for change and warn about leaving without saving
  watch(() => setFormChanged(true));

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
      setLoading(false);
    }
  };

  //Final step in creating submission - will be api call to backend to update

  const submitData = (e) => {
    e.preventDefault();
    const finalData = { ...getValues() };

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

  return (
    <>
      <Toast ref={toast} />
      {loading ? (
        <div className="loading-modal">
          <ProgressSpinner />
        </div>
      ) : null}
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
