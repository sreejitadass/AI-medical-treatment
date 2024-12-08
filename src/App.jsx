import React from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MedicalRecord from "./pages/records/index";
import SingleRecordDetails from "./pages/records/single-record-details";
import { Home, Onboarding, Profile } from "./pages";
import ScreeningSchedule from "./pages/ScreeningSchedule";

const App = () => {
  return (
    <div className="relative flex min-h-screen flex-row bg-[#13131a] p-4">
      <div className="relative mr-10 hidden sm:flex">
        <Sidebar />
      </div>
      <div className="max mx-auto max-w-[1280px] flex-1 pr-5 sm:w-full">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/onboarding" element={<Onboarding />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/medical-records" element={<MedicalRecord />}></Route>
          <Route
            path="/medical-records/:id"
            element={<SingleRecordDetails />}
          ></Route>
          <Route
            path="/screening-schedules"
            element={<ScreeningSchedule />}
          ></Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
