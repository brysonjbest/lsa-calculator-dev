/*!
 * Form services/utilities (React)
 * File: forms.services.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

const schemaData = {
  organizations: [
    { value: "org-1", text: "BC Public Service Agency" },
    { value: "org-2", text: "Environmental Assessment Office" },
    {
      value: "org-3",
      text: "Government Communications and Public Engagement",
    },
    {
      value: "org-4",
      text: "Ministry of Advanced Education and Skills Training",
    },
    { value: "org-5", text: "Ministry of Agriculture and Food" },
    {
      value: "org-6",
      text: "Ministry of Attorney General and Responsible for Housing",
    },
    { value: "org-7", text: "Ministry of Children and Family Development" },
    { value: "org-8", text: "Ministry of Citizens’ Services" },
    { value: "org-9", text: "Ministry of Education and Child Care" },
    {
      value: "org-10",
      text: "Ministry of Energy, Mines and Low Carbon Innovation",
    },
    {
      value: "org-11",
      text: "Ministry of Environment and Climate Change Strategy",
    },
    { value: "org-12", text: "Ministry of Finance" },
    {
      value: "org-13",
      text: "Ministry of Forests",
    },
    { value: "org-14", text: "Ministry of Health" },
    {
      value: "org-15",
      text: "Ministry of Indigenous Relations and Reconciliation",
    },
    {
      value: "org-16",
      text: "Ministry of Jobs, Economic Recovery and Innovation",
    },
    { value: "org-17", text: "Ministry of Labour" },
    {
      value: "org-18",
      text: "Ministry of Land, Water and Resource Stewardship",
    },
    { value: "org-19", text: "Ministry of Mental Health and Addictions" },
    { value: "org-20", text: "Ministry of Municipal Affairs" },
    {
      value: "org-21",
      text: "Ministry of Public Safety and Solicitor General and Emergency B.C.",
    },
    {
      value: "org-22",
      text: "Ministry of Social Development & Poverty Reduction",
    },
    { value: "org-23", text: "Ministry of Tourism, Arts, Culture and Sport" },
    { value: "org-24", text: "Ministry of Transportation & Infrastructure" },
    { value: "org-25", text: "Office of the Premier" },
  ],
  milestones: [
    { value: 5, text: "5 years" },
    { value: 10, text: "10 years" },
    { value: 15, text: "15 years" },
    { value: 20, text: "20 years" },
    { value: 25, text: "25 years" },
    { value: 30, text: "30 years" },
    { value: 35, text: "35 years" },
    { value: 40, text: "40 years" },
    { value: 45, text: "45 years" },
    { value: 50, text: "50 years" },
  ],
  currentPinsOnlyOrganizations: [
    {
      value: "org-26",
      text: "Ministry of Environment and Climate Change Strategy",
    },
    {
      value: "org-27",
      text: "Ministry of Lands, Water and Resource Stewardship",
    },
    { value: "org-28", text: "Agricultural Land Commission" },
    { value: "org-29", text: "BC Arts Council" },
    { value: "org-30", text: "BC Farm Industry Review Board" },
    { value: "org-31", text: "BC Financial Services Authority" },
    { value: "org-32", text: "BC Human Rights Tribunal" },
    { value: "org-33", text: "BC Review Board" },
    { value: "org-34", text: "BC Transportation Financing Authority" },
    { value: "org-35", text: "Board Resourcing and Development Office" },
    { value: "org-36", text: "Civil Resolution Tribunal" },
    {
      value: "org-37",
      text: "Community Care and Assisted Living Appeal Board",
    },
    { value: "org-38", text: "Coroners Service of BC" },
    { value: "org-39", text: "Crown Agencies Resource Office" },
    { value: "org-40", text: "Employment and Assistance Appeal Tribunal" },
    { value: "org-41", text: "Environmental Appeal Board" },
    { value: "org-42", text: "Financial Services Tribunal" },
    { value: "org-43", text: "Forest Appeals Commission" },
    { value: "org-44", text: "Forest Practices Board" },
    {
      value: "org-45",
      text: "Government Communications and Public Engagement",
    },
    { value: "org-46", text: "Government House" },
    { value: "org-47", text: "Health Professions Review Board" },
    { value: "org-48", text: "Healthlink BC" },
    { value: "org-49", text: "Hospital Appeal Board" },
    { value: "org-50", text: "Independent Investigations Office" },
    { value: "org-51", text: "Intergovernmental Relations Secretariat" },
    { value: "org-52", text: "Islands Trust" },
    { value: "org-53", text: "King's Printer" },
    { value: "org-54", text: "Legislative Assembly of British Columbia" },
    { value: "org-55", text: "Mental Health Review Board" },
    { value: "org-56", text: "Office of the Auditor General" },
    {
      value: "org-57",
      text: "Office of the Auditor General for Local Government",
    },
    { value: "org-58", text: "Office of the Container Trucking Commissioner" },
    { value: "org-59", text: "Office of the Fire Commissioner" },
    { value: "org-60", text: "Office of the Premier" },
    {
      value: "org-61",
      text: "Office of the Representative for Children and Youth",
    },
    { value: "org-62", text: "Oil and Gas Appeal Tribunal" },
    { value: "org-63", text: "Passenger Transportation Board" },
    { value: "org-64", text: "Property Assessment Appeal Board" },
    { value: "org-65", text: "Provincial Court" },
    { value: "org-66", text: "Public Sector Employers' Council Secretariat" },
    { value: "org-67", text: "Registrar of Lobbyists" },
    { value: "org-68", text: "Royal BC Museum" },
    { value: "org-69", text: "Safety Standards Appeal Board" },
    { value: "org-70", text: "Surface Rights Board of British Columbia" },
    { value: "org-71", text: "Workers' Compensation Appeal Tribunal" },
  ],
  profileFormFields: [
    { field: "firstname", header: "First Name" },
    { field: "lastname", header: "Last Name" },
    { field: "governmentemail", header: "Government Email" },
    { field: "governmentphone", header: "Government Phone Number" },
    { field: "employeenumber", header: "Employee Number" },
    {
      field: "ministryorganization",
      header: "Ministry / Organization",
    },
    { field: "branch", header: "Branch" },
  ],
  milestoneFormFields: [
    { field: "yearsofservice", header: "Current Years of Service" },
    { field: "currentmilestone", header: "Current Milestone" },
    { field: "qualifyingyear", header: "Milestone Qualifying Year" },
    {
      field: "priormilestones",
      header: "Prior Unclaimed Milestones",
      body: (rowData) => {
        return rowData.priormilestones
          ? rowData.priormilestones.map((each) => `${each} years `)
          : null;
      },
    },
  ],
  personalContactFormFields: [
    { field: "personalphone", header: "Personal Phone Number" },
    { field: "personalemail", header: "Alternate Email Address" },
    { field: "streetaddress", header: "Address Line 1" },
    { field: "streetaddress2", header: "Address Line 2" },
    { field: "citycommunity", header: "City / Community" },
    { field: "provincestate", header: "Province / State" },
    { field: "postalcode", header: "Postal Code" },
  ],
  officeFormFields: [
    { field: "streetaddress", header: "Address Line 1" },
    { field: "streetaddress2", header: "Address Line 2" },
    { field: "citycommunity", header: "City / Community" },
    { field: "postalcode", header: "Postal Code" },
  ],
  supervisorFormFields: [
    { field: "firstname", header: "First Name" },
    { field: "lastname", header: "Last Name" },
    { field: "governmentemail", header: "Government Email" },
    { field: "streetaddress", header: "Address Line 1" },
    { field: "streetaddress2", header: "Address Line 2" },
    { field: "citycommunity", header: "City / Community" },
    { field: "postalcode", header: "Postal Code" },
    { field: "pobox", header: "P.O. Box" },
  ],
  lsaFormFields: [
    { field: "retiringcurrentyear", header: "I Plan to Retire This Year" },
    { field: "retirementdate", header: "Retirement Date" },
    {
      field: "attendingceremony",
      header: "I Plan to Attend The Awards Ceremony",
    },
  ],
  awardFormFields: [
    { field: "awardname", header: "Award Name" },
    { field: "awarddescription", header: "Description" },
    { field: "awardoptions", header: "Options" },
  ],
  delegatedFormFields: [
    { field: "employee", header: "Employee" },
    { field: "firstname", header: "First Name" },
    { field: "lastname", header: "Last Name" },
    { field: "governmentemail", header: "Government Email" },
    { field: "employeenumber", header: "Employee Number" },
    {
      field: "ministryorganization",
      header: "Ministry / Organization",
    },
    { field: "yearsofservice", header: "Current Years of Service" },
    { field: "currentmilestone", header: "Current Milestone" },
    { field: "qualifyingyear", header: "Milestone Qualifying Year" },
    {
      field: "priormilestones",
      header: "Prior Unclaimed Milestones",
      body: (rowData) => {
        return rowData.priormilestones
          ? rowData.priormilestones.map((each) => `${each} years `)
          : null;
      },
    },
  ],
  selfregistrationsteps: [
    {
      label: "Basic Profile",
      route: "/register/profile",
    },
    {
      label: "Milestone Selection",
      route: "/register/milestone",
    },
    {
      label: "Personal Profile Details",
      route: "/register/details",
    },
    {
      label: "Award Selection",
      route: "/register/award",
    },
    {
      label: "Supervisor Details",
      route: "/register/supervisor",
    },
    {
      label: "Confirmation",
      route: "/register/confirmation",
    },
  ],
};

export default {
  /**
   * get enumerated data by key
   * **/

  get: function get(key) {
    return schemaData[key] !== "undefined" ? schemaData[key] : null;
  },

  /**
   * get enumerated data by key
   * **/

  lookup: function lookup(key, value) {
    if (schemaData[key] === "undefined") return null;
    const found = schemaData[key].filter((item) => item.value === value);
    return found.length > 0 ? found[0].text : null;
  },
};
