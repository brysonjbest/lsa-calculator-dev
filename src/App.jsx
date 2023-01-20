import { useRef, useState, useMemo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SubmittedInfo from "./components/composites/SubmittedInfo";
import "./App.css";
import { UserContext, RegistrationContext, ToastContext } from "./UserContext";
import { getUserData, getRegistrationData } from "./api/api.services";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

export default function App() {
  // const toast = useRef(null);
  const toastProvider = useRef(null);
  const [user, setUser] = useState({ loading: true });
  const userProvider = useMemo(() => ({ user, setUser }), [user, setUser]);

  const [registration, setRegistration] = useState({ loading: true });
  const registrationProvider = useMemo(
    () => ({ registration, setRegistration }),
    [registration, setRegistration]
  );

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserData();
      setUser(data);
    };
    const fetchRegistration = async () => {
      const data = await getRegistrationData(user);
      setRegistration(data);
    };
    fetchUser()
      .then(() => {
        fetchRegistration();
      })
      .catch(console.error)
      .finally(() => {
        setRegistration((state) => ({ ...state, loading: false }));
        setUser((state) => ({ ...state, loading: false }));
      });
  }, []);

  // if (registration["loading"] || user["loading"]) return <ProgressSpinner />;
  if (user["loading"]) return <ProgressSpinner />;

  return (
    <UserContext.Provider value={userProvider}>
      <RegistrationContext.Provider value={registrationProvider}>
        <ToastContext.Provider value={toastProvider}>
          <div className="App">
            <Navbar />
            <div className="main-content">
              <Toast ref={toastProvider} />
              {/* {!registration["loading"] ? (
                <Outlet />
              ) : (
                <div className="loading-modal">
                  <ProgressSpinner />
                </div>
              )} */}
              <Outlet />
              {registration["loading"] ? (
                <div className="loading-modal">
                  <ProgressSpinner />
                </div>
              ) : null}
            </div>
          </div>
        </ToastContext.Provider>
      </RegistrationContext.Provider>
    </UserContext.Provider>
  );
}
