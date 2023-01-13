export async function getUserData() {
  return {
    id: "512350",
    username: "testing",
    idir: "BBEST",
  };
}

export async function getRegistrationData(userData) {
  return {
    submitted: false,
    "personal-firstname": "testapifirstname",
    "personal-lastname": "testlastname",
    "personal-governmentemail": "testemail@test.com",
    "personal-governmentphone": "(604) 525-2525",
    "personal-employeenumber": "2138adse12",
    "personal-ministryorganization": "org-10",
    "personal-branch": "testbranch",
    "personal-currentmilestone": 25,
    "personal-priormilestones": [20, 15],
    "personal-qualifyingyear": 2023,
    "personal-yearsofservice": 25,
    officecitycommunity: "Toronto",
    officecountry: "Canada",
    officepostalcode: "M4K 2P9",
    officestreetaddress: "855 Broadview Avenue",
    officestreetaddress2: "",
    "personal-personalemail": "personalEmail@test.com",
    "personal-personalphone": "(403) 894-2696",
    personalcitycommunity: "Sunnyvale",
    personalcountry: "United States",
    personalpostalcode: "94086-2919",
    personalprovincestate: "California",
    personalstreetaddress: "785 East El Camino Real",
    personalstreetaddress2: "",
    awardID: "1001",
    awarddescription: "Whale Tail Painting",
    awardname: "Whale Tail Painting",
    awardoptions: [
      {
        inscription: "testing",
        paintingtype: "oil",
        whaletype: "orca",
        paintingtools: ["fork", "brush", "spoon"],
      },
    ],
  };
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
            type: "dropdown",
            name: "donationtype",
            required: true,
            value: "donationtype",
            description: "Choose your pecsf donation",
            customizable: true,
          },
          {
            id: "",
            type: "text",
            name: "donationextra",
            required: true,
            value: "donationtype",
            description: "These are additional details",
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