import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ContactDetails from "../../components/inputs/ContactDetails";
import FormSteps from "../../components/common/FormSteps";
import formServices from "../../services/settings.services";
import AddressInput from "../../components/inputs/AddressInput";
import DataDisplay from "../../components/common/DataDisplay";
import "./Confirmation.css";
import { RegistrationContext } from "../../UserContext";

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
  const pageIndex = 5;
  const { registration, setRegistration } = useContext(RegistrationContext);

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
  const [consent, setConsent] = useState(false);

  //Final step in creating submission - will be api call to backend to update
  const {
    formState: { errors, isValid, isDirty },
    watch,
    getValues,
    control,
    reset,
  } = methods;

  const submitData = (data) => {
    //this will simply makr it as completed in the system, it won't do anything further will include wether or not they are consenting
    console.log(data, "this is submission");
    // const finalData = Object.assign({}, data);
    // setSubmissionData(finalData);
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
    const awardArray = [
      {
        awardname: registration["awardname"],
        awarddescription: registration["awarddescription"],
        awardoptions: registration["awardoptions"],
      },
    ];
    const lsaArray = [
      {
        retiringcurrentyear: true,
        retirementdate: "2022-12-01",
        attendingceremony: true,
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
    const finalData = {
      milestoneArray: milestoneArray,
      personalArray: personalArray,
      contactArray: contactArray,
      officeArray: officeArray,
      supervisorArray: supervisorArray,
      lsaArray: lsaArray,
      awardArray: awardArray,
    };
    setFormData(finalData);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    const stepsTemplate = formServices.get("selfregistrationsteps");
    const finalSteps = stepsTemplate.map(({ label, route }, index) => ({
      label: label,
      command: () => navigate(route),
      disabled: index >= pageIndex,
    }));
    //to update all steps setting with conditional LSA/not recipient
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
      </div>
    );
  };

  return (
    <>
      {hasLoaded ? (
        <div className="self-registration confirmation-profile">
          <PageHeader
            title="Registration"
            subtitle="Confirm your registration details"
          ></PageHeader>
          <FormSteps
            data={steps}
            stepIndex={pageIndex}
            category="Registration"
          />
          <AppPanel header="Registration Information">
            The information you have submitted indicates that you are
            registering for the following recognition awards: Service Pins
            (Years) Long Service Awards (Years) Please review the confirmation
            details below and ensure that what you have entered is correct. Your
            submission will not be complete until you have confirmed your
            registration below.
          </AppPanel>

          <AppPanel header="Registration Confirmation">
            <div className="registration-confirmation-sections">
              <AppPanel header="Recognition Details">
                <div className="confirmation-panel-details">
                  <AppPanel header={header("Milestone")}>
                    <DataDisplay
                      category="milestone"
                      data={formData}
                      identifier="milestoneArray"
                      stacked
                    />
                  </AppPanel>
                  <AppPanel header={header("Award")}>
                    <DataDisplay
                      category="award"
                      data={formData}
                      identifier="awardArray"
                    />
                  </AppPanel>
                  <AppPanel header={header("Long Service Awards", "milestone")}>
                    <DataDisplay
                      category="lsa"
                      data={formData}
                      identifier="lsaArray"
                    />
                  </AppPanel>
                </div>
              </AppPanel>

              <AppPanel header="Contact Details">
                <div className="confirmation-panel-details">
                  <AppPanel header={header("Personal Profile", "profile")}>
                    <DataDisplay
                      category="profile"
                      data={formData}
                      identifier="personalArray"
                    />
                  </AppPanel>
                  <AppPanel header={header("Personal Contact", "details")}>
                    <DataDisplay
                      category="personalContact"
                      data={formData}
                      identifier="contactArray"
                    />
                  </AppPanel>
                  <AppPanel
                    header={header("Personal Office Address", "details")}
                  >
                    <DataDisplay
                      category="office"
                      data={formData}
                      identifier="officeArray"
                    />
                  </AppPanel>
                  <AppPanel
                    header={header("Supervisor Information", "supervisor")}
                  >
                    <DataDisplay
                      category="supervisor"
                      data={formData}
                      identifier="supervisorArray"
                    />
                  </AppPanel>
                </div>
              </AppPanel>
            </div>
          </AppPanel>
          <FormProvider {...methods}>
            <form
              className="confirmation-details-form"
              onSubmit={methods.handleSubmit(submitData)}
            >
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
                  <label htmlFor={`consent-block`} className="block">
                    I consent to be contacted regarding this for a survey.
                  </label>
                  <Controller
                    name="consent"
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
              <div className="submission-buttons">
                <AppButton type="submit" disabled={!declaration}>
                  Confirm/Submit
                </AppButton>
              </div>
            </form>
          </FormProvider>
        </div>
      ) : null}
    </>
  );
}
