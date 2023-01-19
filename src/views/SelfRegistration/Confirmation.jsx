import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { Checkbox } from "primereact/checkbox";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import DataDisplay from "../../components/common/DataDisplay";
import "./Confirmation.css";
import { RegistrationContext } from "../../UserContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function Confirmation() {
  const defaultFormValues = {
    consent: false,
  };
  const navigate = useNavigate();
  const { registration, setRegistration } = useContext(RegistrationContext);
  const isLSAEligible = registration["personal-yearsofservice"] >= 25;
  const pageIndex = isLSAEligible ? 6 : 4;
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(registration["submitted"]);
  const [errorsRegistration, setErrorsRegistration] = useState({
    milestone: true,
    award: true,
    lsa: true,
    personal: true,
    contact: true,
    office: true,
    supervisor: true,
  });

  // const methods = useForm({ defaultValues });
  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });
  const [steps, setSteps] = useState([]);
  const [formData, setFormData] = useState([{}]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [declaration, setDeclaration] = useState(false);
  const [registrationReady, setRegistrationReady] = useState(false);

  //Final step in creating submission - will be api call to backend to update
  const {
    formState: { errors, isValid, isDirty },
    control,
    reset,
    handleSubmit,
  } = methods;

  const submitData = (data) => {
    console.log(data, "this is submission");
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    let registrationUpdate = {
      ...registrationData,
      ...finalData,
      ...{ submitted: true },
    };

    if (!isLSAEligible) {
      const defaultFormReset = {
        "personal-personalemail": "",
        "personal-personalphone": "",
        personalcitycommunity: "",
        personalcountry: "",
        personalpostalcode: "",
        personalprovincestate: "",
        personalstreetaddress: "",
        personalstreetaddress2: "",
        awardID: "",
        awarddescription: "",
        awardname: "",
        awardoptions: [],
        retirementdate: null,
        retiringcurrentyear: false,
        bcgeumember: false,
        ceremonyoptout: false,
      };
      registrationUpdate = { ...registrationUpdate, ...defaultFormReset };
    }
    try {
      toast.current.show(formServices.lookup("messages", "submit"));
      setLoading(true);
      //submit to api
      //then statement
      //activates next page if valid
      console.log(
        registrationUpdate,
        "this update is checking spread operator"
      );
      setRegistration(registrationUpdate);
      //this would change to api dependent
      setTimeout(() => {
        toast.current.replace(formServices.lookup("messages", "savesuccess"));
        setLoading(false);
        setSubmitted(true);
      }, 3000);
    } catch (error) {
      toast.current.replace(formServices.lookup("messages", "saveerror"));
    } finally {
      //update when using real api call to set here vs in try
      // setLoading(false);
    }
  };

  useEffect(() => {
    const milestoneArray = [
      {
        yearsofservice: registration["personal-yearsofservice"],
        currentmilestone: registration["personal-currentmilestone"],
        qualifyingyear: registration["personal-qualifyingyear"],
        priormilestones: registration["personal-priormilestones"],
      },
    ];
    const personalArray = [
      {
        firstname: registration["personal-firstname"],
        lastname: registration["personal-lastname"],
        governmentemail: registration["personal-governmentemail"],
        governmentphone: registration["personal-governmentphone"],
        employeenumber: registration["personal-employeenumber"],
        ministryorganization: registration["personal-ministryorganization"],
        branch: registration["personal-branch"],
      },
    ];
    const officeArray = [
      {
        citycommunity: registration["officecitycommunity"],
        postalcode: registration["officepostalcode"],
        streetaddress: registration["officestreetaddress"],
        streetaddress2: registration["officestreetaddress2"],
      },
    ];
    const supervisorArray = [
      {
        firstname: registration["supervisor-firstname"],
        lastname: registration["supervisor-lastname"],
        governmentemail: registration["supervisor-governmentemail"],
        streetaddress: registration["supervisorstreetaddress"],
        streetaddress2: registration["supervisorstreetaddress2"],
        citycommunity: registration["supervisorcitycommunity"],
        postalcode: registration["supervisorpostalcode"],
        pobox: registration["supervisorpobox"],
      },
    ];

    const contactArray = [
      {
        personalphone: registration["personal-personalphone"],
        personalemail: registration["personal-personalemail"],
        streetaddress: registration["personalstreetaddress"],
        streetaddress2: registration["personalstreetaddress2"],
        citycommunity: registration["personalcitycommunity"],
        postalcode: registration["personalpostalcode"],
        provincestate: registration["personalprovincestate"],
      },
    ];
    const awardArray = [
      {
        awardname: registration["awardname"],
        awarddescription: registration["awarddescription"],
        awardoptions: registration["awardoptions"],
      },
    ];
    const lsaArray = [
      {
        retiringcurrentyear: registration["retiringcurrentyear"],
        retirementdate: registration["retirementdate"],
        ceremonyoptout: registration["ceremonyoptout"],
        bcgeumember: registration["bcgeumember"],
      },
    ];
    const lsaDataSet = {
      milestoneArray: milestoneArray,
      personalArray: personalArray,
      contactArray: contactArray,
      officeArray: officeArray,
      supervisorArray: supervisorArray,
      lsaArray: lsaArray,
      awardArray: awardArray,
    };

    const pinOnlyDataSet = {
      milestoneArray: milestoneArray,
      personalArray: personalArray,
      officeArray: officeArray,
      supervisorArray: supervisorArray,
    };

    const finalData = isLSAEligible ? lsaDataSet : pinOnlyDataSet;
    const errorValues = {
      milestone: !registration["personal-yearsofservice"],
      personal: !registration["personal-firstname"],
      office: !registration["officestreetaddress"],
      supervisor: !registration["supervisor-firstname"],

      award: isLSAEligible
        ? !registration["awardname"] ||
          (registration["awardname"] === "PECSF Donation" &&
            registration["awardoptions"].length === 0)
        : false,
      lsa: false,
      contact: isLSAEligible ? !registration["personalstreetaddress"] : false,
    };
    setErrorsRegistration((state) => ({
      ...state,
      ...errorValues,
    }));

    const formErrors = Object.values(errorValues).every((v) => v === false);
    setRegistrationReady(formErrors);

    setFormData(finalData);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    const stepsTemplate = isLSAEligible
      ? formServices.get("selfregistrationsteps")
      : formServices.get("pinOnlyselfregistrationsteps");
    const finalSteps = stepsTemplate.map(({ label, route }, index) => ({
      label: label,
      command: () => navigate(route),
      disabled: index >= pageIndex,
    }));
    setSteps(finalSteps);
  }, []);

  useEffect(() => {
    reset(registration);
  }, [registration]);

  const header = (title, path) => {
    const titlePath = title.toLowerCase().replace(/\s/g, "");
    return (
      <div className="confirmation-panel-details-header">
        <span>{title}:</span>
        {!submitted ? (
          <Link
            to={`/register/${path ? path : titlePath}`}
            className="p-menuitem-link"
          >
            <AppButton
              className="confirmation-panel-edit"
              passClass="p-button-raised"
              info
            >
              Edit
            </AppButton>
          </Link>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      {loading ? (
        <div className="loading-modal">
          <ProgressSpinner />
        </div>
      ) : null}
      {hasLoaded ? (
        <div className="self-registration confirmation-profile">
          <PageHeader
            title="Registration"
            subtitle={
              submitted
                ? "Your Registration Details"
                : "Confirm your registration details"
            }
          ></PageHeader>
          {!submitted ? (
            <FormSteps
              data={steps}
              stepIndex={pageIndex}
              category="Registration"
            />
          ) : null}
          <AppPanel header="Registration Information">
            The information you have submitted indicates that you are
            registering for the following recognition awards: <br />
            Service Pins
            <br />
            {isLSAEligible ? (
              <span>
                Long Service Awards
                <br />
              </span>
            ) : null}
            {!submitted ? (
              <span>
                Please review the confirmation details below and ensure that
                what you have entered is correct. Your submission will not be
                complete until you have confirmed your registration below.
              </span>
            ) : (
              <span>
                If you have any concerns about your registration details, please
                contact support.
              </span>
            )}
          </AppPanel>

          <AppPanel header="Registration Confirmation">
            <div className="registration-confirmation-sections">
              <AppPanel header="Recognition Details">
                <div className="confirmation-panel-details">
                  <div
                    id="confirmation-milestone-details"
                    className={classNames("confirmation-panel", {
                      "registration-confirmation-error":
                        errorsRegistration.milestone,
                    })}
                  >
                    <AppPanel header={header("Milestone")}>
                      {errorsRegistration.milestone ? (
                        <label
                          htmlFor="confirmation-milestone-details"
                          className="registration-confirmation-error-text"
                        >
                          Missing Information. Please edit milestone details
                          before submission.
                        </label>
                      ) : null}
                      <DataDisplay
                        category="milestone"
                        data={formData}
                        identifier="milestoneArray"
                        stacked
                      />
                    </AppPanel>
                  </div>
                  {isLSAEligible ? (
                    <>
                      <div
                        id="confirmation-award-details"
                        className={classNames("confirmation-panel", {
                          "registration-confirmation-error":
                            errorsRegistration.award,
                        })}
                      >
                        <AppPanel header={header("Award")}>
                          {errorsRegistration.award ? (
                            <label
                              htmlFor="confirmation-award-details"
                              className="registration-confirmation-error-text"
                            >
                              Missing Information. Please edit award selection
                              before submission.
                            </label>
                          ) : null}
                          <DataDisplay
                            category="award"
                            data={formData}
                            identifier="awardArray"
                          />
                        </AppPanel>
                      </div>
                      <div
                        id="confirmation-lsa-details"
                        className={classNames("confirmation-panel", {
                          "registration-confirmation-error":
                            errorsRegistration.lsa,
                        })}
                      >
                        <AppPanel
                          header={header("Long Service Awards", "attendance")}
                        >
                          {errorsRegistration.lsa ? (
                            <label
                              htmlFor="confirmation-lsa-details"
                              className="registration-confirmation-error-text"
                            >
                              Missing Information. Please edit Long Service
                              Awards details before submission.
                            </label>
                          ) : null}
                          <DataDisplay
                            category="lsa"
                            data={formData}
                            identifier="lsaArray"
                          />
                        </AppPanel>
                      </div>
                    </>
                  ) : null}
                </div>
              </AppPanel>

              <AppPanel header="Contact Details">
                <div className="confirmation-panel-details">
                  <div
                    id="confirmation-personal-details"
                    className={classNames("confirmation-panel", {
                      "registration-confirmation-error":
                        errorsRegistration.personal,
                    })}
                  >
                    <AppPanel header={header("Personal Profile", "profile")}>
                      {errorsRegistration.personal ? (
                        <label
                          htmlFor="confirmation-personal-details"
                          className="registration-confirmation-error-text"
                        >
                          Missing Information. Please edit personal details
                          before submission.
                        </label>
                      ) : null}
                      <DataDisplay
                        category="profile"
                        data={formData}
                        identifier="personalArray"
                      />
                    </AppPanel>
                  </div>
                  {isLSAEligible ? (
                    <div
                      id="confirmation-contact-details"
                      className={classNames("confirmation-panel", {
                        "registration-confirmation-error":
                          errorsRegistration.contact,
                      })}
                    >
                      <AppPanel header={header("Personal Contact", "details")}>
                        {errorsRegistration.contact ? (
                          <label
                            htmlFor="confirmation-contact-details"
                            className="registration-confirmation-error-text"
                          >
                            Missing Information. Please edit contact details
                            before submission.
                          </label>
                        ) : null}
                        <DataDisplay
                          category="personalContact"
                          data={formData}
                          identifier="contactArray"
                        />
                      </AppPanel>
                    </div>
                  ) : null}
                  <div
                    id="confirmation-office-details"
                    className={classNames("confirmation-panel", {
                      "registration-confirmation-error":
                        errorsRegistration.office,
                    })}
                  >
                    <AppPanel
                      header={header("Personal Office Address", "details")}
                    >
                      {errorsRegistration.office ? (
                        <label
                          htmlFor="confirmation-office-details"
                          className="registration-confirmation-error-text"
                        >
                          Missing Information. Please edit office details before
                          submission.
                        </label>
                      ) : null}
                      <DataDisplay
                        category="office"
                        data={formData}
                        identifier="officeArray"
                      />
                    </AppPanel>
                  </div>
                  <div
                    id="confirmation-supervisor-details"
                    className={classNames("confirmation-panel", {
                      "registration-confirmation-error":
                        errorsRegistration.supervisor,
                    })}
                  >
                    <AppPanel
                      header={header("Supervisor Information", "supervisor")}
                    >
                      {errorsRegistration.supervisor ? (
                        <label
                          htmlFor="confirmation-supervisor-details"
                          className="registration-confirmation-error-text"
                        >
                          Missing Information. Please edit supervisor details
                          before submission.
                        </label>
                      ) : null}
                      <DataDisplay
                        category="supervisor"
                        data={formData}
                        identifier="supervisorArray"
                      />
                    </AppPanel>
                  </div>
                </div>
              </AppPanel>
            </div>
          </AppPanel>
          <FormProvider {...methods}>
            {!submitted ? (
              <form className="confirmation-details-form">
                <div className="consent-and-declaration">
                  <div className="declaration-true">
                    <Checkbox
                      inputId="declaration"
                      checked={declaration}
                      onChange={(e) => setDeclaration(e.checked)}
                    />
                    <label htmlFor="declaration">
                      I declare everything is true and accurate.
                    </label>
                  </div>
                  <div className="consent-true">
                    <label htmlFor={`consent`} className="block">
                      I consent to be contacted regarding this for a survey.
                    </label>
                    <Controller
                      name="consent"
                      defaultValue={false}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={field.name}
                          {...field}
                          inputId="consent"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.checked)}
                        />
                      )}
                    />
                  </div>
                </div>
                {!registrationReady && declaration ? (
                  <label
                    id="confirmation-final-submission-details-help"
                    htmlFor="confirmation-final-submission-details"
                    className="registration-confirmation-error-text"
                  >
                    Your registration is missing some information and cannot be
                    submitted until this is corrected. Please complete all
                    required form fields. Missing form fields are identified
                    above.
                  </label>
                ) : null}

                <div
                  id="confirmation-final-submission-details"
                  className="submission-buttons"
                >
                  <AppButton
                    secondary
                    onClick={handleSubmit(submitData)}
                    disabled={!declaration || !registrationReady}
                  >
                    Confirm/Submit
                  </AppButton>
                </div>
              </form>
            ) : null}
          </FormProvider>
        </div>
      ) : null}
    </>
  );
}
