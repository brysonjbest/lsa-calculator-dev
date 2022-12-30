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
  };
}
