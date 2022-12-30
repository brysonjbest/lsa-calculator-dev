import React from "react";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import { useNavigate } from "react-router";
import "./CalculatorLanding.css";

/**
 * Calculator Splash Page.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function CalculatorLanding() {
  const navigate = useNavigate();
  return (
    <>
      <div className="calculator-splash">
        <PageHeader
          title="Long Service Awards and Service Pins Eligibility Calculator"
          singleLine
          gradient1
        ></PageHeader>
        <AppPanel header="Calculate Your Eligibility" toggleable>
          When calculating your eligibility, count the calendar years you’ve
          been in service, don’t worry about the exact months and days. If you
          have worked any portion of a calendar year, it counts as one full year
          of long service recognition time. This tool will help you check your
          total years of service. You can use this calculator to enter your work
          history and apply for your recognition awards in one easy process.
        </AppPanel>
        <AppPanel header="Eligible Service" toggleable>
          Register for the Long Service Awards if you’ve worked for 25+ years in
          a BC Public Service organization under the BC Public Service Act.
          Attend a Long Service Awards ceremony every five years after you’ve
          reached 25 years of service. If you have fewer than 25 years of
          service, you may be eligible for a Service Pin. Long service
          recognition time is calculated differently than seniority and
          pensionable time. Long service time is your total, cumulative years
          working at an eligible BC Public Service organization. Time spent
          working as a contractor does not count towards years of service
          because contractors are not hired under the BC Public Service Act. If
          you’ve had a break in service, that time may still count toward your
          years of service. Breaks in service include periods of paid leave and
          part-time, auxiliary, or seasonal work. Unpaid leaves of absence do
          not count.
        </AppPanel>

        <AppPanel
          header="Delegated Calculations - Supervisors"
          toggleable
          collapsed
        >
          Supervisors may use this tool to calculate their employee’s
          eligibility for awards. This tool will allow you to enter your
          employees’ information and register them for their recognition awards.
          Employees will be sent a link to their completed registration and must
          confirm the information entered and consent to receipt of recognition
          awards.
        </AppPanel>
        <AppButton info onClick={() => navigate("/delegated")}>
          Calculate Eligiblity And Register for Someone Else
        </AppButton>
        <AppButton onClick={() => navigate("/personal")}>
          Calculate My Eligibility
        </AppButton>
      </div>
    </>
  );
}
