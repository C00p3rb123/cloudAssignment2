import { AxiosError } from "axios";
import toast from "react-hot-toast";

type serverError = {
  message: string;
};
export const handleAxiosError = (error: AxiosError) => {
  const errorResponse = error?.response?.data as serverError;
  toast.error(errorResponse?.message ?? error.message, {
    position: "top-right",
  });
};
