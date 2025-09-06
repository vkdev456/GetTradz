import React, { useEffect } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./Topbar";

const Home = () => {
  useEffect(() => {
    //  Checks if token came in the URL (after login redirect)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);

      // Clean the URL 
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;
