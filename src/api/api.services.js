export async function getUserData() {
  return {
    id: "512350",
    username: "testing",
    idir: "BBEST",
  };
}

export async function getRegistrationData(userData) {
  console.log(userData);
  return {
    submitted: true,
  };
}
