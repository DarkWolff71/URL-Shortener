import { Signup, Redirect, Signin, MyUrls } from "./components";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "./lib/helpers";
import { useRecoilState } from "recoil";
import { isAuthenticated } from "./recoil-store/atoms/autheticationAtoms";

function App() {
  let [isAuthenticatedState, setIsAuthenticatedState] =
    useRecoilState(isAuthenticated);
  useEffect(() => {
    async function checkIfAuthenticated() {
      try {
        await axios.get(`${BACKEND_BASE_URL}/auth/is-authenticated`, {withCredentials: true});
        setIsAuthenticatedState(true);
      } catch {
        setIsAuthenticatedState(false);
      }
    }
    checkIfAuthenticated();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/signin" />} />
          <Route
            path="/signin"
            element={
              isAuthenticatedState ? (
                <Navigate replace to="/myurls" />
              ) : (
                <Signin />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/myurls"
            element={
              isAuthenticatedState ? (
                <MyUrls />
              ) : (
                <Navigate replace to="/signin" />
              )
            }
          />
          <Route path="/*" element={<Redirect />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
