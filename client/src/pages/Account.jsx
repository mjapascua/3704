import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/Buttons/Main";
import { reset } from "../utils/authSlice";
import CreateQRForm from "./User/CreateQRForm";

const UserHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const from = location.state?.from?.pathname || "/account";

  const handleReturn = () => navigate(from, { replace: true });

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
      <span className=" w-64 block">
        <Button secondary onClick={() => navigate("generate-qr-pass")}>
          Create visitor pass
          <span className="material-icons-sharp text-4xl">qr_code</span>
        </Button>
      </span>

      <Routes>
        <Route
          path="/generate-qr-pass"
          element={<CreateQRForm handleReturn={handleReturn} />}
        />
      </Routes>
    </div>
  );
};

export default UserHome;
