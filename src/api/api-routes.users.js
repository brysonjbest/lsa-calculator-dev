import api from "./api.services";

class UsersDataService {
  postDelegatedUser() {
    return api.post("/users/register");
  }
}
export default new UsersDataService();
