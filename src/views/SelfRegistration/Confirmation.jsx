import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
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

/**
 * Basic Registration.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function Confirmation() {
  const defaultValues = {
    consent: false,
  };
  const methods = useForm({ defaultValues });
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
  } = methods;

  const submitData = (data) => {
    //this will simply makr it as completed in the system, it won't do anything further will include wether or not they are consenting
    console.log(data, "this is submission");
    // const finalData = Object.assign({}, data);
    // setSubmissionData(finalData);
  };

  useEffect(() => {
    setSteps(formServices.get("selfregistrationsteps") || []);
    //edit for api usage on load
    const formDataTemp = [
      {
        "personal-firstname": "TestingFirstname",
        "personal-lastname": "TestingLast",
        "personal-governmentemail": "email@email.com",
        "personal-governmentphone": "555-555-5555",
        "personal-employeenumber": "12345679",
        "personal-ministryorganization": "org-4",
        "personal-branch": "Health",
        "personal-yearsofservice": 25,
        "personal-currentmilestone": 25,
        "personal-qualifyingyear": 2022,
        "personal-priormilestones": [20, 15],
        "personal-personalphone": "555-555-5555",
        "personal-personalemail": "test@test2.com",
        officecitycommunity: "Victoria",
        officepostalcode: "A0A0A0",
        officestreetaddress: "123 Fake Street",
        officestreetaddress2: "Apartment 1",
        personalcitycommunity: "Vancouver",
        personalpostalcode: "0A0A0A",
        personalprovincestate: "BC",
        personalstreetaddress: "456 Fake Drive",
        personalstreetaddress2: "Apartment 2",
        "supervisor-firstname": "SupervisorFirst",
        "supervisor-lastname": "SupervisorLast",
        "supervisor-governmentemail": "supervisor@email.com",
        supervisorstreetaddress: "789 Fake Road",
        supervisorstreetaddress2: "Suite 99",
        supervisorcitycommunity: "Prince George",
        supervisorpostalcode: "V1V2B2",
        supervisorpobox: "123987",
      },
    ];
    const milestoneArray = [
      {
        yearsofservice: 25,
        currentmilestone: 25,
        qualifyingyear: 2022,
        priormilestones: [20, 15],
      },
    ];
    const awardArray = [
      {
        awardname: "This is a test",
        awarddescription: "these are the details of this award",
        awardoptions: ["Test", "Test2"],
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
        firstname: "TestingFirstname",
        lastname: "TestingLast",
        governmentemail: "email@email.com",
        governmentphone: "555-555-5555",
        employeenumber: "12345679",
        ministryorganization: "org-4",
        branch: "Health",
      },
    ];
    const contactArray = [
      {
        personalphone: "555-555-5555",
        personalemail: "test@test2.com",
        streetaddress: "456 Fake Drive",
        streetaddress2: "Apartment 2",
        citycommunity: "Vancouver",
        postalcode: "0A0A0A",
        provincestate: "BC",
      },
    ];
    const officeArray = [
      {
        citycommunity: "Victoria",
        postalcode: "A0A0A0",
        streetaddress: "123 Fake Street",
        streetaddress2: "Apartment 1",
      },
    ];
    const supervisorArray = [
      {
        firstname: "SupervisorFirst",
        lastname: "SupervisorLast",
        governmentemail: "supervisor@email.com",
        streetaddress: "789 Fake Road",
        streetaddress2: "Suite 99",
        citycommunity: "Prince George",
        postalcode: "V1V2B2",
        pobox: "123987",
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
    // const finalData = [milestoneArray];
    setFormData(finalData);
    setHasLoaded(true);
  }, []);

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
          <FormSteps data={steps} stepIndex={5} category="Registration" />
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
