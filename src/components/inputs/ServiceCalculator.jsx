import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";

import formServices from "../../services/settings.services";
import classNames from "classnames";
import "./ServiceCalculator.css";

/**
 * Address Input reusable component. Conditional PO Box requirement for address's identified for supervisors.
 * @param {object} props
 * @param {ref} props.submitReference reference for form submission to be handled by parent component
 * @param {boolean} props.basic state variable boolean for controlling if basic fields are displayed
 * @param {boolean} props.extended state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.personalContact state variable boolean for controlling if personal contact information displayed
 * @param {string} props.panelName string describing what panel these contact details belong to ex: Supervisor, Personal
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function ServiceCalculator() {
  const { register, control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      serviceCalculator: [{ startYear: "", endYear: "", years: "" }],
    },
  });
  const [formValues, setFormValues] = useState([
    { field: "startYear", value: "" },
    { field: "endYear", value: "" },
    { field: "years", value: "" },
  ]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceCalculator",
  });

  const onSubmit = (data) => console.log("data", data);

  const ConditionalInput = ({ control, index, field }) => {
    const value = useWatch({
      name: "serviceCalculator",
      control,
    })[index];

    console.log(value, "this is value");
    const startYear = value.startYear
      ? value.startYear.getFullYear()
      : new Date().getFullYear();
    const endYear = value.endYear
      ? value.endYear.getFullYear()
      : new Date().getFullYear();

    let totalYears = endYear - startYear <= -1 ? 0 : endYear - startYear;

    return (
      <Controller
        name={`serviceCalculator.${index}.years`}
        control={control}
        render={({ field }) => (
          <InputText
            readOnly
            id={field.name}
            value={totalYears}
            placeholder="0"
          />
        )}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Service Calculator</h1>
      <ul>
        {fields.map((item, index) => {
          return (
            <li key={item.id}>
              <div className="service-calculator-fields">
                <div className="start-date-column">
                  <label htmlFor="startYear">Start Year</label>
                  <span className="p-float-label">
                    <Controller
                      name={`serviceCalculator.${index}.startYear`}
                      control={control}
                      render={({ field }) => (
                        <Calendar
                          id={field.name}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.value);
                          }}
                          view="year"
                          dateFormat="yy"
                          mask="9999"
                          showIcon
                        />
                      )}
                    />
                  </span>
                </div>
                <div className="end-date-column">
                  <label htmlFor="endYear">End Year</label>

                  <span className="p-float-label">
                    <Controller
                      name={`serviceCalculator.${index}.endYear`}
                      control={control}
                      render={({ field }) => (
                        <Calendar
                          id={field.name}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.value);
                          }}
                          view="year"
                          dateFormat="yy"
                          mask="9999"
                          showIcon
                        />
                      )}
                    />
                  </span>
                </div>
                <div className="year-calculation-column">
                  <label htmlFor="yearCalculation">Years of Service:</label>
                  <span className="p-float-label">
                    <ConditionalInput
                      key={item.id}
                      {...{ control, index, item }}
                    />
                  </span>
                </div>
                <button
                  className="service-years-delete-row"
                  type="button"
                  onClick={() => remove(index)}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <section>
        <div>{/* <Calculator control={control} setValue={setValue} /> */}</div>
        <button
          type="button"
          onClick={() => {
            append({ startYear: "", endYear: "", years: "" });
          }}
        >
          Add Row
        </button>

        <button
          type="button"
          onClick={() =>
            reset({
              serviceCalculator: [{ startYear: "", endYear: "" }],
            })
          }
        >
          Reset Calculator
        </button>
      </section>

      <input type="submit" />
    </form>
  );
}
