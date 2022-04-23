import { useCallback, useState, useEffect } from "react";
import { Button } from "../../components/Buttons/Main";
import { apiClient } from "../../utils/requests";

const ManageDevices = ({ authConfig }) => {
  const [admins, setAdmins] = useState([]);
  const [info, setInfo] = useState({
    label: "",
    key: "",
    location: "",
    user_id: "",
  });

  const getAdmins = useCallback(() => {
    apiClient.get("admin/users/ADMIN", authConfig).then((res) => {
      if (res.status === 200) {
        setAdmins(res.data);
        setInfo((prev) => {
          return { ...prev, user_id: res.data[0].id };
        });
      }
    });
  }, []);

  const handleChange = ({ target }) => {
    setInfo((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiClient.post("admin/rfid/device", info, authConfig).then((res) => {
      if (res.status === 201) console.log(1);
    });
  };

  useEffect(() => {
    getAdmins();
  }, [getAdmins]);

  return (
    <div>
      Add a device
      <form className="w-full py-1" onSubmit={handleSubmit}>
        <span className="inline-flex w-3/4 justify-between ">
          <label>
            Label
            <input
              type="text"
              value={info.label}
              name="label"
              className="form-input !w-40"
              onChange={handleChange}
            />
          </label>
          <label>
            Key
            <input
              type="text"
              value={info.key}
              name="key"
              className="form-input !w-40"
              onChange={handleChange}
            />
          </label>
          <label>
            Location
            <input
              type="text"
              value={info.location}
              name="location"
              className="form-input !w-40"
              onChange={handleChange}
            />
          </label>
          <label>
            Add a user:
            <select name="user" value={info.user_id} onChange={handleChange}>
              {admins.map((user, index) => {
                return (
                  <option key={index} value={user.id}>
                    {user.name}
                  </option>
                );
              })}
            </select>
          </label>
        </span>
        <Button primary type="submit">
          Add
        </Button>
      </form>
    </div>
  );
};

export default ManageDevices;
