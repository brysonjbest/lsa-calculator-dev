/**
 * Function returns an error message based on react-hook-form's error object
 * @param {string} name name of the error field
 * @param {object} errors errors object inherited from form values
 * @param {string} category Optional. Required in nested errors. Name of error item within object.
 * @param {integer} index Optional. Required in nested errors. Determine where in the error category the specific error is occuring.
 * @param {string} optionname Optional. Required in nested errors. Locates subname of error.
 * @returns
 */
export default function getFormErrorMessage(
  name,
  errors,
  category = null,
  index = null,
  optionname = null
) {
  const helpid = `${name}-help`;
  const topLevelError = errors[name];
  const nestedExists = errors?.category?.index?.optionname;
  const altNested =
    errors[category] &&
    errors[category][index] &&
    errors[category][index][optionname];

  return (
    <>
      {topLevelError ? (
        <small className={`p-error ${helpid}`}>{errors[name].message}</small>
      ) : null}
      {!topLevelError && (nestedExists || altNested) ? (
        <small className={`p-error ${helpid}`}>
          {errors[category][index][optionname].message}
        </small>
      ) : null}
    </>
  );
}
