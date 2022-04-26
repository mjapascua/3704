import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../../utils/requests";
import { useTable } from "react-table";
import { Button } from "../../components/Buttons/Main";
import Swal from "sweetalert2";

const ManageAccounts = ({ authConfig }) => {
  const [users, setUsers] = useState([]);
  const [item, setItem] = useState(null);
  const [regData, setRegData] = useState({ queue_id: null });
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
      Header: "Edit",
      Cell: ({ row }) => {
        const { _id, first_name, last_name, email, phone_number, residence } =
          row.original;
        return (
          <span
            onClick={() =>
              setItem({
                id: _id,
                first_name,
                last_name,
                email,
                phone_number,
                residence,
              })
            }
            className="material-icons-sharp text-gray-400 cursor-pointer"
          >
            edit
          </span>
        );
      },
    },
  ]);

  const handleChange = ({ target }) => {
    setItem((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    apiClient
      .post(`user/${item.id}/edit`, item, authConfig)
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          toast.success(`User ${res.data.first_name} has been updated`);
        }
      })
      .finally(() => {
        setItem(null);
        fetchUsers();
      });
  };

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

  const startCardRegistration = () => {
    apiClient.post("admin/rfid/register/", { user: item.id }).then((res) => {
      if (res.status === 201 || res.status === 200) {
        Swal.fire({
          title: !res.data
            ? "Waiting for scanner"
            : res.data.message + " waiting for scanner",
          icon: "question",
          showCancelButton: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        }).then((isDismissed) => {
          if (isDismissed) {
            cancelRegistration(res.data.id);
          }
        });

        setRegData((prev) => {
          return { ...prev, queue_id: res.data.id };
        });
      } else toast.error(res.data.message);
    });
  };

  const cancelRegistration = (queue_id) => {
    apiClient.delete("admin/rfid/register/q/" + queue_id).then((res) => {
      if (res.status === 200) {
        setRegData((prev) => {
          return { ...prev, queue_id: null };
        });
        Swal.close();
      }
    });
  };

  const checkRegistration = useCallback(() => {
    if (!regData.queue_id) return;
    let timeout;
    apiClient
      .get("admin/rfid/register/q/" + regData.queue_id, authConfig)
      .then((res) => {
        if (res.status !== 201) {
          timeout = setTimeout(() => {
            checkRegistration();
          }, 10000);
        } else {
          clearTimeout(timeout);
          if (res.data.tag) {
            Swal.fire({
              title: "\n Do you wish to overwrite ",
              text: "Tag is already registered to \n" + res.data.tag.used_by,
              icon: "warning",
              showConfirmButton: true,
              showDenyButton: true,
              allowOutsideClick: false,
            }).then(({ isDenied, isConfirmed }) => {
              if (isDenied) {
                cancelRegistration(regData.queue_id);
              }
              if (isConfirmed) {
                handleRegistration(res.data.tag.uid);
              }
            });
          } else {
            handleRegistration(res.data.available_tag);
          }
        }
      });
  }, [regData]);

  const handleRegistration = (tag_uid) => {
    Swal.fire({
      title: "Register the card",
      showConfirmButton: true,
      input: "text",
      inputLabel: "Full name",
      inputValue: "",
      showConfirmButton: true,
      showDenyButton: true,
      allowOutsideClick: false,
    }).then(({ isDenied, isConfirmed, value }) => {
      if (isDenied) {
        cancelRegistration(regData.queue_id);
      }
      if (isConfirmed) {
        apiClient
          .post("admin/rfid/register/q/" + regData.queue_id, {
            name: value,
            id: tag_uid,
          })
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                title: "Registered!",
                showConfirmButton: true,
                icon: "success",
                text: "Tag is already registered to \n" + res.data.tag.used_by,
              });
            }
          });
      }
    });
  };

  useEffect(() => {
    checkRegistration();
  }, [checkRegistration]);

  return (
    <div className="w-full mx-12">
      <div>
        {item && (
          <>
            <Button primary onClick={startCardRegistration}>
              Add a tag to this account
            </Button>
            <form className="w-full py-1" onSubmit={handleSubmitEdit}>
              <span className="inline-flex w-3/4 justify-between ">
                <label>
                  <input
                    type="text"
                    value={item.first_name}
                    name="first_name"
                    className="form-input !w-40"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <input
                    type="text"
                    value={item.last_name}
                    name="last_name"
                    className="form-input !w-40"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>
                    <span className="px-1 mr-2 py-4 text-base inline-block">
                      <>+63</>
                    </span>
                    <input
                      type="text"
                      name="phone_number"
                      onChange={handleChange}
                      value={item.phone_number}
                      className="form-input !inline-block !w-40"
                      placeholder="9*********"
                      required
                    />
                  </span>
                </label>
                <label>
                  <input
                    type="email"
                    value={item.email}
                    name="email"
                    className="form-input !w-56"
                    onChange={handleChange}
                  />
                </label>
              </span>

              <Button className="w-40" type={"submit"}>
                Submit
              </Button>
            </form>
          </>
        )}
      </div>
      <AccountsTable data={users} columns={columns} />
    </div>
  );
};

const AccountsTable = ({ columns, data }) => {
  const tData = React.useMemo(() => data);
  const tableInstance = useTable({ columns, data: tData });

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
