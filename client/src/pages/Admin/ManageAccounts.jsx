import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../../utils/requests";
import { useTable } from "react-table";
import { Link } from "react-router-dom";

const ManageAccounts = ({ authConfig }) => {
  return (
    <div className="w-full mx-12">
      <AccountsTable authConfig={authConfig} />
    </div>
  );
};

const AccountsTable = ({ authConfig }) => {
  const [users, setUsers] = useState([]);
  const columns = React.useMemo(() => [
    {
      Header: "First Name",
      accessor: "first_name",
    },
    {
      Header: "Last Name",
      accessor: "last_name",
    },
    {
      Header: "Residence",
      accessor: "residence",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Contact",
      accessor: "phone_number",
    },
    {
      Header: "Page",
      Cell: ({ row }) => {
        return (
          <Link to={row.original._id}>
            <span
              //            onClick={() => handleSelect(row.original)}
              className="text-meadow-600 material-icons-outlined cursor-pointer"
            >
              arrow_circle_right
            </span>
          </Link>
        );
      },
    },
  ]);

  const fetchUsers = useCallback(() => {
    apiClient.get("admin/users", authConfig).then((res) => {
      if (res.status === 200) {
        const data = res.data;
        setUsers(data);
      } else toast.error("User fetch fail!");
    });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return <Table columns={columns} data={users} />;
};

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
};

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
