import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import GalleryDisplay from "../../components/common/GalleryDisplay";
import "./Award.css";
import AwardSelector from "../../components/inputs/AwardSelector";
import { useNavigate } from "react-router";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function Award() {
  const navigate = useNavigate();
  const pageIndex = 3;
  const defaultValues = {
    awardID: "",
    awardname: "",
    awarddescription: "",
    awardoptions: [],
  };

  const methods = useForm({ defaultValues });
  const [steps, setSteps] = useState([]);
  const [submissionData, setSubmissionData] = useState({});
  const [awardSelected, setAwardSelected] = useState(false);
  const [chosenAward, setChosenAward] = useState("");
  const [formChanged, setFormChanged] = useState(false);

  const {
    formState: { errors, isValid, isDirty },
    watch,
    getValues,
    handleSubmit,
  } = methods;

  //extend isDirty status to monitor for change and warn about leaving without saving
  watch(() => setFormChanged(true));

  const saveData = (e) => {
    e.preventDefault();
    const finalData = { ...getValues() };
    // console.log("final Data before set submission", finalData);
    setSubmissionData(finalData);
    console.log(submissionData, "this is saved data");
  };

  const submitSelection = (e, selectedID) => {
    e.preventDefault();
    setAwardSelected(true);
    setChosenAward(selectedID);
    const finalData = { ...getValues() };
    // console.log("final Data before set submission", finalData);
    setSubmissionData(finalData);
    console.log(submissionData, "this is submission data");
  };

  //Final step in creating submission - will be api call to backend to update

  const submitData = (data) => {
    console.log(data);
    const finalData = Object.assign({}, data);
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
    const stepsTemplate = formServices.get("selfregistrationsteps");
    const finalSteps = stepsTemplate.map(({ label, route }, index) => ({
      label: label,
      command: () => navigate(route),
      disabled: index >= pageIndex,
    }));
    //to update all steps setting with conditoinal LSA/not recipient
    setSteps(finalSteps);
  }, []);

  return (
    <>
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
              award={chosenAward}
              submitAward={submitSelection}
            />
            {/* <GalleryDisplay header="Award Options" /> */}
            {/* Filler - this will be award display */}

            <div className="submission-buttons">
              <AppButton secondary onClick={(e) => saveData(e)}>
                Save
              </AppButton>
              <AppButton
                onClick={handleSubmit(submitData)}
                type="submit"
                disabled={!awardSelected}
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
