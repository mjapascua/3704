import React, { useCallback, useState, useEffect } from "react";
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
    <div>
      <AwaitingVerification authConfig={authConfig} />
      <AccountsTable authConfig={authConfig} />
    </div>
  );
};

const UnverifiedCard = ({ account, authConfig }) => {
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
    <div className="p-3 border rounded-sm bg-white mr-5">
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
                ? "Not yet verified"
                : "Awaiting email confirmation"}
            </b>
          </span>
          {!data.verified && (
            <Button onClick={verifyAccount} disabled={!data.role} primary>
              Verify
            </Button>
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
    <div className="flex w-full py-2 overflow-x-scroll">
      {loading ? (
        <Loading />
      ) : (
        accounts.map((acc, i) => {
          return (
            <React.Fragment key={i}>
              <UnverifiedCard account={acc} authConfig={authConfig} />
            </React.Fragment>
          );
        })
      )}
    </div>
  );
};

const AccountsTable = ({ authConfig }) => {
  const isMounted = useIsMounted();

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

  const fetchUsers = useCallback(({ pageIndex, pageSize }) => {
    setLoading(true);
    apiClient
      .get(`admin/users?limit=${pageSize}&page=${pageIndex}`, authConfig)
      .then((res) => {
        if (res.status === 200 && isMounted) {
          setPaginate({ ...res.data, page_size: paginate.page_size });
        }
      })
      .catch(() => toast.error("User fetch fail!"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Table
      columns={columns}
      paginate={paginate}
      fetchData={fetchUsers}
      loading={loading}
    />
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
