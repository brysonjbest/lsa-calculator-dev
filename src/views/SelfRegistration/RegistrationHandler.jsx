import React, { useContext, useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocation, useNavigate, redirect } from "react-router";
import { UserContext, RegistrationContext } from "../../UserContext";

export default function RegistrationHandler() {
  const { registration, setRegistration } = useContext(RegistrationContext);
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isLSAEligible = registration["personal-currentmilestone"] >= 25;
  const [submitted, setSubmitted] = useState(registration["submitted"]);

  const stateData = location.state;
  const qualifyingYears = stateData && stateData.years ? stateData.years : null;

  //update with check for truly active based on what api would return - probably null?
  const activeRegistration = JSON.stringify(registration) !== "{}";

  //to update routing when api routes are finalized - should take into account what has been submitted and send to page that requires completion
  //routing on pages will also need to verify that the data exists before allowing someone to visit the page

  const registrationProgress = async () => {
    let route = `profile`;
    if (registration) {
      if (registration["personal-firstname"]) {
        route = "milestone";
      }
      if (registration["personal-yearsofservice"]) {
        route = "details";
      }
      if (registration["personalstreetaddress"]) {
        isLSAEligible ? (route = "attendance") : (route = "supervisor");
      }

      if (registration["personal-retiringcurrentyear"] != null) {
        isLSAEligible ? (route = "award") : (route = "supervisor");
      }

      if (registration["awardname"]) {
        route = "supervisor";
      }

      if (registration["supervisor-firstname"]) {
        route = "confirmation";
      }
    }
    const registrationRoute = `/register/${route}`;

    return registrationRoute;
  };

  const loader = async () => {
    const finalRoute = await registrationProgress();
    if (submitted) {
      navigate("/register/confirmation", { replace: true });
    } else if (activeRegistration) {
      navigate(finalRoute, { replace: true });
    } else {
      //function to create a new application
      //qualifyingYears - check if available, and create new with qualifying years populated
      navigate("/register/profile", {
        state: { qualifyingYears },
        replace: true,
      });
    }
  };

  useEffect(() => {
    loader();
  }, []);

  return (
    <>
      <div className="loading">
        <ProgressSpinner />
      </div>
    </>
  );
}
