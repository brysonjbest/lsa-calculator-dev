import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { RegistrationContext, ToastContext } from "../../UserContext";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import ContactDetails from "../../components/inputs/ContactDetails";
import formServices from "../../services/settings.services";
import "./BasicProfile.css";

/**
 * Basic Registration.
 * Basic Profile Page requests user info required to continue with application.
 */

export default function BasicProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLSAEligible = useOutletContext();
  const toast = useContext(ToastContext);
  const { registration, setRegistration } = useContext(RegistrationContext);

  const stateData = location.state ? location.state : null;

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
    getValues,
    handleSubmit,
    reset,
  } = methods;

  const [submissionData, setSubmissionData] = useState({});
  const [formComplete, setFormComplete] = useState(false);

  const saveData = (data) => {
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    setSubmissionData(finalData);
    try {
      toast.current.show(formServices.lookup("messages", "save"));

      setRegistration((state) => ({ ...state, loading: true }));
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

      //this would change to api dependent
      setTimeout(() => {
        toast.current.replace(formServices.lookup("messages", "savesuccess"));
        setRegistration((state) => ({ ...state, loading: false }));
      }, 3000);
    } catch (error) {
      toast.current.replace(formServices.lookup("messages", "saveerror"));
    } finally {
      //update when using real api call to set here vs in try
    }
  };

  const submitData = (e) => {
    e.preventDefault();
    const finalData = { ...getValues() };
    setSubmissionData(finalData);
    console.log(submissionData, "this is final submission data");
    try {
      //submit to api
      //then statement
      //navigate to next page on success
      const ministryData = getValues("personal-ministryorganization");
      const newState = { ...stateData, ministryData };
      navigate("/register/milestone", { state: newState });
    } catch (error) {}
  };

  useEffect(() => {
    reset(registration);
  }, [registration]);

  return (
    <>
      <div className="self-registration basic-profile">
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
