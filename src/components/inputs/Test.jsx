// import * as React from "react";
import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";

import { useFormContext, Controller } from "react-hook-form";

export default function Test(props) {
  const methods = useFormContext();
  //   const { control } = useFormContext();

  return (
    <div>
      {/* <input {...methods.register("bill")} />
      <input {...methods.register("bill23")} /> */}
      <div>
        <Controller
          name={`${props.name}firstname`}
          control={methods.control}
          rules={{ required: "Error: First name is required." }}
          render={({ field, fieldState }) => (
            <InputText
              id={`${field.name}`}
              aria-describedby={`firstname-help`}
              {...field}
              className={"form-field block"}
              placeholder={`first name`}
            />
          )}
        />
      </div>
    </div>
  );
}
