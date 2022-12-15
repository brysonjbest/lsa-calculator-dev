import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import "./ServiceCalculator.css";
import AppButton from "../common/AppButton";
import InfoToolTip from "../common/InfoToolTip";

/**
 * Service Calculator component calculates years of service from given year inputs.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function ServiceCalculator(props) {
  const [yearsArray, setYearsArray] = useState([]);
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      serviceCalculator: [{ startYear: "", endYear: "", years: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceCalculator",
  });

  const onSubmit = (data) => {
    const yearSet = [];
    data["serviceCalculator"].forEach((element) => {
      const startYear = element["startYear"]
        ? element["startYear"].getFullYear()
        : 0;
      const endYear = element["endYear"]
        ? element["endYear"].getFullYear()
        : startYear;
      for (let i = startYear; i <= endYear; i++) {
        yearSet.push(i);
      }
    });

    const finalYears = [...new Set(yearSet)].length;

    props.formSubmit ? props.formSubmit(finalYears) : null;
  };

  const YearCalculator = (index) => {
    const start = getValues(`serviceCalculator.${index}.startYear`);
    const end = getValues(`serviceCalculator.${index}.endYear`);
    const startYear = start ? start.getFullYear() : new Date().getFullYear();
    const endYear = end
      ? end.getFullYear()
      : start.getFullYear() || new Date().getFullYear();
    let lineItemYearsTotal =
      endYear - startYear <= -1 ? 0 : endYear - startYear + 1;
    setValue(`serviceCalculator.${index}.years`, lineItemYearsTotal);
  };

  const TotalYears = ({ control }) => {
    const value = useWatch({
      name: "serviceCalculator",
      control,
    });
    const yearSet = [];
    value.forEach((element) => {
      const startYear = element["startYear"]
        ? element["startYear"].getFullYear()
        : 0;
      const endYear = element["endYear"]
        ? element["endYear"].getFullYear()
        : startYear;
      for (let i = startYear; i <= endYear; i++) {
        i !== 0 ? yearSet.push(i) : null;
      }
    });

    const finalYears = [...new Set(yearSet)].length;

    return <>{finalYears || 0}</>;
  };

  return (
    <div
      onSubmit={handleSubmit(onSubmit)}
      className="service-calculator-component"
    >
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
                          minDate={new Date(1930, 0, 0, 0, 0, 0, 0)}
                          maxDate={new Date()}
                          readOnlyInput
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
                          minDate={new Date(1930, 0, 0, 0, 0, 0, 0)}
                          maxDate={new Date()}
                          readOnlyInput
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
                <div className="service-calculator-delete-column">
                  {index !== 0 ? (
                    <AppButton
                      className="service-years-delete-row-button"
                      passClass="p-button-raised p-button-rounded"
                      icon="pi pi-times-circle"
                      danger
                      onClick={() => remove(index)}
                    >
                      Delete
                    </AppButton>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <section>
        <div className="total-years-counter">
          <span>
            Total Years: <TotalYears key="total-count" {...{ control }} />
          </span>
          <InfoToolTip
            target="total-years-counter"
            content="Total Year count may differ from years of service per row, as duplicated years are only counted once."
          />
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

      <input type="submit" onClick={handleSubmit(onSubmit)} />
    </div>
  );
}
