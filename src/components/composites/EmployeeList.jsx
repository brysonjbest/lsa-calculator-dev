import React, { useState } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  useWatch,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import ContactDetails from "../../components/inputs/ContactDetails";
import MilestoneSelector from "../../components/inputs/MilestoneSelector";

const EmployeeList = ({ errors }) => {
  const { control } = useFormContext();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "employee",
  });

  const [employees, setEmployees] = useState({});

  const onChange = (id, ministry) => {
    setEmployees({ ...employees, [id]: ministry });
  };

  console.log(errors, "this is in employee list");

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
                  // delegated
                  ministryRef={onChange}
                  index={item.id}
                  //   panelName={`employee ${index + 1}`}
                  panelName={`employee`}
                  itemNumber={index + 1}
                  errors={errors}
                />
                {/* <MilestoneSelector
                delegated
                ministry={employees[item.id]}
                panelName={`employee ${index + 1}`}
                errors={errors}
              /> */}
              </AppPanel>
            </li>
          );
        })}
      </ul>
      <AppButton
        info
        onClick={() => {
          append({ firstname: "", lastname: "", governmentemail: "" });
        }}
      >
        Add Another Employee
      </AppButton>
    </>
  );
};

export default EmployeeList;
