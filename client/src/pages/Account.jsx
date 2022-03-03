import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/Buttons/Main";
import { Navbar } from "../components/Navbar";
import { reset } from "../utils/authSlice";
import { apiClient } from "../utils/requests";
import CreateQRForm from "./User/CreateQRForm";
import EventsCalendar from "./User/EventsCalendar";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const authConfig = {
    headers: {
      Authorization: "Bearer " + user,
    },
  };

  const reqUserInfo = () => {
    apiClient.get("user/me", authConfig).then((res) => {
      setUserData(res.data);
    });
  };

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

  useEffect(() => {
    reqUserInfo();
    document.title = "Account | Community";
  }, []);

  return (
    <div className="flex h-full">
      <span className=" w-80 block p-4 h-64 md:h-full bg-meadow-800">
        <Button primary onClick={() => navigate("/account")} classes={"mb-5"}>
          My account
          <span className="material-icons-sharp text-3xl">manage_accounts</span>
        </Button>
        <Button
          primary
          onClick={() => navigate("generate-qr-pass")}
          classes={"mb-5"}
        >
          Create visitor pass
          <span className="material-icons-sharp text-3xl">qr_code</span>
        </Button>
        {/*  <Button primary classes={"mb-5"}>
            Dues
            <span className="material-icons-sharp text-3xl">payment</span>
          </Button>
          <Button primary classes={"mb-5"}>
            Message
            <span className="material-icons-sharp text-3xl">forum</span>
          </Button> */}
        <Button primary onClick={() => navigate("calendar")} classes={"mb-5"}>
          Calendar
          <span className="material-icons-sharp text-3xl">calendar_month</span>
        </Button>
      </span>
      <div className="bg-white w-full px-10 py-5">
        <Routes>
          <Route path="/" element={<UserAccount userData={userData} />} />
          <Route
            path="/generate-qr-pass"
            element={<CreateQRForm authConfig={authConfig} />}
          />
          <Route
            path="/calendar"
            element={<EventsCalendar authConfig={authConfig} />}
          />
        </Routes>
      </div>
    </div>
  );
};
const UserAccount = ({ userData }) => {
  return (
    userData && (
      <div>
        {Object.keys(userData).map((key) => {
          if (userData[key] instanceof Array) {
            return (
              <span key={key}>
                <span className="block ">
                  <b>{"Guests : "}</b>
                </span>
                <span className="h-80 block overflow-auto">
                  {userData[key].map((el, index) => {
                    return (
                      <span key={index} className="block ">
                        {el.first_name + " " + el.last_name}
                      </span>
                    );
                  })}
                </span>
              </span>
            );
          } else
            return (
              <span key={key} className="block ">
                <b className="capitalize">{key.split("_").join(" ") + ": "}</b>
                {userData[key]}
              </span>
            );
        })}
      </div>
    )
  );
};
export default Account;
