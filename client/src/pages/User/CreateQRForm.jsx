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
    fname: "",
    lname: "",
    contact: "",
    address: "",
  });

  const handleChange = ({ target }) => {
    setData((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const handlePhoneNumCheck = useCallback(() => {
    if (
      data.contact &&
      (!phoneRegex.test(data.contact) || !data.contact.startsWith("9"))
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
                name="fname"
                className="form-input"
                value={data.fname}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                name="lname"
                value={data.lname}
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
                    name="contact"
                    onChange={handleChange}
                    value={data.contact}
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
                data.fname &&
                data.lname &&
                data.contact &&
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
