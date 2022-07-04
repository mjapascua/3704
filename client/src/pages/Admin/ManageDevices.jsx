import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Button } from "../../components/Buttons/Main";
import authService, { useAuthHeader } from "../../utils/authService";
import { useIsMounted } from "../../utils/general";
import { apiClient } from "../../utils/requests";

const ManageDevices = () => {
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
  const authConfig = useAuthHeader();
  const isMounted = useIsMounted();
  const { user } = useSelector((state) => state.auth);

  const getIntData = useCallback(() => {
    const adminReq = apiClient.get("admin/users/ADMIN,EDITOR", authConfig);
    const deviceReq = apiClient.get("admin/rfid/devices", authConfig);
    const locReq = apiClient.get("admin/locations", authConfig);
    axios
      .all([adminReq, deviceReq, locReq])
      .then(
        axios.spread((...res) => {
          if (isMounted) {
            // console.log(res);
            setAdmins(res[0].data);
            setDevices(
              res[1].data.sort((a, b) => {
                if (!b.active) return -1;
                if (a.active) return 1;
              })
            );
            setLocations(
              res[2].data.sort((a, b) => {
                if (!b.active) return -1;
                if (a.active) return 1;
              })
            );
          }
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
        if (res.status === 201) {
          toast.success("created");
          getIntData();
        }
      })
      .catch((err) => toast.error(err.response.message));
  };

  const handleAddDevice = (e) => {
    e.preventDefault();
    apiClient.post("admin/rfid/devices", info, authConfig).then((res) => {
      if (res.status === 201) getIntData();
    });
  };
  const disableLoc = (id) => {
    Swal.fire({
      title: "Are you sure",
      text: "confirm to set inactive",
      icon: "question",
      showCancelButton: true,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        apiClient
          .put("admin/locations/" + id, { active: false }, authConfig)
          .then((res) => {
            if (res.status === 200) {
              toast.success("Location is now inactive");
              setLocations(
                res.data.sort((a, b) => {
                  if (!b.active) return -1;
                  if (a.active) return 1;
                })
              );
            }
          });
      }
    });
  };
  const deleteLoc = (id) => {
    Swal.fire({
      title: "Are you sure",
      text: "confirm to delete",
      icon: "question",
      showCancelButton: true,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        apiClient.delete("admin/locations/" + id, authConfig).then((res) => {
          if (res.status === 200) {
            toast.success("Deleted");
            setLocations(
              res.data.sort((a, b) => {
                if (!b.active) return -1;
                if (a.active) return 1;
              })
            );
          }
        });
      }
    });
  };

  const disableDev = (id) => {
    Swal.fire({
      title: "Are you sure",
      text: "confirm to set inactive",
      icon: "question",
      showCancelButton: true,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        apiClient
          .put("admin/rfid/devices/" + id, { active: false }, authConfig)
          .then((res) => {
            if (res.status === 200) {
              toast.success("Device is now inactive");
              setDevices(
                res.data.sort((a, b) => {
                  if (!b.active) return -1;
                  if (a.active) return 1;
                })
              );
            }
          });
      }
    });
  };
  const deleteDev = (id) => {
    Swal.fire({
      title: "Are you sure",
      text: "confirm to delete",
      icon: "question",
      showCancelButton: true,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        apiClient.delete("admin/rfid/devices/" + id, authConfig).then((res) => {
          if (res.status === 200) {
            toast.success("Deleted");
            setDevices(
              res.data.sort((a, b) => {
                if (!b.active) return -1;
                if (a.active) return 1;
              })
            );
          }
        });
      }
    });
  };
  useEffect(() => {
    getIntData();
  }, [getIntData]);

  return (
    <div className="w-full mb-10 flex flex-col">
      <span className="font-bold block text-lg px-1 mb-5 text-slate-600">
        Scan Locations
      </span>
      <span className="flex pb-10 border-b">
        <div className="w-1/3 border mr-5 inline-block h-fit px-4 py-3 shadow-md rounded">
          <span className="w-full">
            <span className="font-bold block text-lg mb-5 text-slate-600">
              Add a new location
            </span>
            <form onSubmit={handleAddLoc} className=" w-full">
              <label className="block">
                Label
                <br />
                <input
                  type="text"
                  value={newLoc}
                  name="label"
                  className="form-input w-full"
                  onChange={(e) => setNewLoc(e.target.value)}
                />
              </label>
              <Button
                primary
                className="w-full mt-5"
                disabled={
                  newLoc?.length < 1 || user.role !== authService.ROLES.ADMIN
                    ? true
                    : false
                }
                type="submit"
              >
                Add
              </Button>
            </form>
          </span>
        </div>
        <div className="w-4/5 border mr-5 inline-block h-fit px-4 py-3 shadow-md rounded">
          <span className="font-bold block text-lg mb-5 text-slate-600">
            Entries
          </span>
          <div className=" h-56 w-full overflow-y-scroll bg-gray-100 p-2">
            {locations.map((loc) => {
              const created = new Date(loc.createdAt).toLocaleDateString();

              return (
                <span
                  key={loc._id}
                  className={
                    "flex items-center w-full h-16 justify-between mb-2 rounded shadow border px-3 py-1 " +
                    (loc.active ? " bg-white" : " bg-slate-50")
                  }
                >
                  <span>
                    <b>{loc.label}</b> <br />
                    <span className="text-sm text-slate-600">{created}</span>
                  </span>
                  <span>
                    {loc.active ? (
                      <Button
                        onClick={() => disableLoc(loc._id)}
                        className="text-indigo-500 hover:underline"
                      >
                        DISABLE
                      </Button>
                    ) : (
                      <b className="text-slate-500 text-sm pr-4">INACTIVE</b>
                    )}
                    <Button
                      onClick={() => deleteLoc(loc._id)}
                      className="text-rose-500 hover:underline"
                    >
                      DELETE
                    </Button>
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </span>
      <br />
      <span className="font-bold block text-lg px-1 mb-5 text-slate-600">
        RFID devices
      </span>
      <span className="flex">
        <div className="w-1/3 border mr-5 inline-block h-fit px-4 py-3 shadow-md rounded">
          <span className="w-full">
            <span className="font-bold block text-lg mb-5 text-slate-600">
              Add a new device
            </span>
            <form className="w-full h-fit py-1" onSubmit={handleAddDevice}>
              <span className="inline-flex flex-col w-full justify-between ">
                <span className="flex ">
                  <label className=" mr-4">
                    Label
                    <input
                      type="text"
                      value={info.label}
                      name="label"
                      className="form-input"
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Key
                    <input
                      type="text"
                      value={info.key}
                      name="key"
                      className="form-input"
                      onChange={handleChange}
                    />
                  </label>
                </span>

                <label className="mb-4">
                  Tag to user:
                  <select
                    name="userID"
                    value={info.userID}
                    onChange={handleChange}
                    className="w-full mt-2 py-2"
                  >
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
                <label className="mb-4">
                  Tag to location:
                  <select
                    name="locID"
                    value={info.locID}
                    className="w-full mt-2 py-2"
                    onChange={handleChange}
                  >
                    <option value="">none</option>
                    {locations
                      .filter((loc) => loc.active)
                      .map((loc, index) => {
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
                className="w-full mt-5"
                disabled={
                  info.label.length < 1 || user.role !== authService.ROLES.ADMIN
                    ? true
                    : false
                }
                type="submit"
              >
                Add
              </Button>
            </form>
          </span>
        </div>
        <div className="w-4/5 border mr-5 inline-block h-fit px-4 py-3 shadow-md rounded">
          <span className="font-bold block text-lg mb-5 text-slate-600">
            Entries
          </span>
          <div className=" h-80 w-full overflow-y-scroll bg-gray-100 p-2">
            {devices.map((dev) => {
              const created = new Date(dev.createdAt).toLocaleDateString();
              return (
                <span
                  key={dev._id}
                  className={
                    "flex items-center w-full h-16 justify-between mb-2 rounded shadow border px-3 py-1 " +
                    (dev.active ? " bg-white" : " bg-slate-50")
                  }
                >
                  <span>
                    <b>{dev.device_label} : </b>
                    {dev.device_key} <br />
                    <span className="text-sm text-slate-600">{created}</span>
                  </span>{" "}
                  {dev.user
                    ? dev.user.fname + " " + dev.user.lname
                    : "No user please set"}
                  <br />
                  <span>
                    {dev.active ? (
                      <Button
                        onClick={() => disableDev(dev._id)}
                        className="text-indigo-500 hover:underline"
                      >
                        DISABLE
                      </Button>
                    ) : (
                      <b className="text-slate-500 text-sm pr-4">INACTIVE</b>
                    )}
                    <Button
                      onClick={() => deleteDev(dev._id)}
                      className="text-rose-500 hover:underline"
                    >
                      DELETE
                    </Button>
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </span>
    </div>
  );
};

export default ManageDevices;
