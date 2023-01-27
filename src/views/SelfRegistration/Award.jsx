import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router";
import { RegistrationContext, ToastContext } from "../../UserContext";
import { getAvailableAwards } from "../../api/api.services";

import AppButton from "../../components/common/AppButton";
import formServices from "../../services/settings.services";
import AwardSelector from "../../components/inputs/AwardSelector";
import LSAIneligible from "../../components/composites/LSAIneligible";
import "./Award.css";

/**
 * Award Selection Page.
 * Allows a user to select the award based on the available awards for their selected milestone.
 * Resets based on milestone selection.
 */

export default function Award() {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const isLSAEligible = useOutletContext();
  const { registration, setRegistration } = useContext(RegistrationContext);

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

  const [submissionData, setSubmissionData] = useState({});
  const [awardSelected, setAwardSelected] = useState(false);
  const [chosenAward, setChosenAward] = useState("");
  const [availableAwards, setAvailableAwards] = useState([]);

  const {
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
  } = methods;

  const saveData = (data) => {
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    setSubmissionData(finalData);
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
      //this would change to api dependent
      setTimeout(() => {
        toast.current.replace(formServices.lookup("messages", "savesuccess"));
        setRegistration((state) => ({ ...state, loading: false }));
        registrationUpdate["awardname"] ? setAwardSelected(true) : false;
      }, 3000);
    } catch (error) {
      toast.current.replace(formServices.lookup("messages", "saveerror"));
    } finally {
      //update when using real api call to set here vs in try
    }
  };

  const submitSelection = (data) => {
    const testValues = getValues("awardoptions")[0];
    const testData = data.options.map((each) => each.name);
    const finalOptions = {};

    testData.forEach((element) => {
      testValues[element]
        ? (finalOptions[element] = testValues[element])
        : null;
    });

    setValue("awardoptions", [finalOptions]);
    const registrationData = { ...registration, ...{ awardoptions: [] } };
    const finalData = Object.assign({}, data);
    setChosenAward(data.id);
    setRegistration(registrationData);
    setSubmissionData(finalData);
    setAwardSelected(false);
  };

  //Final step in creating submission - will be api call to backend to update

  const submitData = (e) => {
    e.preventDefault();
    const finalData = { ...getValues() };
    setSubmissionData(finalData);
    console.log(submissionData, "this is final submission data");
    try {
      navigate("/register/supervisor");
    } catch (error) {}
  };

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
    }
    setAwards();
  }, []);

  if (!isLSAEligible) return <LSAIneligible />;

  const currentMilestone = registration["personal-currentmilestone"] || null;

  return (
    <>
      <div className="self-registration award-profile">
        <FormProvider {...methods}>
          <form className="award-details-form">
            <AwardSelector
              milestone={currentMilestone}
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
