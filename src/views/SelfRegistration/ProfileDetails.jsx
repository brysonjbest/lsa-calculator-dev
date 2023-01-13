import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import AddressInput from "../../components/inputs/AddressInput";
import { RegistrationContext } from "../../UserContext";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function ProfileDetails() {
  const navigate = useNavigate();
  const pageIndex = 2;
  const { registration, setRegistration } = useContext(RegistrationContext);
  const isLSAEligible = registration["personal-yearsofservice"] >= 25;

  const defaultFormValues = {
    "personal-personalphone": "",
    "personal-personalemail": "",
    officecitycommunity: "",
    officepostalcode: "",
    officestreetaddress: "",
    officestreetaddress2: "",
    personalcitycommunity: "",
    personalpostalcode: "",
    personalprovincestate: "",
    personalstreetaddress: "",
    personalstreetaddress2: "",
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
  const [lsaEligible, setLsaEligible] = useState(false);

  const {
    formState: { errors, isValid, isDirty },
    watch,
    getValues,
    handleSubmit,
    reset,
  } = methods;

  //extend isDirty status to monitor for change and warn about leaving without saving
  watch(() => setFormChanged(true));

  // const saveData = (data) => {
  //   e.preventDefault();
  //   const finalData = { ...getValues() };
  //   console.log("final Data before set submission", finalData);
  //   setSubmissionData(finalData);
  //   console.log(submissionData, "this is saved data");
  // };

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
    setSubmissionData(finalData);
    console.log(submissionData, "this is final submission data");
    try {
      //submit current registration to api and return state of registration and update registration
      //then statement
      //navigate to next page on success - page should be awards if they are LSA, otherwise, to supervisor details
      isLSAEligible
        ? navigate("/register/attendance")
        : navigate("/register/supervisor");
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
    const registrationWait = async () => {
      await registration;
      if (registration && registration["personal-yearsofservice"]) {
        console.log(
          registration["personal-yearsofservice"],
          "this is years total"
        );
        registration["personal-yearsofservice"] >= 25
          ? setLsaEligible(true)
          : null;
      }
    };
    registrationWait();
  }, []);

  useEffect(() => {
    reset(registration);
  }, [registration]);

  return (
    <>
      <div className="self-registration additional-profile">
        <PageHeader
          title="Registration"
          subtitle="Additional Profile Information"
        ></PageHeader>
        <FormSteps data={steps} stepIndex={pageIndex} category="Registration" />
        <FormProvider {...methods}>
          <form className="additional-details-form">
            {lsaEligible ? (
              <>
                <AppPanel header="Personal Contact Details">
                  <ContactDetails
                    personalContact
                    panelName="personal"
                    errors={errors}
                  />
                </AppPanel>

                <AppPanel header="Personal Address">
                  <AddressInput
                    province
                    addressIdentifier="personal"
                    errors={errors}
                  />
                </AppPanel>
              </>
            ) : null}
            <AppPanel header="Office Address">
              <AddressInput addressIdentifier="office" errors={errors} />
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
