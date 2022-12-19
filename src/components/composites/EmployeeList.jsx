import React, { useState, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import ContactDetails from "../../components/inputs/ContactDetails";
import MilestoneSelector from "../../components/inputs/MilestoneSelector";

const EmployeeList = ({ errors }) => {
  const { control, reset } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employee",
  });

  const [employees, setEmployees] = useState({});
  const [resetList, setResetList] = useState(false);

  useEffect(() => {
    reset({
      employee: [
        {
          firstname: "",
          lastname: "",
          governmentemail: "",
          employeenumber: "",
          ministryorganization: null,
          yearsofservice: "",
          currentmilestone: "",
          qualifyingyear: "",
          priormilestones: "",
        },
      ],
    });
  }, [resetList]);

  const onChange = (id, ministry) => {
    setEmployees({ ...employees, [id]: ministry });
  };

  return (
    <>
      <ul>
        {fields?.map((item, index) => {
          return (
            <li key={item.id}>
              <AppPanel
                header={
                  <div className="employee-header-bar">
                    <span className="employee-header-text">
                      Employee {index + 1}
                    </span>
                    {index !== 0 ? (
                      <AppButton
                        className="employee-add-delete-button"
                        passClass="p-button-raised p-button-rounded"
                        icon="pi pi-times-circle"
                        danger
                        onClick={() => {
                          remove(index);
                        }}
                      ></AppButton>
                    ) : null}
                  </div>
                }
              >
                <ContactDetails
                  basic
                  delegated
                  ministryRef={onChange}
                  index={item.id}
                  panelName={`employee`}
                  itemNumber={index + 1}
                  errors={errors}
                />
                <MilestoneSelector
                  delegated
                  selfregister
                  ministry={employees[item.id]}
                  index={item.id}
                  panelName={`employee`}
                  itemNumber={index + 1}
                  errors={errors}
                />
              </AppPanel>
            </li>
          );
        })}
      </ul>
      <div className="employee-list-options">
        <AppButton
          info
          onClick={() => {
            append({
              firstname: "",
              lastname: "",
              governmentemail: "",
              employeenumber: "",
              ministryorganization: null,
              yearsofservice: "",
              currentmilestone: "",
              qualifyingyear: "",
              priormilestones: "",
            });
          }}
        >
          Add Another Employee
        </AppButton>
        <AppButton danger onClick={() => setResetList(!resetList)}>
          Reset Employees
        </AppButton>
      </div>
    </>
  );
};

export default EmployeeList;
