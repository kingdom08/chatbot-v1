import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Beranda from "./Pages/Beranda";
import Daftar from "./pages/Daftar";
import Login from "./Pages/Login";
import ChatUser from "./Pages/ChatUser";
import DasborAdmin from "./pages/DasborAdmin";
import Profil from "./pages/Profil";
import LayoutUser from "./Layout/LayoutUser";
import AdminLayout from "./Layout/AdminLayout";
import History from "./Pages/History";
import ProfilAdmin from "./Pages/ProfilAdmin";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<Beranda />} />
          <Route path="/daftar" element={<Daftar />} />
          <Route path="/login" element={<Login />} />

          {/* Rute user */}
          <Route path="/user" element={<LayoutUser />}>
            <Route index element={<ChatUser />} />
            <Route path="chat" element={<ChatUser />} />
            <Route path="profil" element={<Profil />} />
            <Route path="history" element={<History />} />
          </Route>
          {/* Rute Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ProfilAdmin />} />
            <Route path="profiladmin" element={<ProfilAdmin />} />
            <Route path="dasbor" element={<DasborAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
