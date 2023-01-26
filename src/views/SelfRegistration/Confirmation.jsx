import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RegistrationContext, ToastContext } from "../../UserContext";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import classNames from "classnames";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import formServices from "../../services/settings.services";
import DataDisplay from "../../components/common/DataDisplay";
import "./Confirmation.css";

/**
 * Final Confirmation page.
 * User verifies previously input data and is given the option to return and edit prior selections, or submit registration.
 */

export default function Confirmation() {
  const navigate = useNavigate();
  const isLSAEligible = useOutletContext();
  const { registration, setRegistration } = useContext(RegistrationContext);
  const toast = useContext(ToastContext);

  //Load default form values and
  const defaultFormValues = {
    consent: false,
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });

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

  const [formData, setFormData] = useState([{}]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [declaration, setDeclaration] = useState(false);
  const [registrationReady, setRegistrationReady] = useState(false);

  const { control, reset, handleSubmit } = methods;

  const submitData = (data) => {
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    let registrationUpdate = {
      ...registrationData,
      ...finalData,
      ...{ submitted: true, loading: true },
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
      // setLoading(true);
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
        setRegistration((state) => ({ ...state, loading: false }));
        setSubmitted(true);
      }, 3000);
    } catch (error) {
      toast.current.replace(formServices.lookup("messages", "saveerror"));
    } finally {
      //update when using real api call to set here vs in try
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
    reset(registration);
  }, [registration]);

  // Basic Panel header formatting specific to confirmation page
  const header = (title, path) => {
    const titlePath = title.toLowerCase().replace(/\s/g, "");
    return (
      <div className="confirmation-panel-details-header">
        <span>{title}:</span>
        {!submitted ? (
          <AppButton
            className="confirmation-panel-edit"
            passClass="p-button-raised"
            info
            onClick={(e) => {
              e.preventDefault();
              navigate(`/register/${path ? path : titlePath}`);
            }}
          >
            Edit
          </AppButton>
        ) : null}
      </div>
    );
  };

  const finalConfirm = () => {
    console.log("finalConfirm has worked");
    handleSubmit(submitData)();
  };

  const confirmSubmit = (event) => {
    confirmDialog({
      target: event.currentTarget,
      message:
        "Are you sure you want to submit?\n This action cannot be undone.\n Confirm that you have double checked all details, and your selections are correct.",
      icon: "pi pi-exclamation-triangle",
      accept: finalConfirm,
      reject: null,
    });
  };

  return (
    <>
      {hasLoaded ? (
        <div className="self-registration confirmation-profile">
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
                  <ConfirmDialog />
                  <AppButton
                    secondary
                    onClick={(e) => {
                      e.preventDefault();
                      confirmSubmit(e);
                    }}
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
