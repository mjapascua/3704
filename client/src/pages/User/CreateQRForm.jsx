import { useCallback } from "react";
import { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Main";
import StatusMessage from "../../components/StatusMessage";
import { phoneRegex } from "../Signup";

const CreateQRForm = ({ handleQRRequest }) => {
  const [status, setStatus] = useState({
    active: false,
    text: "",
    status: null,
  });

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
                placeholder="Enter last name"
                required
              />
            </label>
            <div className=" relative">
              <label>
                Phone
                <span className="flex">
                  <span className="px-1 mr-2 py-4 text-base inline-block">
                    <>+63</>
                  </span>
                  <input
                    type="text"
                    name="phone_number"
                    onChange={handleChange}
                    value={data.phone_number}
                    className="form-input !inline-block"
                    placeholder="9*********"
                    required
                  />
                </span>
              </label>
            </div>
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
            onClick={() => handleQRRequest(data)}
          >
            Create
          </Button>
        </form>
      </>
    </div>
  );
};

export default CreateQRForm;
