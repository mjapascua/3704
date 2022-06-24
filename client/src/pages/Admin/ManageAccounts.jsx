import React, { useCallback, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../../utils/requests";
import { Link } from "react-router-dom";
import Table from "../../components/Table/Table";
import Loading from "../../components/Loading/Loading";
import { Button } from "../../components/Buttons/Main";
import authService, { useAuthHeader } from "../../utils/authService";
import { useIsMounted } from "../../utils/general";

const ManageAccounts = () => {
  const authConfig = useAuthHeader();

  return (
    <div className="w-full">
      <AwaitingVerification authConfig={authConfig} />
      <span className="font-bold block text-lg px-1 mt-10 mb-5 text-slate-600">
        Registered Accounts
      </span>
      <AccountsTable authConfig={authConfig} />
    </div>
  );
};

const UnverifiedCard = ({ account, authConfig, rejectAccount }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(account);

  const verifyAccount = () => {
    const toastId = 1;
    setLoading(true);
    if (!data.verified) {
      try {
        toast.info("Sending email confirmation", {
          toastId: toastId,
          autoClose: false,
        });
        apiClient
          .put("admin/verify/" + data._id, { role: data.role }, authConfig)
          .then((res) => {
            if (res.status === 200) {
              setData(res.data.account);
              toast.update(toastId, {
                type: toast.TYPE.SUCCESS,
                render: res.data.message,
                autoClose: 2000,
              });
            }
          });
      } catch (error) {
        toast.update(toastId, {
          type: toast.TYPE.ERROR,
          render: error.response.message,
          autoClose: 2000,
        });
      }
      setLoading(false);
    }
  };

  const handleSetRole = (e) => {
    setData((prev) => {
      return { ...prev, role: e.target.value };
    });
  };

  const showRoleType = () => {
    switch (data.role) {
      case authService.ROLES.BASIC:
        return <span>Role : Resident</span>;
      case authService.ROLES.EDITOR:
        return <span>Role : Employee</span>;
      case authService.ROLES.ADMIN:
        return <span>Role : Admin</span>;
      default:
        break;
    }
  };

  return (
    <div className="p-4 border rounded shadow mr-5">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-between">
          <span>Name : {data.fname + " " + data.lname}</span>
          <span>Residence : {data.residence}</span>
          <span>Email : {data.email}</span>
          <span>Contact : {data.contact}</span>
          {data.verified ? (
            showRoleType()
          ) : (
            <label>
              <select
                name="role"
                value={data.role || ""}
                onChange={handleSetRole}
                className="mx-4"
              >
                <option value={""}>NOT SET</option>
                <option value={authService.ROLES.BASIC}>Resident</option>
                <option value={authService.ROLES.EDITOR}>Employee</option>
                <option value={authService.ROLES.ADMIN}>Admin</option>
              </select>
            </label>
          )}
          <span>
            Status :
            <b className={!data.verified ? "text-rose-500" : "text-violet-700"}>
              {!data.verified
                ? " Not yet verified"
                : " Awaiting email confirmation"}
            </b>
          </span>
          {!data.verified && (
            <>
              <Button
                onClick={rejectAccount}
                className="w-56 bg-rose-500 mb-2 mt-4 block text-slate-50"
              >
                Reject
              </Button>
              <Button onClick={verifyAccount} disabled={!data.role} primary>
                Verify
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const AwaitingVerification = ({ authConfig }) => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const isMounted = useIsMounted();

  const rejectAccount = (id) => {
    const toastId = 1;
    setLoading(true);
    try {
      apiClient
        .put("admin/verify/" + id, { reject: true }, authConfig)
        .then((res) => {
          if (res.status === 200) {
            fetchAccounts();
            toast.update(toastId, {
              type: toast.TYPE.SUCCESS,
              render: res.data.message,
              autoClose: 2000,
            });
          }
        });
    } catch (error) {
      toast.update(toastId, {
        type: toast.TYPE.ERROR,
        render: error.response.message,
        autoClose: 2000,
      });
    }
    setLoading(false);
  };

  const fetchAccounts = useCallback(() => {
    setLoading(true);
    apiClient
      .get("admin/unverified", authConfig)
      .then((res) => {
        if (res.status === 200 && isMounted) {
          setAccounts(res.data);
        }
      })
      .catch(() => toast.error("Account fetch fail!"));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <>
      <span className="font-bold block text-lg px-1 mb-2 text-slate-600">
        Unapproved accounts
      </span>
      <div className="flex bg-slate-100 w-full py-2 overflow-x-scroll">
        {accounts.length > 0 ? (
          accounts.map((acc, i) => {
            return (
              <React.Fragment key={i}>
                <UnverifiedCard
                  account={acc}
                  authConfig={authConfig}
                  rejectAccount={() => rejectAccount(acc._id)}
                />
              </React.Fragment>
            );
          })
        ) : (
          <span className="text-center font-semibold w-full text-slate-400">
            No accounts for approval.
          </span>
        )}
      </div>
    </>
  );
};

const AccountsTable = ({ authConfig }) => {
  const isMounted = useIsMounted();
  const [filter, setFilter] = useState({
    role: "",
  });
  const fetchIdRef = useRef(0);

  const columns = React.useMemo(() => [
    {
      Header: "First Name",
      accessor: "fname",
    },
    {
      Header: "Last Name",
      accessor: "lname",
    },
    {
      Header: "Residence",
      accessor: "residence",
      width: "120",
    },
    {
      Header: "Email",
      accessor: "email",
      width: "100",
    },
    {
      Header: "Contact",
      accessor: "contact",
    },
    {
      Header: " ",
      width: "40",
      Cell: ({ row }) => {
        return (
          <Link to={row.original._id}>
            <span
              //            onClick={() => handleSelect(row.original)}
              className="text-meadow-600 material-icons-outlined cursor-pointer mx-3"
            >
              arrow_circle_right
            </span>
          </Link>
        );
      },
    },
  ]);
  const [paginate, setPaginate] = useState({
    data: [],
    total_count: 1,
    total_pages: 1,
    page_size: 20,
  });
  const [loading, setLoading] = useState(false);

  const handleChangeFilter = ({ target }) => {
    if (isMounted)
      setFilter((prev) => {
        return { ...prev, [target.name]: target.value };
      });
  };

  const fetchUsers = useCallback(
    ({ pageIndex, pageSize }) => {
      const fetchId = ++fetchIdRef.current;

      if (fetchId === fetchIdRef.current) {
        setLoading(true);
        apiClient
          .get(
            `admin/users?limit=${pageSize}&page=${pageIndex}&r=${filter.role}`,
            authConfig
          )
          .then((res) => {
            if (res.status === 200 && isMounted) {
              setPaginate({ ...res.data, page_size: paginate.page_size });
            }
          })
          .catch(() => toast.error("User fetch fail!"))
          .finally(() => setLoading(false));
      }
    },
    [filter]
  );

  /* useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); */

  return (
    <>
      <span className="w-full flex justify-between py-1 cursor-pointer font-semibold text-sm">
        <label>
          Account type
          <select
            name="role"
            value={filter.role}
            onChange={handleChangeFilter}
            className="ml-2"
          >
            <option value={""}>All</option>
            {Object.keys(authService.ROLES).map((r, index) => {
              return (
                <option key={index} value={r}>
                  {r}
                </option>
              );
            })}
          </select>
        </label>
      </span>
      <Table
        columns={columns}
        paginate={paginate}
        fetchData={fetchUsers}
        loading={loading}
      />
    </>
  );
};
/* 
const Table = ({ columns, data }) => {
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div>
      <table
        {...getTableProps()}
        className="border-separate table-spacing table-auto w-full my-5"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className=" text-left bg-gray-600 text-white"
            >
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className=" px-2 py-1">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="shadow border border-gray-800 rounded-tl-sm rounded-bl-sm rounded-tr-sm rounded-br-sm"
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="p-3">
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
  );
}; */

export default ManageAccounts;

/* const completeRegistration = (tag_id, name) => {
    console.log("finishing..");
    apiClient
      .post("admin/rfid/register/q/" + regData.queue_id, {
        name: name,
        id: tag_id,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(1);
        }
      });
  };
 */
