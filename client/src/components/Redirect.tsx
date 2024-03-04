import { BACKEND_BASE_URL } from "@/lib/helpers";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function Redirect() {
  let location = useLocation();
  let [redirectingFailed, setRedirectingFailed] = useState<boolean>(false);

  useEffect(() => {
    async function sendRedirection() {
      try {
        let resp = await axios.get(
          `${BACKEND_BASE_URL}/url${location.pathname}`,
          {
            withCredentials: true,
          }
        );
        window.location.href = resp.data.originalUrl;
        setRedirectingFailed(false);
      } catch {
        setRedirectingFailed(true);
      }
    }
    sendRedirection();
  }, [location]);

  if (redirectingFailed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <span className="text-6xl">😞</span>
        <h2 className="text-xl font-semibold text-white mt-5 mb-2">
          Redirecting Failed
        </h2>
        <p className="text-white text-opacity-90 max-w-md text-center">
          We're sorry, but we couldn't redirect you to the desired page. Please
          check your connection and try again.
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="mb-5 w-20 h-20 mx-auto">
            <svg
              className="animate-spin -ml-1 mr-3 h-full w-full text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Redirecting...
          </h2>
          <p className="text-white text-opacity-90">
            Please wait, you're being redirected.
          </p>
        </div>
      </div>
    );
  }
}
