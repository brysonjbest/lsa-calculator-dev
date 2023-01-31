import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router";
import { RegistrationContext, ToastContext } from "../../UserContext";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import ContactDetails from "../../components/inputs/ContactDetails";
import AddressInput from "../../components/inputs/AddressInput";
import InfoToolTip from "../../components/common/InfoToolTip";

import formServices from "../../services/settings.services";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function ProfileDetails() {
  const navigate = useNavigate();
  const isLSAEligible = useOutletContext();
  const toast = useContext(ToastContext);
  const { registration, setRegistration } = useContext(RegistrationContext);
  const [formComplete, setFormComplete] = useState(false);

  const defaultFormValues = {
    contact: {
      personal_phone: "",
      personal_email: "",
      office_address: {
        pobox: "",
        street1: "",
        street2: "",
        postal_code: "",
        community: "",
        province: "",
        country: "",
      },
      personal_address: {
        pobox: "",
        street1: "",
        street2: "",
        postal_code: "",
        community: "",
        province: "",
        country: "",
      },
    },
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
    const finalData = { ...getValues() };
    console.log(finalData, "this is final data");
    try {
      //navigate to next page on success - page should be awards if they are LSA, otherwise, to supervisor details
      isLSAEligible
        ? navigate("/register/attendance")
        : navigate("/register/supervisor");
    } catch (error) {}
  };

  useEffect(() => {
    reset(registration);
  }, [registration]);

  return (
    <>
      <div className="self-registration additional-profile">
        <FormProvider {...methods}>
          <form className="additional-details-form">
            {isLSAEligible ? (
              <>
                <AppPanel
                  header={
                    <>
                      <span className="additional-details-personal-contact">
                        Personal Contact Details
                      </span>
                      <InfoToolTip
                        target="additional-details-personal-contact"
                        content="Personal Contact Details are required for Long Service Award recipients."
                      />
                    </>
                  }
                >
                  <ContactDetails
                    personalContact
                    panelName="personal"
                    errors={errors}
                  />
                </AppPanel>

                <AppPanel
                  header={
                    <>
                      <span className="additional-details-personal-address">
                        Personal Address
                      </span>

                      <InfoToolTip
                        target="additional-details-personal-address"
                        content="Personal Address Details are required for Long Service Award recipients."
                      />
                    </>
                  }
                >
                  <AddressInput
                    province
                    addressIdentifier="personal"
                    errors={errors}
                    contactType="contact"
                  />
                </AppPanel>
              </>
            ) : null}
            <AppPanel
              header={
                <>
                  <span className="additional-details-office-address">
                    Office Address
                  </span>

                  <InfoToolTip
                    target="additional-details-office-address"
                    content="Please enter your current local office address."
                  />
                </>
              }
            >
              <AddressInput
                addressIdentifier="office"
                errors={errors}
                contactType="contact"
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
