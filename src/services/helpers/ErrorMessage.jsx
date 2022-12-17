export default function getFormErrorMessage(name, id, errors, indexedInfo) {
  const helpid = id ? id : "";
  const category = indexedInfo ? indexedInfo[0] : null;
  const index = indexedInfo ? indexedInfo[1] : null;
  const itemname = indexedInfo ? indexedInfo[2] : null;

  return (
    <>
      {errors[name] ? (
        <small className={`p-error ${helpid}`}>{errors[name].message}</small>
      ) : null}
      {errors[category] &&
      errors[category][index] &&
      errors[category][index][itemname] ? (
        <small className={`p-error ${helpid}`}>
          {errors[category][index][itemname].message}
        </small>
      ) : null}
    </>
  );
}
