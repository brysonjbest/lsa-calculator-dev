import { Outlet, Link } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { useRef } from "react";
import "./Navbar.css";
import AppButton from "./components/common/AppButton";

const Navbar = () => {
  const dropdown = useRef(null);
  const pages = [
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
                IDIR
              </AppButton>
            </li>
          </div>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;