import React, { useContext, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocation, useNavigate, redirect } from "react-router";
import { UserContext, RegistrationContext } from "../../UserContext";

export default function RegistrationHandler() {
  const { registration, setRegistration } = useContext(RegistrationContext);
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state;
  const qualifyingYears = stateData && stateData.years ? stateData.years : null;
  console.log(qualifyingYears, "this is qualifying years");

  const submittedRegistration =
    registration && registration.submitted ? registration.submitted : null;
  //update with check for truly active based on what api would return - probably null?
  const activeRegistration = JSON.stringify(registration) !== "{}";
  console.log(activeRegistration, "is this active?");

  //to update routing when api routes are finalized - should take into account what has been submitted and send to page that requires completion
  //routing on pages will also need to verify that the data exists before allowing someone to visit the page

  const registrationProgress = async () => {
    let route = `profile`;
    const registrationRoute = `/register/${route}`;
    if (registration) {
      const progress = Object.keys(registration).length;
      //temp routing
      if (progress > 7) route = "milestone";
      if (progress > 8) route = "details";
      if (progress > 9) route = "award";
      if (progress > 10) route = "supervisor";
      if (progress > 11) route = "confirmation";
    }
    console.log(registrationRoute, "this is route");
    return registrationRoute;
  };

  const loader = async () => {
    const finalRoute = await registrationProgress();
    if (submittedRegistration) {
      navigate("/register/confirmation", { replace: true });
    }
    // else if (activeRegistration) {
    //   navigate(finalRoute, { replace: true });
    // }
    else {
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
      <div>{qualifyingYears} Test</div>
      <div className="loading">
        <ProgressSpinner />
      </div>
    </>
  );
}
