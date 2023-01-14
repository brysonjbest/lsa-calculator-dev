import { useRef, useState, useMemo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css";
import { UserContext, RegistrationContext } from "./UserContext";
import { getUserData, getRegistrationData } from "./api/api.services";

import { ProgressSpinner } from "primereact/progressspinner";
 

export default function App() {
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
        <div className="App">
          <Navbar />
          {!registration["loading"] ? (
            <div className="main-content">
              <Outlet />
            </div>
          ) : (
            <ProgressSpinner />
          )}
        </div>
      </RegistrationContext.Provider>
    </UserContext.Provider>
  );
}
