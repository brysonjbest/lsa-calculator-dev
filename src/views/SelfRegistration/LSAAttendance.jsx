import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router";
import { RegistrationContext, ToastContext } from "../../UserContext";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import LSADetails from "../../components/inputs/LSADetails";
import LSAIneligible from "../../components/composites/LSAIneligible";

import formServices from "../../services/settings.services";

/**
 * LSA Attendance Questions.
 */

export default function LSAAttendance() {
  const navigate = useNavigate();
  const isLSAEligible = useOutletContext();
  const toast = useContext(ToastContext);
  const { registration, setRegistration } = useContext(RegistrationContext);

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
    handleSubmit,
    reset,
  } = methods;

  const [formComplete, setFormComplete] = useState(false);

  const saveData = (data) => {
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    try {
      toast.current.show(formServices.lookup("messages", "save"));
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
    try {
      navigate("/register/award");
    } catch (error) {}
  };

  useEffect(() => {
    reset(registration);
  }, [registration]);

  if (!isLSAEligible) return <LSAIneligible />;

  return (
    <>
      <div className="self-registration basic-profile">
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
