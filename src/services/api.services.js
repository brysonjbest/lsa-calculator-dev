import * as testdata from "./testdata/userdata.json";

export class UserService {
  async getUserData() {
    const res = await fetch("/testdata/userdata.json");
    const d = await res.json();

    return d.data;
  }
  async getTestUserData() {
    const d = testdata;
    // console.log(d.exampleData);
    return d.exampleData2;
  }
}
