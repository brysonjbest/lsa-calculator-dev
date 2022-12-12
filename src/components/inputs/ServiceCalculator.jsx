import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import "./ServiceCalculator.css";

/**
 * Service Calculator component calculates years of service from given year inputs.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function ServiceCalculator() {
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
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

  const YearCalculator = (index) => {
    const start = getValues(`serviceCalculator.${index}.startYear`);
    const end = getValues(`serviceCalculator.${index}.endYear`);
    const startYear = start ? start.getFullYear() : new Date().getFullYear();
    const endYear = end ? end.getFullYear() : new Date().getFullYear();
    let lineItemYearsTotal =
      endYear - startYear <= -1 ? 0 : endYear - startYear;
    setValue(`serviceCalculator.${index}.years`, lineItemYearsTotal);
  };

  const TotalYears = ({ control }) => {
    const value = useWatch({
      name: "serviceCalculator",
      control,
    });

    const defaultYears = 0;
    const mapYears = value.map((each) => each["years"]);
    const testYears = mapYears.reduce(
      (total, each) => total + each,
      defaultYears
    );

    return <>{testYears}</>;
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
                            YearCalculator(index);
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
                            YearCalculator(index);
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
                    <Controller
                      name={`serviceCalculator.${index}.years`}
                      control={control}
                      render={({ field }) => (
                        <InputText
                          readOnly
                          id={field.name}
                          value={field.value}
                          placeholder="0"
                        />
                      )}
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
        <div>
          <span>Total Years: </span>
          <TotalYears key="total-count" {...{ control }} />
        </div>
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
