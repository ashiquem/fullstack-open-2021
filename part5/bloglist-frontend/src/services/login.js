import axios from "axios";
const baseUrl = "/api/login/";

const login = async (credentials) => {
  console.log(credentials);
  const response = await axios.post(baseUrl, credentials);
  console.log(`login called ${response.data}`);
  return response.data;
};

export default { login };
