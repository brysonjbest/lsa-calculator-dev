import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import AddressInput from "../../components/inputs/AddressInput";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function ProfileDetails() {
  const navigate = useNavigate();
  const defaultValues = {
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

  const methods = useForm({ defaultValues });
  const [steps, setSteps] = useState([]);
  const [submissionData, setSubmissionData] = useState({});
  const [formComplete, setFormComplete] = useState(false);
  const [formChanged, setFormChanged] = useState(true);

  const {
    formState: { errors, isValid, isDirty },
    watch,
    getValues,
  } = methods;

  //extend isDirty status to monitor for change and warn about leaving without saving
  watch(() => setFormChanged(true));

  const saveData = () => {
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
  };

  useEffect(() => {
    setSteps(formServices.get("selfregistrationsteps") || []);
  }, []);

  return (
    <>
      <div className="self-registration additional-profile">
        <PageHeader
          title="Registration"
          subtitle="Additional Profile Information"
        ></PageHeader>
        <FormSteps data={steps} stepIndex={2} category="Registration" />
        <FormProvider {...methods}>
          <form
            className="additional-details-form"
            // onSubmit={methods.handleSubmit(submitData)}
          >
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
            <AppPanel header="Office Address">
              <AddressInput addressIdentifier="office" errors={errors} />
            </AppPanel>
            <div className="submission-buttons">
              <AppButton secondary onClick={handleSubmit(saveData)}>
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
