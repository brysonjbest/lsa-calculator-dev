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
import InfoToolTip from "../common/InfoToolTip";

/**
 * Award Selection Component.
 * @param {object} props
 * @param {string} props.milestone The milestone year of the available awards.
 * @param {Array} props.awards Array of award items that populate the available awards options in the gallery
 * @param {string} props.chosenAward The id of the chosen award.
 * @param {()=> void} props.submitAward callback to run on award selection
 * @param {object} props.errors Inherited errors object from higher level form control
 * @returns
 */

export default function AwardSelector({
  milestone,
  awards,
  chosenAward,
  submitAward,
  errors,
}) {
  const [availableAwards, setAvailableAwards] = useState([]);
  const [awardOptions, setAwardOptions] = useState({});
  const [awardChosen, setAwardChosen] = useState("");
  const [awardDialog, setAwardDialog] = useState(false);

  const methods = useFormContext();
  const { setValue, handleSubmit } = methods;

  const renderAwardOptions = (data) => {
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
            errors,
            "award_options",
            0,
            option.name
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
            {pecsfOptions ? <PecsfForm errors={errors} /> : listOptions}
          </ul>
          <div className="options-list-action">
            <AppButton
              onClick={handleSubmit(() => {
                submitAward ? submitAward(data) : null;
                setValue("awards.0.award.id", data.id);
                setValue("awards.0.award.label", data.label);
                setValue("awards.0.award.description", data.description);
                setAwardDialog(false);
                setAwardChosen(data.id);
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
  };

  const awardHide = () => {
    setAwardDialog(false);
    setAwardOptions([]);
    setValue("awards.0.award.award_options", []);
  };

  const optionDisplay = renderAwardOptions(awardOptions);

  useEffect(() => {
    setAvailableAwards(awards);
  }, [awards]);

  useEffect(() => {
    setAwardChosen(chosenAward);
  }, [chosenAward]);

  const milestoneYear = milestone
    ? `Current Milestone - ${milestone} Years`
    : "";

  return (
    <div className={`award-selection-form`}>
      <GalleryDisplay
        onClick={awardSelect}
        header={
          <>
            <span>Award Options: {milestoneYear}</span>
            <InfoToolTip
              target="award-selection-form"
              content="As a LSA recipient, you are eligible to select an award for your current milestone. Please select from the available options below."
              position="top"
            />
          </>
        }
        itemSet={availableAwards}
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
