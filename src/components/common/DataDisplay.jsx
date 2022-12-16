import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
//temporary use of apiservices to pull in example data for formatting prior to api being ready - to reformat when doing api proper
import { UserService } from "../../services/api-routes.services";
import formServices from "../../services/settings.services";
import "./DataDisplay.css";

/**
 * Data Display common display component to display user data after input/submission
 * @param {object} props
 * @param {array} props.data array object of data to display in data table
 * @param {string} props.category determines the formfield options that should be selected (options: contact, address, milestone, award, lsa, delegated)
 * @param {boolean} props.stacked boolean that determines if data table will be forced into permanent stacked layout, or will be responsive
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function DataDisplay(props) {
  const formField = `${props.category}FormFields`;
  const columns = props.category ? formServices.get(formField) : [];

  const dynamicColumns = columns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} />;
  });

  //Temporary code for use in managing userdata; userdata should be passed by props.data
  const [userData, setUserData] = useState([]);
  const userService = new UserService();

  useEffect(() => {
    const testData = userService.getTestUserData();
    userService.getTestUserData().then((data) => {
      setUserData(data);
    });

    setUserData(testData);
    // userService.getUserData().then((data) => setUserData(data));
  }, []);

  return (
    <div>
      <div className="card">
        <DataTable
          value={userData}
          responsiveLayout="stack"
          breakpoint={props.stacked ? "100vw" : "960px"}
        >
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
}
