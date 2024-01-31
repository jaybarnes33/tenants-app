import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const makeSecuredRequest = async (
  url: string,
  method: "get" | "post" | "put" | "delete",
  data?: any
): Promise<AxiosResponse> => {
  const token = sessionStorage.getItem("accessToken");
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    throw error;
  }
};
