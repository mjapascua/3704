import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/Buttons/Main";
import { ReturnButton } from "../components/Buttons/Return";
import { apiClient } from "../utils/requests";
import Loading from "../components/Loading/Loading";

const resendTime = 120;
const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [countDown, setCount] = useState(resendTime);
  const [startCD, setCD] = useState(false);
  const [loading, setLoading] = useState(false);
  let countInterval;
  const handleChange = ({ target }) => {
    setEmail(target.value);
  };
  const handleEmailRequest = (e) => {
    e.preventDefault();
    setLoading(true);
    apiClient
      .post("user/newpass", { email })
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          setCD(true);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    console.log(countDown);
  }, [countDown]);

  useEffect(() => {
    if (startCD) {
      countInterval = setInterval(() => {
        setCount((prev) => (prev -= 1));
      }, 1000);
    }
    if (countDown <= 0) {
      setCount(resendTime);
      setCD(false);
      clearInterval(countInterval);
    }
    return () => clearInterval(countInterval);
  }, [startCD, countDown, countInterval]);

  return (
    <div className="p-5 h-screen block">
      <ReturnButton />
      <form
        onSubmit={handleEmailRequest}
        className="px-2 mt-10 lg:px-4 md:w-96"
      >
        <div className="data">
          <b>Email</b>
          <span className="text-md block pb-4 pt-1">
            Type your email below and then click send. Wait for your email
            request.
          </span>
          <input
            type="text"
            name="email"
            autoComplete="username"
            value={email}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Enter email or phone number"
          />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Button
              type={"submit"}
              disabled={
                !email.length || (countDown < resendTime && countDown > 0)
              }
              primary
              className="w-full"
            >
              SEND
            </Button>
            <br />
            {countDown && countDown < resendTime && (
              <span className="w-full flex justify-center font-light text-sm">
                Did not receive? you can resend in {countDown}s
              </span>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPass;
