import { Routes, Route } from "react-router-dom";
import GenerateQRCode from "./User/GenerateQRCode";

const UserHome = () => {
  return (
    <div>
      <Routes>
        <Route path="/generate-qr-pass" element={<GenerateQRCode />} />
      </Routes>
    </div>
  );
};

export default UserHome;
