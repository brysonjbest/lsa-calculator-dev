/*!
 * API services (React)
 * File: api.services.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import axios from "axios";
import temp from "./temp.json";

const api = axios.create({
  baseURL: import.meta.env.LSA_APPS_API_URL,
  headers: {
    "Content-Type": "application/json",
    dataType: "json",
  },
  withCredentials: true,
});

export default api;

export async function getUserData() {
  return {
    id: "512350",
    username: "testing",
    idir: "BBEST",
  };
}

export async function getRegistrationData(userData) {
  if (userData.idir === "BBEST") {
    return temp;
    //  {
    //   submitted: false,
    //   "personal-firstname": "testapifirstname",
    //   "personal-lastname": "testlastname",
    //   "personal-governmentemail": "testemail@test.com",
    //   "personal-governmentphone": "(604) 525-2525",
    //   "personal-employeenumber": "2138adse12",
    //   "personal-ministryorganization": "org-10",
    //   "personal-branch": "testbranch",
    //   "personal-currentmilestone": 25,
    //   "personal-priormilestones": [20, 15],
    //   "personal-qualifyingyear": 2023,
    //   "personal-yearsofservice": 25,
    //   officecitycommunity: "Toronto",
    //   officecountry: "Canada",
    //   officepostalcode: "M4K 2P9",
    //   officestreetaddress: "855 Broadview Avenue",
    //   officestreetaddress2: "",
    //   "personal-personalemail": "personalEmail@test.com",
    //   "personal-personalphone": "(778) 525-2525",
    //   personalcitycommunity: "Sunnyvale",
    //   personalcountry: "United States",
    //   personalpostalcode: "94086-2919",
    //   personalprovincestate: "California",
    //   personalstreetaddress: "785 East El Camino Real",
    //   personalstreetaddress2: "",
    //   awardID: "1001",
    //   awarddescription: "A magnificent painting of a Whale Tail",
    //   awardname: "Whale Tail Painting",
    //   awardoptions: [
    //     {
    //       inscription: "testing",
    //       paintingtype: "oil",
    //       whaletype: "orca",
    //       paintingtools: ["fork", "brush", "spoon"],
    //     },
    //   ],
    //   "supervisor-firstname": "testingSuperFirst",
    //   "supervisor-lastname": "testingSuperLast",
    //   "supervisor-governmentemail": "superemail@test.com",
    //   supervisorstreetaddress: "123 Fake Street",
    //   supervisorstreetaddress2: "Apartment 2",
    //   supervisorcitycommunity: "Victoria",
    //   supervisorpostalcode: "V8T0R2",
    //   supervisorpobox: "98563",
    //   retirementdate: new Date("Dec 27 2023"),
    //   retiringcurrentyear: true,
    //   bcgeumember: true,
    //   ceremonyoptout: true,
    // };
  } else {
    return {};
  }
}

export async function getAvailableAwards(milestone) {
  //testing options, to make actual api call later
  const index = `options${milestone}`;
  const allOptions = {
    options25: [
      {
        id: "1002",
        vendor: "zz21cz3c1",
        name: "Blue Band",
        description: "Product Description",
        image_url: "https://picsum.photos/200",
        options: [],
      },
      {
        id: "1000",
        vendor: "f230fh0g3",
        name: "PECSF Donation",
        description: "PECSF Donation Options",
        image_url: "https://picsum.photos/200",
        options: [
          {
            id: "",
            type: "radio",
            name: "donation-choice",
            required: true,
            value: "",
            description: "Please select type donation",
            customizable: false,
            options: [],
          },
          {
            id: "",
            type: "dropdown",
            name: "firstcharity",
            required: true,
            value: "",
            description: "Select charity.",
            customizable: true,
            options: [],
          },
          {
            id: "",
            type: "dropdown",
            name: "secondcharity",
            required: true,
            value: "",
            description: "Select charity.",
            customizable: true,
            options: [],
          },
          {
            id: "",
            type: "dropdown",
            name: "firstregion",
            required: true,
            value: "",
            description: "Select region.",
            customizable: true,
            options: [],
          },
          {
            id: "",
            type: "dropdown",
            name: "secondregion",
            required: true,
            value: "",
            description: "Select charity.",
            customizable: true,
            options: [],
          },
          {
            id: "",
            type: "text",
            name: "donation-certificate",
            required: true,
            value: "",
            description: "What would you like your certificate to say?",
            customizable: true,
          },
        ],
      },
      {
        id: "1001",
        vendor: "nvklal433",
        name: "Whale Tail Painting",
        description: "Whale Tail Painting",
        image_url: "https://picsum.photos/200",
        options: [
          {
            id: "",
            type: "text",
            name: "inscription",
            required: true,
            value: "",
            description: "What would you like the inscription to say.",
            customizable: true,
          },
          {
            id: "",
            type: "dropdown",
            name: "paintingtype",
            required: true,
            value: "",
            description: "Select type of painting.",
            customizable: true,
            options: ["oil", "watercolour"],
          },
          {
            id: "",
            type: "multiselect",
            name: "paintingtools",
            required: true,
            value: "",
            description: "Select tools used in painting.",
            customizable: false,
            options: ["fork", "brush", "spoon"],
          },
          {
            id: "",
            type: "radio",
            name: "whaletype",
            required: true,
            value: "",
            description: "Please select type of whale",
            customizable: false,
            options: ["orca", "grey"],
          },
        ],
      },
    ],
    options30: [
      {
        id: "1001",
        vendor: "nvklal433",
        name: "Whale Tail Painting",
        description: "Whale Tail Painting",
        image_url: "https://picsum.photos/200",
        options: [
          {
            id: "",
            type: "text",
            name: "inscription",
            required: true,
            value: "",
            description: "What would you like the inscription to say.",
            customizable: true,
          },
          {
            id: "",
            type: "dropdown",
            name: "paintingtype",
            required: true,
            value: "",
            description: "Select type of painting.",
            customizable: true,
            options: ["oil", "watercolour"],
          },
          {
            id: "",
            type: "multiselect",
            name: "paintingtools",
            required: true,
            value: "",
            description: "Select tools used in painting.",
            customizable: false,
            options: ["fork", "brush", "spoon"],
          },
          {
            id: "",
            type: "radio",
            name: "whaletype",
            required: true,
            value: "",
            description: "Please select type of whale",
            customizable: false,
            options: ["orca", "grey"],
          },
        ],
      },
      {
        id: "1002",
        vendor: "zz21cz3c1",
        name: "Blue Band",
        description: "Product Description",
        image_url: "https://picsum.photos/200",
        options: [],
      },
      {
        id: "1003",
        vendor: "244wgerg2",
        name: "Blue T-Shirt",
        description: "Product Description",
        image_url: "https://picsum.photos/200",
      },
    ],
  };

  return milestone ? allOptions[index] : [];
}
