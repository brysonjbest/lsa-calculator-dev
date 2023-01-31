import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation, useOutletContext } from "react-router";
import { RegistrationContext, ToastContext } from "../../UserContext";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import MilestoneSelector from "../../components/inputs/MilestoneSelector";
import InfoToolTip from "../../components/common/InfoToolTip";

import formServices from "../../services/settings.services";

/**
 * Milestone Selection.
 * Allows user to use built in calculator to determine years of service and potential milestones.
 */

export default function MilestoneSelection() {
  const navigate = useNavigate();
  const pageIndex = 1;
  const location = useLocation();
  const isLSAEligible = useOutletContext();
  const toast = useContext(ToastContext);

  const { registration, setRegistration } = useContext(RegistrationContext);

  const yearsData = location.state ? location.state["qualifyingYears"] : "";
  const ministryInherited = location.state
    ? location.state["ministryData"]
    : null;

  const ministryRegistration =
    registration && registration["organization"]
      ? registration["organization"]
      : null;

  const defaultFormValues = {
    "personal-yearsofservice": "",
    "personal-currentmilestone": null,
    "personal-qualifyingyear": "",
    "personal-priormilestones": [],
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });

  const [formComplete, setFormComplete] = useState(false);
  const [ministrySelected, setMinistrySelected] = useState("");

  const {
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    handleSubmit,
    reset,
  } = methods;
  const saveData = (data) => {
    let updateData = {};
    if (
      data["personal-currentmilestone"] !==
        registration["personal-currentmilestone"] &&
      registration["awardname"]
    ) {
      updateData = {
        awards: [
          {
            award: {
              id: "",
              label: "",
              description: "",
              award_options: [],
            },
          },
        ],
      };
    }
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    try {
      toast.current.show(formServices.lookup("messages", "save"));
      // setLoading(true);
      //submit to api
      //then statement
      //activates next page if valid
      const registrationUpdate = {
        ...registrationData,
        ...finalData,
        ...updateData,
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
    console.log("final Data before set submission", finalData);
    try {
      navigate("/register/details");
    } catch (error) {}
  };

  useEffect(() => {
    //to update with api call to get ministry selection from prior profile page
    let minData = "org-1";
    const getMinistry = async () => {
      //update with api call for prior data
      if (ministryInherited) {
        minData = ministryInherited;
      }
      if (ministryRegistration) {
        minData = ministryRegistration;
      }
      const ministry =
        (await formServices.lookup("organizations", minData)) ||
        (await formServices.lookup("currentPinsOnlyOrganizations", minData)) ||
        "";
      setMinistrySelected(ministry);
      yearsData ? setValue("personal-yearsofservice", yearsData) : null;
    };
    getMinistry();
  }, []);

  useEffect(() => {
    reset(registration);
  }, [registration]);

  return (
    <>
      <div className="self-registration basic-profile">
        <FormProvider {...methods}>
          <form className="milestones-form">
            <AppPanel header="Milestones Information" collapsed toggleable>
              <div className="information-only-panel">
                <p>
                  Eligibility for service recognition programs is calculated
                  differently than pensionable time.
                </p>
                <ul>
                  <li>
                    Calculate your years of service by counting the calendar
                    years you’ve been working for an eligible organization,
                    including the year you started and the current year.{" "}
                  </li>
                  <li>
                    Time worked as a seasonal, co-op, part-time or auxiliary
                    employee counts.
                  </li>
                  <li>
                    Your service time is calculated based on cumulative service
                    time, rather than continuous.{" "}
                  </li>
                  <li>
                    That means any time worked prior to a break in service
                    counts towards your service time. Periods of leave with pay
                    (STIIP, maternity/parental leave, educational leave,
                    deferred salary leave, LTD up to a maximum of two years)
                    count towards years of service, but unpaid leave does not.
                  </li>
                </ul>
                <p>
                  Contact Careers & MyHR if you need to confirm your individual
                  service dates.
                </p>
              </div>
            </AppPanel>
            <AppPanel
              header={
                <>
                  Milestone Details
                  <InfoToolTip
                    target="milestones-form"
                    content="Enter your years of service and claim milestones in recognition of years served."
                  />
                </>
              }
            >
              <MilestoneSelector
                selfregister
                panelName="personal"
                errors={errors}
                ministry={ministrySelected}
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
