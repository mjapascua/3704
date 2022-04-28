import axios from "axios";
import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { usePagination, useTable } from "react-table";
import { Button } from "../../components/Buttons/Main";
import Loading from "../../components/Loading/Loading";
import { apiClient } from "../../utils/requests";
const dateOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};
const accessTypes = ["qr", "rf"];

const ManageScanLogs = ({ authConfig }) => {
  const [paginate, setPaginate] = useState({
    data: [],
    total_count: 1,
    total_pages: 1,
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

  const fetchIdRef = useRef(0);

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
      //  className: " !bg-teal-600 !text-center ",
      // id: "Registered",
      columns: [
        { Header: "First name", accessor: "u_id.first_name" },
        { Header: "Last name", accessor: "u_id.last_name" },
      ],
    },

    {
      Header: "Guest information",
      columns: [
        { Header: "First name", accessor: "g_id.fname" },
        { Header: "Last name", accessor: "g_id.lname" },
      ],
    },

    { Header: "Scanned by", accessor: "by.first_name" },
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
            filter: cleanFilter,
            order: order,
            //    nq: cleanName,
          })
          .then((res) => {
            if (res.status === 200) {
              setPaginate(res.data);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [filter, order]
  );

  const handleChangeFilter = ({ target }) => {
    setFilter((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  /*   const handleNameMatch = ({ target }) => {
    setNMatch((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  }; */

  const getIntOpts = useCallback(() => {
    const adminReq = apiClient.get("admin/users/ADMIN", authConfig);
    const deviceReq = apiClient.get("admin/rfid/devices", authConfig);
    const locReq = apiClient.get("admin/locations", authConfig);
    axios
      .all([adminReq, deviceReq, locReq])
      .then(
        axios.spread((...res) => {
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
    <div className="mx-10" style={{ width: "1100px" }}>
      <span className="w-full flex justify-between py-1 cursor-pointer font-semibold text-sm">
        <button onClick={getLogs}>
          <span
            className={
              "material-icons-outlined border rounded-sm bg-white px-2 py-.5"
            }
          >
            refresh
          </span>
        </button>
        <label className="ml-6">
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
        <label className="ml-6">
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
                  {u.first_name + " " + u.last_name}
                </option>
              );
            })}
          </select>
        </label>
        <label className="ml-6">
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
        {/*  <span>
          <label className="ml-6">
            First
            <input
              name="first"
              value={nameMatch.first}
              onChange={handleNameMatch}
              className="ml-2 p-1"
            />
          </label>
          <label className="ml-6">
            Last
            <input
              name="last"
              value={nameMatch.last}
              onChange={handleNameMatch}
              className="ml-2 p-1"
            />
          </label>
        </span> */}
        <DateSelector handleChangeFilter={handleChangeFilter} />
      </span>
      <Table
        columns={columns}
        paginate={paginate}
        fetchData={getLogs}
        loading={loading}
      />
    </div>
  );
};

const UserSelector = ({ handleChangeFilter }) => {
  const [guest, setGuest] = useState({
    id: null,
    fname: "",
    lname: "",
  });
  const [reqID, setReqID] = useState(null);
  const [user, setUser] = useState({
    id: null,
    fname: "",
    lname: "",
    guests: [],
  });

  const changeUseByID = () => {
    const target = { name: "used_by", value: reqID };
    handleChangeFilter({ target });
  };

  return (
    <span className="relative select-none">
      <span className="border bg-white inline-block ml-8 text-xs px-4 py-1 "></span>
      <div className=" top-8 w-64 flex flex-col bg-white px-3 border right-0 z-10 shadow-sprd rounded py-2">
        <span>
          Find by user
          <label>
            First Name
            <input
              type="text"
              name="from"
              value={user.fname}
              onChange={(e) => setUser({ ...user, fname: e.target.value })}
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              name="to"
              value={user.last_name}
              onChange={(e) => setUser({ ...user, lname: e.target.value })}
            />
          </label>
          <Button className="p-1 font-display border">
            Find user's guests
          </Button>
          {user.guests.length && (
            <select
              name="guest"
              value={guest.id}
              onChange={(e) => setReqID(e.target.value)}
            >
              {user.guests.map((g, ind) => {
                return (
                  <option key={ind} value={g._id}>
                    {g.fname + " " + g.lname}
                  </option>
                );
              })}
            </select>
          )}
        </span>
        <span>
          Find by guest
          <label>
            First Name
            <input
              type="text"
              name="from"
              value={user.fname}
              onChange={(e) => setGuest({ ...guest, fname: e.target.value })}
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              name="to"
              value={user.lname}
              onChange={(e) => setGuest({ ...guest, lname: e.target.value })}
            />
          </label>
        </span>
        {/*   <Button onClick={} className="p-1 font-display border">
          Find
        </Button> */}
      </div>
    </span>
  );
};

const Table = ({ columns, paginate, fetchData, loading }) => {
  const tableInstance = useTable(
    {
      columns,
      data: paginate.data,
      initialState: {
        pageIndex: 0,
        pageSize: 20,
      },
      manualPagination: true,
      pageCount: paginate.total_pages,
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  return (
    <div>
      <div className="h-144 block border-b border-teal-700 overflow-scroll ">
        <table
          {...getTableProps()}
          className=" table-spacing table-auto  w-full text-sm"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="text-left">
                {headerGroup.headers.map((column) => {
                  return (
                    <th
                      {...column.getHeaderProps()}
                      className="sticky bg-teal-700 text-white top-0 py-1.5 pl-4"
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading ? (
              <tr>
                <td colSpan={10000}>
                  <Loading />
                </td>
              </tr>
            ) : (
              <>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="rounded-tl-sm rounded-bl-sm rounded-tr-sm even:bg-gray-100 rounded-br-sm"
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td
                            {...cell.getCellProps({
                              style: {
                                minWidth: cell.column.minWidth,
                                width: cell.column.width,
                              },
                            })}
                            className="border-t border-b border-gray-200 pl-4 py-2"
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between px-2 py-1">
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <span>{paginate.total_count || 0} results</span>
            <span>
              {pageSize * pageIndex + 1} -{pageSize * pageIndex + page.length}
            </span>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              prev
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              next
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length || 1}
              </strong>{" "}
            </span>
            <span>
              Go to page:{" "}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 1;
                  gotoPage(page);
                }}
                style={{ width: "100px" }}
              />
            </span>{" "}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[20, 30, 40, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
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
    <span className="relative select-none">
      <span
        onClick={toggleDRange}
        className="border bg-white inline-block ml-8 text-xs px-4 py-1 "
      >
        Date range
      </span>
      {dateRange.show && (
        <div className=" absolute top-8 w-64 flex flex-col bg-white px-3 border right-0 z-10 shadow-sprd rounded py-2">
          <label>
            from
            <input
              type="datetime-local"
              name="from"
              value={dateRange.from}
              onChange={handleDateRange}
              max={dateRange.to}
              className="block"
            />
          </label>
          <label>
            to
            <input
              type="datetime-local"
              name="to"
              value={dateRange.to}
              onChange={handleDateRange}
              min={dateRange.from}
              className="block"
            />
          </label>
          <Button onClick={handleApply} className="p-1 font-display border">
            Apply
          </Button>
        </div>
      )}
    </span>
  );
};
export default ManageScanLogs;
