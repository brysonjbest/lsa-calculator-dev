import { useContext, useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { RegistrationContext } from "../../UserContext";

import PageHeader from "../../components/common/PageHeader";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import FormSteps from "../../components/common/FormSteps";

import formServices from "../../services/settings.services";

/**
 * Panel Header for common component management in registration flow
 */

export default function PanelHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [steps, setSteps] = useState([]);
  const { registration, setRegistration } = useContext(RegistrationContext);
  const isLSAEligible = registration["personal-currentmilestone"] >= 25;
  const submitted = registration["submitted"];

  const currentPage = location.pathname.replace("/register/", "");
  const pageInfo = {
    self: { text: "Register", index: null },
    profile: { text: "Your Basic Profile Information", index: 0 },
    milestone: { text: "Identify your milestones", index: 1 },
    details: { text: "Additional Profile Information", index: 2 },
    attendance: { text: "Your LSA Attendance Details", index: 3 },
    award: { text: "Award Selection", index: 4 },
    supervisor: {
      text: "Your Supervisor Information",
      index: isLSAEligible ? 5 : 3,
    },
    confirmation: {
      text: "Confirm Your Registration Details",
      index: isLSAEligible ? 6 : 4,
    },
    undefined: { text: "", index: null },
  };

  useEffect(() => {
    const stepsTemplate = isLSAEligible
      ? formServices.get("selfregistrationsteps")
      : formServices.get("pinOnlyselfregistrationsteps");
    const finalSteps = stepsTemplate.map(({ label, route }, index) => ({
      label: label,
      command: () => navigate(route),
      disabled: index >= pageInfo[currentPage].index,
    }));
    setSteps(finalSteps);
  }, [pageInfo[currentPage].index]);

  return (
    <>
      <div>
        <PageHeader
          title="Registration"
          subtitle={pageInfo[currentPage].text}
        ></PageHeader>
        {!submitted ? (
          <FormSteps
            data={steps}
            stepIndex={pageInfo[currentPage].index}
            category="Registration"
          />
        ) : null}
        {submitted && currentPage !== "confirmation" ? (
          <AppPanel header={`Registration - Submitted`}>
            <div>
              You have already submitted your registration for this year. Please
              review your application details here:
            </div>
            <div>
              <AppButton
                onClick={() => {
                  navigate("/register/confirmation");
                }}
              >
                Confirmation Page
              </AppButton>
            </div>
            <div>
              If you believe you are seeing this message in error, please
              contact support.
            </div>
          </AppPanel>
        ) : (
          <Outlet context={[isLSAEligible]} />
        )}
      </div>
    </>
  );
}
