import axios from "axios";
import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { usePagination, useTable } from "react-table";
import { Button } from "../../components/Buttons/Main";
import { apiClient } from "../../utils/requests";
const dateOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};
const accessTypes = ["AccessString", "RegisteredTag"];

const ManageScanLogs = ({ authConfig }) => {
  const [paginate, setPaginate] = useState({
    data: [],
    total_count: 1,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    users: [],
    locations: [],
    devices: [],
  });
  const [filter, setFilter] = useState({
    by_account: "",
    by_reader: "",
    scan_point: "",
    access_type: "",
  });
  const fetchIdRef = useRef(0);

  const columns = useMemo(() => [
    {
      Header: "",
      accessor: "access_type",
      width: 80,
      Cell: ({ row }) => {
        return (
          <span
            className={
              "material-icons-sharp " +
              (row.original.access_type === "AccessString"
                ? "text-cyan-600"
                : "text-blue-500")
            }
          >
            {row.original.access_type === "AccessString"
              ? "qr_code_2"
              : "contactless"}
          </span>
        );
      },
    },
    {
      Header: "Location",
      accessor: "scan_point.label",
    },
    {
      Header: "Date time",
      accessor: "createdAt",
      maxWidth: 300,
      minWidth: 250,
      width: 250,
      Cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleString(
          undefined,
          dateOptions
        );
      },
    },

    { Header: "First name", accessor: "access_obj.used_by.first_name" },
    { Header: "Last name", accessor: "access_obj.used_by.last_name" },

    { Header: "scanned by", accessor: "by_account.first_name" },
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
        apiClient
          .put(`/admin/scans?limit=${pageSize}&page=${pageIndex}`, cleanFilter)
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
    [filter]
  );

  const handleChangeFilter = ({ target }) => {
    setFilter((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    getLogs({ pageIndex: 0, pageSize: 20 });
  };

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
    <div>
      <form action="" onSubmit={handleSubmitFilter}>
        <span>
          Sort by{" "}
          <label>
            Type
            <select
              name="access_type"
              value={filter.access_type}
              onChange={handleChangeFilter}
            >
              <option value={""}>All</option>
              <option value={accessTypes[0]}>QR</option>
              <option value={accessTypes[1]}>RFID</option>
            </select>
          </label>
          <label>
            Location
            <select
              name="scan_point"
              value={filter.location}
              onChange={handleChangeFilter}
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
          <label>
            Account
            <select
              name="by_account"
              value={filter.by_account}
              onChange={handleChangeFilter}
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
          <label>
            Device
            <select
              name="by_reader"
              value={filter.by_reader}
              onChange={handleChangeFilter}
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
          <Button primary type="submit">
            ok
          </Button>
        </span>
      </form>
      <Table
        columns={columns}
        paginate={paginate}
        fetchData={getLogs}
        loading={loading}
      />
    </div>
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
      <div className=" h-96 block overflow-scroll border-b-3 border-teal-800">
        <table
          {...getTableProps()}
          className=" table-spacing table-auto  w-full text-sm "
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="text-left">
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="sticky bg-teal-800 text-white px-2 top-0 py-3"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
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
                        className="border-t border-b border-gray-200 p-4"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <span>
          Showing {page.length} of {paginate.total_count}
          results
        </span>
      )}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          prev
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          next
        </button>{" "}
        <button onClick={() => gotoPage(pageCount)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
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
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default ManageScanLogs;
