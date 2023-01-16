import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppButton from "../../components/common/AppButton";
import PageHeader from "../../components/common/PageHeader";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import "./Award.css";
import AwardSelector from "../../components/inputs/AwardSelector";
import { useNavigate } from "react-router";
import { RegistrationContext } from "../../UserContext";
import { getAvailableAwards } from "../../api/api.services";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import SubmittedInfo from "../../components/composites/SubmittedInfo";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function Award() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const { registration, setRegistration } = useContext(RegistrationContext);
  const isLSAEligible = registration["personal-yearsofservice"] >= 25;
  const pageIndex = 4;

  const defaultFormValues = {
    awardID: "",
    awardname: "",
    awarddescription: "",
    awardoptions: [],
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });

  // const methods = useForm({ defaultValues });
  const [steps, setSteps] = useState([]);
  const [submissionData, setSubmissionData] = useState({});
  const [awardSelected, setAwardSelected] = useState(false);
  const [chosenAward, setChosenAward] = useState("");
  const [availableAwards, setAvailableAwards] = useState([]);
  const [formChanged, setFormChanged] = useState(false);

  const {
    formState: { errors, isValid, isDirty },
    watch,
    getValues,
    handleSubmit,
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
      // setFormComplete(true);
      // setFormChanged(false);
      setAwardSelected(true);
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

  const submitSelection = (e, selectedID) => {
    e.preventDefault();
    setChosenAward(selectedID);
    const finalData = { ...getValues() };
    // console.log("final Data before set submission", finalData);
    setSubmissionData(finalData);
    console.log(submissionData, "this is submission data");
    setAwardSelected(false);
  };

  //Final step in creating submission - will be api call to backend to update

  const submitData = (e) => {
    e.preventDefault();
    // console.log(data);
    const finalData = { ...getValues() };
    // const finalData = Object.assign({}, data);
    setSubmissionData(finalData);
    console.log(submissionData, "this is final submission data");
    try {
      //submit to api
      //then statement
      //navigate to next page on success
      navigate("/register/supervisor");
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
    //to update all steps setting with conditoinal LSA/not recipient
    setSteps(finalSteps);
  }, []);

  useEffect(() => {
    const setAwards = async () => {
      const currentMilestone = registration["personal-currentmilestone"]
        ? registration["personal-currentmilestone"]
        : null;
      const data = await getAvailableAwards(currentMilestone);
      setAvailableAwards(data);
    };
    if (registration["awardID"]) {
      setChosenAward(registration["awardID"]);
      setAwardSelected(true);
      console.log(
        registration["awardID"],
        chosenAward,
        awardSelected,
        "status of state"
      );
    }
    setAwards();
  }, []);

  const [submitted, setSubmitted] = useState(registration["submitted"]);
  if (submitted) {
    return (
      <>
        <SubmittedInfo title="Award Selection" subtitle="Award Selection" />
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
      <div className="self-registration award-profile">
        <PageHeader
          title="Registration"
          subtitle="Award Selection"
        ></PageHeader>
        <FormSteps data={steps} stepIndex={pageIndex} category="Registration" />
        <FormProvider {...methods}>
          <form className="award-details-form">
            <AwardSelector
              errors={errors}
              chosenAward={chosenAward}
              submitAward={submitSelection}
              awards={availableAwards}
            />
            <div className="submission-buttons">
              <AppButton secondary onClick={handleSubmit(saveData)}>
                Save
              </AppButton>
              <AppButton
                onClick={(e) => submitData(e)}
                disabled={!awardSelected}
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
