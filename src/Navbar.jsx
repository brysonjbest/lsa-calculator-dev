import { Link } from "react-router-dom";
import { Menu } from "primereact/menu";
import { useRef, useContext } from "react";
import "./Navbar.css";
import AppButton from "./components/common/AppButton";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const dropdown = useRef(null);
  const { user } = useContext(UserContext);
  const pages = [
    {
      label: "Calculator Landing",
      template: () => {
        return (
          <Link to="/calculator" className="p-menuitem-link">
            Calculator Landing
          </Link>
        );
      },
    },
    {
      label: "Calculator Delegated",
      template: () => {
        return (
          <Link to="/delegated" className="p-menuitem-link">
            Calculator Delegated
          </Link>
        );
      },
    },
    {
      label: "Calculator Personal",
      template: () => {
        return (
          <Link to="/personal" className="p-menuitem-link">
            Calculator Personal
          </Link>
        );
      },
    },
    {
      label: "Self-Registration",
      items: [
        {
          label: "Registration Start",
          template: () => {
            return (
              <Link to="/register/profile" className="p-menuitem-link">
                Registration Start
              </Link>
            );
          },
        },
        {
          label: "Milestones",
          template: () => {
            return (
              <Link to="/register/milestone" className="p-menuitem-link">
                Milestone Selection
              </Link>
            );
          },
        },
        {
          label: "Profile Details",
          template: () => {
            return (
              <Link to="/register/details" className="p-menuitem-link">
                Personal Profile Details
              </Link>
            );
          },
        },
        {
          label: "Award Selection",
          template: () => {
            return (
              <Link to="/register/award" className="p-menuitem-link">
                Award Selection
              </Link>
            );
          },
        },
        {
          label: "Supervisor Details",
          template: () => {
            return (
              <Link to="/register/supervisor" className="p-menuitem-link">
                Supervisor Details
              </Link>
            );
          },
        },
        {
          label: "Registration Confirmation",
          template: () => {
            return (
              <Link to="/register/confirmation" className="p-menuitem-link">
                Registration Confirmation
              </Link>
            );
          },
        },
      ],
    },
  ];

  return (
    <>
      <nav className="navbar">
        <ul>
          <div>
            <li className="service-awards-logo">
              <Link to="/">LONG SERVICE AWARDS</Link>
            </li>
            <li className="navigation-item">
              <Link to="/">Home</Link>
            </li>
            <li className="navigation-item">
              <a
                href="https://longserviceawards.gww.gov.bc.ca/"
                target={"_blank"}
              >
                About
              </a>
            </li>
          </div>
          <div>
            <li style={{ float: "right !important" }}>
              <Menu model={pages} popup ref={dropdown} id="navbar-dropdown" />
              <AppButton
                icon="pi pi-bars"
                onClick={(event) => dropdown.current.toggle(event)}
                aria-controls="navbar-dropdown"
                aria-haspopup
              >
                {user ? user.idir : "IDIR"}
              </AppButton>
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
