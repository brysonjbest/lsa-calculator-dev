import PageHeader from "../common/PageHeader";
import AppButton from "../common/AppButton";
import AppPanel from "../common/AppPanel";
import { useNavigate } from "react-router-dom";

/**
 * Page Header custom component card block
 * @param {object} props
 * @param {boolean} props.title state variable boolean for controlling if header should only be one line
 * @param {boolean} props.subtitle state variable boolean for controlling if header should only be one line
 * @returns
 */

export default function SubmittedInfo(props) {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Registration" subtitle={props.subtitle}></PageHeader>

      <AppPanel header={`${props.title} - Submitted`}>
        <div>
          You have already submitted your registration for this year. Please
          review your application details here:
        </div>
        <div>
          <AppButton
            onClick={() => {
              navigate("/register/confirmation");
            }}
          >
            Confirmation Page
          </AppButton>
        </div>
        <div>
          If you believe you are seeing this message in error, please contact
          support.
        </div>
      </AppPanel>
    </div>
  );
}
