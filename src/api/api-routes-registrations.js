import api from "./api.services";

class RegistrationsDataService {
  getRegistration(id) {
    return api.get(`/users/register/${id}`);
  }
  postRegistration() {
    return api.post("/recipients/register");
  }
  updateRegistration(id) {
    return api.post(`/recipients/save/${id}`);
  }
}
export default new RegistrationsDataService();
