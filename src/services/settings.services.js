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
