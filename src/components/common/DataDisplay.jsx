import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
//temporary use of apiservices to pull in example data for formatting prior to api being ready - to reformat when doing api proper
import { UserService } from "../../services/api.services";
import formServices from "../../services/settings.services";
import "./DataDisplay.css";

/**
 * Data Display common display component to display user data after input/submission
 * @param {object} props
 * @param {object} props.data object of data to display in data table
 * @param {string} props.identifier if object contains nested array, the string name identifier for that array
 * @param {string} props.category determines the formfield options that should be selected (options: contact, address, milestone, award, lsa, delegated)
 * @param {boolean} props.stacked boolean that determines if data table will be forced into permanent stacked layout, or will be responsive
 * @param {() => void} props.callback function to execute on data prior to display
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function DataDisplay(props) {
  const formField = `${props.category}FormFields`;
  const columns = props.category ? formServices.get(formField) : [];

  const ministryOrgLookup = (rowData) => {
    return rowData.ministryorganization
      ? formServices.lookup("organizations", rowData.ministryorganization) ||
          formServices.lookup(
            "currentPinsOnlyOrganizations",
            rowData.ministryorganization
          )
      : null;
  };

  const dynamicColumns = columns.map((col, i) => {
    if (col.field === "ministryorganization") {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={ministryOrgLookup}
        />
      );
    } else if (col.body) {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={col.body}
        />
      );
    } else {
      return <Column key={col.field} field={col.field} header={col.header} />;
    }
  });

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const userData = props.identifier
      ? [...props.data[props.identifier]]
      : [...props.data];
    // props.callback ? props.callback(userData) : null;
    setUserData(userData);
  }, [props.data]);

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
