import axios from "axios";

const API_KEY = "43314002-043a27ff82dab70fb346c90f4";

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params) => {
  let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true";
  if (!params) return url;

  let paramkeys = Object.keys(params);

  paramkeys.map((key) => {
    let value = key == "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  //console.log("Final URL: ", url);
  return url;
};

export const apiCall = async (params) => {
  try {
    const response = await axios.get(formatUrl(params));
    const { data } = response;
    return { succcess: true, data };
  } catch (error) {
    console.log("API Error: ", error.message);
    return { succcess: false, message: error.message };
  }
};
