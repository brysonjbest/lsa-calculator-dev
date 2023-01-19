import React, { useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";

import AppButton from "../common/AppButton";
import { useFormContext } from "react-hook-form";
import getFormErrorMessage from "../../services/helpers/ErrorMessage";

import classNames from "classnames";
import "./AwardSelector.css";
import GalleryDisplay from "../common/GalleryDisplay";
import PecsfForm from "./PecsfForm";
import AwardForm from "./AwardForm";

/**
 * Award Selection Component.
 * @param {object} props
 * @returns
 */

export default function AwardSelector(props) {
  const [availableAwards, setAvailableAwards] = useState([]);

  const [awardOptions, setAwardOptions] = useState({});
  const [awardDialog, setAwardDialog] = useState(false);
  const [awardChosen, setAwardChosen] = useState("");
  const [formChanged, setFormChanged] = useState(false);

  const methods = useFormContext();
  const errors = props.errors;
  const {
    control,
    setValue,
    clearErrors,
    resetField,
    getValues,
    watch,
    handleSubmit,
    formState: { isDirty, isValid },
  } = methods;

  watch(() => setFormChanged(true));

  const renderAwardOptions = (data) => {
    // console.log(data, "this is data selected");
    const options = data.options || [];
    const pecsfOptions = data.name
      ? data.name.toLowerCase().includes("pecsf")
      : false;
    const listOptions = options.map((option, index) => (
      <div key={index}>
        <li className="award-option-block">
          <label
            htmlFor={option.name}
            className={classNames("block", {
              "p-error": errors[option.name],
            })}
          >
            {option.description}
          </label>
          <AwardForm errors={errors} option={option} />
          {getFormErrorMessage(
            `${option.name}`,
            `${option.name}-help`,
            errors,
            ["awardoptions", 0, option.name]
          )}
        </li>
      </div>
    ));
    return (
      <div>
        <div className="award-selection-options">
          <h2>{data.description}</h2>
          <div className="award-title-block">
            {!pecsfOptions ? (
              <img
                src={`${data.image_url}`}
                onError={(e) =>
                  (e.target.src =
                    "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
                }
                alt={data.name}
              />
            ) : null}
          </div>
          <ul className="options-list">
            {pecsfOptions ? <PecsfForm errors={props.errors} /> : listOptions}
          </ul>
          <div className="options-list-action">
            <AppButton
              // disabled={!isValid}
              onClick={handleSubmit(() => {
                // e.preventDefault();
                props.submitAward ? props.submitAward(data) : null;
                // props.submitAward ? props.submitAward(data.id) : null;

                // props.submitAward ? props.submitAward(e, data.id) : null;

                // if (isValid) {
                setValue("awardID", data.id);
                setValue("awardname", data.name);
                setValue("awarddescription", data.description);
                setAwardDialog(false);
                setAwardChosen(data.id);
                // }
              })}
            >
              Select Award
            </AppButton>
          </div>
        </div>
      </div>
    );
  };

  const awardSelect = (itemID) => {
    setAwardDialog(true);
    const awardLookup = availableAwards.filter(function (item) {
      return item.id === itemID;
    });
    setAwardOptions(awardLookup[0]);
    // const defaultOptions = awardLookup[0].options.map((option) => {
    //   const name = option.name;
    //   return { [name]: "" };
    // });
    // console.log(defaultOptions, "this should be all options");

    // setValue([{ awardoptions: defaultOptions }]);

    // console.log(itemID, "this is selected", awardLookup);

    // return;
  };

  const awardHide = () => {
    setAwardDialog(false);
    setAwardOptions([]);
    //currently fully resets - will have to be selective
    setValue("awardoptions", []);

    // console.log("this is deselected");
  };

  const optionDisplay = renderAwardOptions(awardOptions);

  useEffect(() => {
    setAvailableAwards(props.awards);
  }, [props.awards]);

  useEffect(() => {
    setAwardChosen(props.chosenAward);
  }, [props.chosenAward]);

  return (
    <div className={`award-selection-form`}>
      <GalleryDisplay
        onClick={awardSelect}
        header="Award Options"
        itemSet={availableAwards}
        // chosenAward={props.award}
        chosenAward={awardChosen}
      />

      <Dialog
        visible={awardDialog}
        onHide={() => awardHide()}
        maximizable
        modal
        style={{ minWidth: "fit-content", width: "50vw" }}
        breakpoints={{ "960px": "75vw" }}
      >
        <div className="award-selection-dialog">{optionDisplay}</div>
      </Dialog>
    </div>
  );
}
