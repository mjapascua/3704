import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import { reset } from "../utils/authSlice";
import CreateQRForm from "./User/CreateQRForm";

const UserHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/login");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  return (
    <div className="w-screen">
      <Routes>
        <Route path="/generate-qr-pass" element={<CreateQRForm />} />
      </Routes>
    </div>
  );
};

export default UserHome;
