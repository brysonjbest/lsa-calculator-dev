import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import MilestoneSelector from "../../components/inputs/MilestoneSelector";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import { useNavigate, useLocation } from "react-router";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function MilestoneSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location.state);
  const yearsData = location.state ? location.state["qualifyingYears"] : "";
  const ministryInherited = location.state
    ? location.state["ministryData"]
    : null;
  // console.log(ministryInherited);

  const defaultValues = {
    "personal-yearsofservice": "",
    "personal-currentmilestone": null,
    "personal-qualifyingyear": "",
    "personal-priormilestones": [],
  };

  const methods = useForm({ defaultValues });
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
  } = methods;

  //extend isDirty status to monitor for change and warn about leaving without saving
  watch(() => setFormChanged(true));

  const saveData = (e) => {
    e.preventDefault();
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
    // console.log(submissionData, "this is final submission data");
    try {
      //submit to api
      //then statement
      //navigate to next page on success
      navigate("/register/details");
    } catch (error) {}
  };

  useEffect(() => {
    setSteps(formServices.get("selfregistrationsteps") || []);
    //to update with api call to get ministry selection from prior profile page
    let minData = "org-1";
    const getMinistry = async () => {
      //update with api call for prior data
      minData = ministryInherited ? ministryInherited : "org-30";
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

  return (
    <>
      <div className="self-registration basic-profile">
        <PageHeader
          title="Registration"
          subtitle="Identify your milestones"
        ></PageHeader>
        <FormSteps data={steps} stepIndex={1} category="Registration" />
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
              <AppButton secondary onClick={(e) => saveData(e)}>
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
