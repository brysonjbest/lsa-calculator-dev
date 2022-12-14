import React, { useState } from "react";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ServiceCalculator from "../../components/inputs/ServiceCalculator";
import "./CalculatorPersonal.css";

/**
 * Calculator Splash Page.
 * @param {object} props
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function CalculatorPersonal() {
  const [eligibility, setEligibility] = useState(false);

  const isEligible = (totalYears) => {
    if (totalYears >= 5) {
      setEligibility(true);
    } else {
      setEligibility(false);
    }
  };

  return (
    <div className="calculator-splash">
      <PageHeader
        title="Long Service Awards and Service Pins Eligibility Calculator"
        singleLine
        gradient1
      ></PageHeader>
      <AppPanel header="Calculate Your Eligibility" toggleable collapsed>
        When calculating your eligibility, count the calendar years you’ve been
        in service, don’t worry about the exact months and days. If you have
        worked any portion of a calendar year, it counts as one full year of
        long service recognition time. This tool will help you check your total
        years of service. You can use this calculator to enter your work history
        and apply for your recognition awards in one easy process.
      </AppPanel>
      <AppPanel header="Eligible Service" toggleable collapsed>
        Register for the Long Service Awards if you’ve worked for 25+ years in a
        BC Public Service organization under the BC Public Service Act. Attend a
        Long Service Awards ceremony every five years after you’ve reached 25
        years of service. If you have fewer than 25 years of service, you may be
        eligible for a Service Pin. Long service recognition time is calculated
        differently than seniority and pensionable time. Long service time is
        your total, cumulative years working at an eligible BC Public Service
        organization. Time spent working as a contractor does not count towards
        years of service because contractors are not hired under the BC Public
        Service Act. If you’ve had a break in service, that time may still count
        toward your years of service. Breaks in service include periods of paid
        leave and part-time, auxiliary, or seasonal work. Unpaid leaves of
        absence do not count.
      </AppPanel>

      <AppPanel header="Instructions" toggleable>
        You only need to input YEARS – do not use months or days. Enter your
        start date in the “Start Date” Field and your end date in the “End Date
        Field”. Since service is cumulative, please add additional rows in order
        to account for any breaks in service. Enter each group of continuous
        years on separate lines. For example: If you have been working with no
        breaks in service since 2008, enter “2008” as your start year and the
        current calendar year as your end year. If you worked from 2008 to 2010,
        had a two year break in service and then resumed service in 2012, enter
        “2008” as the start year and “2010” as the end year. Then move to the
        next row and enter “2012” as the start year and current calendar year as
        the end year.
      </AppPanel>

      <AppPanel header="Years of Service">
        <ServiceCalculator formSubmit={isEligible} />
      </AppPanel>

      {eligibility ? (
        <AppPanel header="Congratulations">
          Based on the input in the calculator above, you may be eligible for
          registration for recognition under the Service Pin program. You can
          continue registration by clicking on “Register” below.{" "}
          <AppButton>Register</AppButton>
        </AppPanel>
      ) : null}
    </div>
  );
}
