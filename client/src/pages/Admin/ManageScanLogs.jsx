import axios from "axios";
import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { Button } from "../../components/Buttons/Main";
import Table from "../../components/Table/Table";
import { useAuthHeader } from "../../utils/authService";
import { useIsMounted } from "../../utils/general";
import { apiClient } from "../../utils/requests";
const dateOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};
const accessTypes = ["qr", "rf"];

const ManageScanLogs = () => {
  const [paginate, setPaginate] = useState({
    data: [],
    total_count: 1,
    total_pages: 1,
    page_size: 20,
  });
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(-1);
  const [options, setOptions] = useState({
    users: [],
    locations: [],
    devices: [],
  });
  const [filter, setFilter] = useState({
    type: "",
    loc: "",
    by: "",
    node: "",
    createdAt: "",
  });
  //const [nameMatch, setNMatch] = useState({ first: "", last: "" });
  const isMounted = useIsMounted();
  const authConfig = useAuthHeader();
  const fetchIdRef = useRef(0);
  const refreshRef = useRef();

  const columns = useMemo(() => [
    {
      Header: "Type",
      width: 70,
      Cell: ({ row }) => {
        return (
          <span
            className={
              "material-icons-outlined px-2 py-2 " +
              (row.original.type === accessTypes[0]
                ? "text-cyan-600"
                : "text-blue-500")
            }
          >
            {row.original.type === accessTypes[0] ? "qr_code_2" : "contactless"}
          </span>
        );
      },
    },
    {
      Header: "Location",
      accessor: "loc.label",
      width: 180,
    },
    {
      Header: () => {
        return (
          <span
            onClick={() => setOrder(order === 1 ? -1 : 1)}
            className="flex items-center cursor-pointer"
          >
            Date time{" "}
            <span className={"material-icons-sharp pl-3 text-white"}>
              {order === 1 ? "arrow_drop_up" : "arrow_drop_down"}
            </span>
          </span>
        );
      },
      accessor: "createdAt",
      width: 240,
      Cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleString(
          undefined,
          dateOptions
        );
      },
    },
    {
      Header: "Registered account",
      columns: [
        { Header: "First name", accessor: "u_id.fname" },
        { Header: "Last name", accessor: "u_id.lname" },
      ],
    },

    {
      Header: "Guest information",
      columns: [
        { Header: "First name", accessor: "g_id.fname" },
        { Header: "Last name", accessor: "g_id.lname" },
      ],
    },

    { Header: "Scanned by", accessor: "by.fname" },
  ]);

  const getLogs = useCallback(
    ({ pageIndex, pageSize }) => {
      const fetchId = ++fetchIdRef.current;

      if (fetchId === fetchIdRef.current) {
        setLoading(true);
        const cleanFilter = Object.entries(filter).reduce(
          (a, [k, v]) => (v ? ((a[k] = v), a) : a),
          {}
        );
        //    const cleanName = nameMatch.first || nameMatch.last ? nameMatch : null;

        apiClient
          .put(`/admin/scans?limit=${pageSize}&page=${pageIndex}`, {
            filter: { ...cleanFilter, order: order },
            //    nq: cleanName,
          })
          .then((res) => {
            if (res.status === 200 && isMounted) {
              setPaginate({ ...res.data, page_size: paginate.page_size });
            }
          })
          .finally(() => {
            if (isMounted) setLoading(false);
          });
      }
    },
    [filter, order]
  );

  const handleChangeFilter = ({ target }) => {
    if (isMounted)
      setFilter((prev) => {
        return { ...prev, [target.name]: target.value };
      });
  };

  const getIntOpts = useCallback(() => {
    const adminReq = apiClient.get("admin/users/ADMIN", authConfig);
    const deviceReq = apiClient.get("admin/rfid/devices", authConfig);
    const locReq = apiClient.get("admin/locations", authConfig);
    axios
      .all([adminReq, deviceReq, locReq])
      .then(
        axios.spread((...res) => {
          if (isMounted)
            setOptions({
              users: res[0].data,
              devices: res[1].data,
              locations: res[2].data,
            });
        })
      )
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    getIntOpts();
  }, [getIntOpts]);

  return (
    <div className="p-1">
      <span className="w-full flex justify-between py-1 cursor-pointer font-semibold text-sm">
        <button
          ref={refreshRef}
          className="border border-gray-300 bg-white material-icons-outlined rounded-sm px-2 py-.5"
        >
          refresh
        </button>
        <label>
          Type
          <select
            name="type"
            value={filter.type}
            onChange={handleChangeFilter}
            className="ml-2"
          >
            <option value={""}>All</option>
            <option value={accessTypes[0]}>QR</option>
            <option value={accessTypes[1]}>RFID</option>
          </select>
        </label>
        <label>
          Location
          <select
            name="loc"
            value={filter.loc}
            onChange={handleChangeFilter}
            className="ml-2"
          >
            <option value={""}>All</option>
            {options.locations.map((l, index) => {
              return (
                <option key={index} value={l._id}>
                  {l.label}
                </option>
              );
            })}
          </select>
        </label>
        <label className="ml-4">
          Scanned by
          <select
            name="by"
            value={filter.by}
            onChange={handleChangeFilter}
            className="ml-2"
          >
            <option value={""}>All</option>
            {options.users.map((u, index) => {
              return (
                <option key={index} value={u._id}>
                  {u.fname + " " + u.lname}
                </option>
              );
            })}
          </select>
        </label>
        <label>
          Device
          <select
            name="node"
            value={filter.node}
            onChange={handleChangeFilter}
            className="ml-2"
          >
            <option value={""}>All</option>
            {options.devices.map((d, index) => {
              return (
                <option key={index} value={d._id}>
                  {d.device_label}
                </option>
              );
            })}
          </select>
        </label>
        <UserSelector handleChangeFilter={handleChangeFilter} />
        <DateSelector handleChangeFilter={handleChangeFilter} />
      </span>
      <Table
        columns={columns}
        paginate={paginate}
        fetchData={getLogs}
        loading={loading}
        refreshRef={refreshRef}
      />
    </div>
  );
};

const UserSelector = ({ handleChangeFilter }) => {
  const [query, setQuery] = useState({
    fname: "",
    lname: "",
  });
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState([]);
  const findByName = useCallback(() => {
    apiClient
      .get(`admin/name/match?fname=${query.fname}&lname=${query.lname}`)
      .then((res) => {
        setData(res.data);
      });
  }, [query]);

  const changeUserByID = ({ registered, id }) => {
    if (registered) {
      handleChangeFilter({ target: { name: "g_id", value: null } });
    }
    const target = { name: registered ? "u_id" : "g_id", value: id };
    handleChangeFilter({ target });

    setToggle(false);
  };

  const handleChange = ({ target }) => {
    setQuery((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  useEffect(() => {
    findByName();
  }, [findByName]);

  return (
    <div className="flex flex-col select-none relative z-20">
      <span
        onClick={() => setToggle(!toggle)}
        className="border bg-white inline-flex border-gray-300 items-center justify-between pl-2 w-36 rounded-sm text-xs"
      >
        Name finder
        <span className="material-icons-sharp">
          {toggle ? "arrow_drop_up" : "arrow_drop_down"}
        </span>
      </span>
      {toggle && (
        <>
          <span className="absolute block h-2.5 -bottom-1.5 border-x z-10 border-gray-300 bg-white w-36"></span>
          <div className="absolute top-7 right-0 w-min pb-2 flex flex-col border-gray-300 bg-white border shadow-sprd rounded">
            <span className="flex mx-3 mt-2 border-b pb-2">
              <label>
                First Name
                <input
                  type="text"
                  name="fname"
                  value={query.fname}
                  onChange={handleChange}
                  className="mr-2 p-1"
                />
              </label>
              <label>
                Last Name
                <input
                  type="text"
                  name="lname"
                  value={query.lname}
                  onChange={handleChange}
                  className="p-1"
                />
              </label>
              <span
                onClick={() => {
                  setQuery({ fname: "", lname: "" });
                  handleChangeFilter({
                    target: { name: "g_id", value: null },
                  });
                  handleChangeFilter({ target: { name: "u_id", value: null } });
                }}
                className="material-icons-sharp text-rose-700 mt-4 mx-2"
              >
                block
              </span>
            </span>
            <div className="flex-col flex">
              {data.map((el, ind) => {
                return (
                  <span
                    onClick={() => {
                      setQuery({
                        fname: el.fname,
                        lname: el.lname,
                      });
                      changeUserByID({ registered: !!el.role, id: el._id });
                    }}
                    className="w-full flex p-2.5 items-center even:bg-gray-100"
                    key={ind}
                  >
                    <span
                      className={
                        "material-icons-outlined pr-4 " +
                        (!el.role ? "text-purple-600" : "text-green-500")
                      }
                    >
                      {!el.role ? "supervised_user_circle" : "verified_user"}
                    </span>
                    {el.fname + " " + el.lname}
                  </span>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const DateSelector = ({ handleChangeFilter }) => {
  const [dateRange, setDRange] = useState({
    show: false,
    from: "",
    to: "",
  });
  const handleDateRange = ({ target }) => {
    setDRange((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };
  const handleApply = () => {
    const target = {
      name: "createdAt",
      value: { $gte: dateRange.from, $lte: dateRange.to },
    };
    handleChangeFilter({ target });
  };
  const toggleDRange = () => setDRange({ ...dateRange, show: !dateRange.show });

  return (
    <span className="relative select-none z-10">
      <span
        onClick={toggleDRange}
        className="border bg-white inline-flex border-gray-300 items-center justify-between pl-2 w-36 rounded-sm text-xs"
      >
        Date range
        <span className="material-icons-sharp">
          {dateRange.show ? "arrow_drop_up" : "arrow_drop_down"}
        </span>
      </span>
      {dateRange.show && (
        <>
          <span className="absolute block h-2 -bottom-1 z-10 border-x border-gray-300 bg-white w-36"></span>
          <div className="absolute top-7 right-0 w-64 flex flex-col border-gray-300 bg-white px-3 py-2 border shadow-sprd rounded">
            <label>
              From
              <input
                type="datetime-local"
                name="from"
                value={dateRange.from}
                onChange={handleDateRange}
                max={dateRange.to}
                className="block mb-1.5"
              />
            </label>
            <label>
              To
              <input
                type="datetime-local"
                name="to"
                value={dateRange.to}
                onChange={handleDateRange}
                min={dateRange.from}
                className="block"
              />
            </label>
            <Button
              onClick={handleApply}
              className="p-1 mt-2 font-display bg-teal-600 text-white"
            >
              Apply
            </Button>
          </div>
        </>
      )}
    </span>
  );
};
export default ManageScanLogs;
