import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "../../components/Buttons/Main";
import { ReturnButton } from "../../components/Buttons/Return";
import StatusMessage from "../../components/StatusMessage";
import { apiClient } from "../../utils/requests";
import { phoneRegex } from "../Signup";
import GenerateQRCode from "./GenerateQRCode";

const CreateQRForm = ({ authConfig }) => {
  const [qr, setQR] = useState(null);
  const [status, setStatus] = useState({
    active: false,
    text: "",
    status: null,
  });
  // const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  });

  const handleChange = ({ target }) => {
    setData((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  /* const getMe = () => {
    apiClient.get("users/me", authConfig).then((res) => console.log(res));
  };
 */
  const handleQRRequest = () => {
    apiClient
      .post("user/guests/create-qr", data, authConfig)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          toast.success("QR generated!");
          setQR(res.data.hash);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handlePhoneNumCheck = useCallback(() => {
    if (
      data.phone_number &&
      (!phoneRegex.test(data.phone_number) ||
        !data.phone_number.startsWith("9"))
    ) {
      setStatus({
        active: true,
        text: "Invalid phone number",
        status: 400,
      });
    } else
      setStatus({
        active: false,
        text: "",
        status: 200,
      });
  }, [data]);

  useEffect(() => {
    handlePhoneNumCheck();
  }, [handlePhoneNumCheck]);

  return (
    <div className="w-full">
      {!qr ? (
        <>
          <span className="my-auto text-lg text-meadow-600 block pb-3 font-bold">
            Create Visitor Pass
          </span>
          <form className=" w-80 text-sm">
            <div>
              <label>
                First Name
                <input
                  type="text"
                  name="first_name"
                  className="form-input"
                  value={data.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />
              </label>
              <label>
                Last Name
                <input
                  type="text"
                  name="last_name"
                  value={data.last_name}
                  className="form-input"
                  onChange={handleChange}
                  placeholder="Enter lirst name"
                  required
                />
              </label>
              <label>
                Phone number
                <input
                  type="text"
                  name="phone_number"
                  value={data.phone_number}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+63"
                  required
                />
              </label>
              <label>
                Address
                <input
                  type="text"
                  name="address"
                  value={data.address}
                  className="form-input"
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </label>
            </div>
            <StatusMessage {...status} />
            <br />
            <Button
              primary
              disabled={
                !(
                  !status.active &&
                  data.first_name &&
                  data.last_name &&
                  data.phone_number &&
                  data.address
                )
              }
              onClick={handleQRRequest}
            >
              Create
            </Button>
          </form>
        </>
      ) : (
        <div className=" w-80 block px-3 md:px-5 relative">
          <GenerateQRCode
            text={qr}
            name={data.first_name + " " + data.last_name}
          />
        </div>
      )}
    </div>
  );
};

export default CreateQRForm;
