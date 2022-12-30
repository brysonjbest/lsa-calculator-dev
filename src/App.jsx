import { useRef, useState, useMemo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css";
import { UserContext, RegistrationContext } from "./UserContext";
import { getUserData, getRegistrationData } from "./api/api.services";

export default function App() {
  const [user, setUser] = useState(null);
  const userProvider = useMemo(() => ({ user, setUser }), [user, setUser]);

  const [registration, setRegistration] = useState(null);
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
      .catch(console.error);
  }, []);

  return (
    <UserContext.Provider value={userProvider}>
      <RegistrationContext.Provider value={registrationProvider}>
        <div className="App">
          <Navbar />
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      </RegistrationContext.Provider>
    </UserContext.Provider>
  );
}
