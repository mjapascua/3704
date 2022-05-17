import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { Button } from "../../components/Buttons/Main";
import { apiClient } from "../../utils/requests";

const ManageDevices = ({ authConfig }) => {
  const [admins, setAdmins] = useState([]);
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newLoc, setNewLoc] = useState("");
  const [info, setInfo] = useState({
    label: "",
    key: "",
    locID: "",
    userID: "",
  });

  const getIntData = useCallback(() => {
    const adminReq = apiClient.get("admin/users/ADMIN", authConfig);
    const deviceReq = apiClient.get("admin/rfid/devices", authConfig);
    const locReq = apiClient.get("admin/locations", authConfig);
    axios
      .all([adminReq, deviceReq, locReq])
      .then(
        axios.spread((...res) => {
          // console.log(res);
          setAdmins(res[0].data);
          setDevices(res[1].data);
          setLocations(res[2].data);
        })
      )
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleChange = ({ target }) => {
    setInfo((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const handleAddLoc = (e) => {
    e.preventDefault();
    apiClient
      .post("admin/locations", { label: newLoc }, authConfig)
      .then((res) => {
        if (res.status === 201) getIntData();
      });
  };

  const handleAddDevice = (e) => {
    e.preventDefault();
    apiClient.post("admin/rfid/devices", info, authConfig).then((res) => {
      if (res.status === 201) getIntData();
    });
  };

  useEffect(() => {
    getIntData();
  }, [getIntData]);

  return (
    <div>
      Add a Location
      <form className="w-full py-1" onSubmit={handleAddLoc}>
        <span className="inline-flex w-3/4 justify-between ">
          <label>
            Label
            <input
              type="text"
              value={newLoc}
              name="label"
              className="form-input !w-40"
              onChange={(e) => setNewLoc(e.target.value)}
            />
          </label>
        </span>
        <Button
          primary
          disabled={newLoc?.length < 1 ? true : false}
          type="submit"
        >
          Add
        </Button>
      </form>
      Add a device
      <form className="w-full py-1" onSubmit={handleAddDevice}>
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
            Tag to user:
            <select name="userID" value={info.userID} onChange={handleChange}>
              <option value="">none</option>
              {admins.map((user, index) => {
                return (
                  <option key={index} value={user._id}>
                    {user.fname + " " + user.lname}
                  </option>
                );
              })}
            </select>
          </label>
          <label>
            Tag to location:
            <select name="locID" value={info.locID} onChange={handleChange}>
              <option value="">none</option>
              {locations.map((loc, index) => {
                return (
                  <option key={index} value={loc._id}>
                    {loc.label}
                  </option>
                );
              })}
            </select>
          </label>
        </span>
        <Button
          primary
          disabled={
            info.label.length < 1 || info.label.length < 1 ? true : false
          }
          type="submit"
        >
          Add
        </Button>
      </form>
    </div>
  );
};

export default ManageDevices;
