import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../../utils/requests";
import { Button } from "../../components/Buttons/Main";
import Swal from "sweetalert2";
import Loading from "../../components/Loading/Loading";
import { useParams } from "react-router-dom";
import { ReturnButton } from "../../components/Buttons/Return";

const steps = [1, 2, 3];

const AccountPage = ({ authConfig }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [regData, setRegData] = useState({ guest: "" });
  const [queue_id, setQueue] = useState(null);
  const param = useParams();
  let timeout;

  const Queue = Swal.mixin({
    progressSteps: steps,
    customClass: {
      loader: "p-1 !bg-red-700",
      timerProgressBar: "!bg-emerald-500",
      cancelButton:
        "bg-rose-500 rounded-sm py-1.5 px-4 text-white font-display font-semibold",
      title: "!font-red-500",
    },
    buttonsStyling: false,
    // optional classes to avoid backdrop blinking between steps
    showClass: { backdrop: "swal2-noanimation" },
    hideClass: { backdrop: "swal2-noanimation" },
    allowOutsideClick: false,
  });

  const handleEdit = ({ target }) => {
    setUser((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const handleSelectGuest = ({ target }) => {
    setRegData({ guest: user.guests[target.value] });
  };

  const getUser = useCallback(() => {
    apiClient.get("admin/user/" + param.id, authConfig).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setUser(res.data);
        setLoading(false);
      }
    });
  }, []);

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    apiClient.put(`user/${user._id}`, user, authConfig).then((res) => {
      if (res.status === 200) {
        toast.success(`User ${res.data.fname} has been updated`);
      }
    });
  };

  const cancelRegistration = (id) => {
    apiClient.delete("admin/rfid/register/q/" + id).then(() => {
      setQueue(null);
    });
  };

  const startCardRegistration = () => {
    apiClient.post("admin/rfid/register/", { user: user._id }).then((res) => {
      if (res.status === 201 || res.status === 200) {
        setQueue(res.data.id);
        Queue.fire({
          title: !res.data
            ? "Waiting for scanner"
            : res.data.message + " waiting for scanner",
          icon: "question",
          currentProgressStep: 0,
          showConfirmButton: false,
          showCancelButton: true,
          showClass: { backdrop: "swal2-noanimation" },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            cancelRegistration(res.data.id);
          }
        });
      } else toast.error(res.data.message);
    });
  };

  const checkRegistration = useCallback(() => {
    if (!queue_id) return;
    apiClient
      .get("admin/rfid/register/q/" + queue_id, authConfig)
      .then((res) => {
        if (res.status !== 201) {
          timeout = setTimeout(() => {
            checkRegistration();
          }, 7000);
        } else {
          clearTimeout(timeout);
          Swal.fire();
          if (res.data.name) {
            Queue.fire({
              title: "\n Do you wish to overwrite? ",
              text: "Tag is already registered to \n" + res.data.name,
              currentProgressStep: 2,
              icon: "warning",
              showConfirmButton: true,
              showCancelButton: true,
              showClass: { backdrop: "swal2-noanimation" },
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.cancel) {
                cancelRegistration(queue_id);
              }
            });
          } else {
            //  const tag = res.data.taf;
            Queue.fire({
              title: "Card detected!",
              icon: "success",
              currentProgressStep: 1,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              showClass: { backdrop: "swal2-noanimation" },
            });
          }
        }
      });
  }, [queue_id]);

  const handleRegistration = () => {
    apiClient
      .post("admin/rfid/register/q/" + queue_id, {
        u_id: user._id,
        guest: regData?.guest._id,
      })
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          setQueue(null);
          Queue.fire({
            title: "Registered!",
            showConfirmButton: true,
            icon: "success",
            currentProgressStep: 3,
            text: "Tag is registered\n",
          });
        }
      });
    /*   Swal.fire({
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
        cancelRegistration(queue_id);
      }
      if (isConfirmed) {
        
      }
    }); */
  };

  const warnIfGuestHasRF = () => {
    if (regData.guest.rf) {
      Queue.fire({
        title: "\n Do you wish to overwrite? ",
        text: "This guest already has a card registered",
        currentProgressStep: 2,
        icon: "warning",
        showConfirmButton: true,
        showCancelButton: true,
        showClass: { backdrop: "swal2-noanimation" },
      }).then(({ dismiss, isConfirmed }) => {
        if (dismiss === Swal.DismissReason.cancel) {
          cancelRegistration(queue_id);
        }
        if (isConfirmed) {
          handleRegistration();
        }
      });
    } else handleRegistration();
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    checkRegistration();
    return () => {
      clearTimeout(timeout);
    };
  }, [checkRegistration]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ReturnButton default="/dashboard/accounts" />
          <form className="w-full py-1" onSubmit={handleSubmitEdit}>
            <span className="inline-flex w-3/4 justify-between ">
              <label>
                <input
                  type="text"
                  value={user.fname}
                  name="fname"
                  className="form-input !w-40"
                  onChange={handleEdit}
                />
              </label>
              <label>
                <input
                  type="text"
                  value={user.lname}
                  name="lname"
                  className="form-input !w-40"
                  onChange={handleEdit}
                />
              </label>
              <label>
                <span>
                  <span className="px-1 mr-2 py-4 text-base inline-block">
                    <>+63</>
                  </span>
                  <input
                    type="text"
                    name="contact"
                    onChange={handleEdit}
                    value={user.contact}
                    className="form-input !inline-block !w-40"
                    placeholder="9*********"
                    required
                  />
                </span>
              </label>
              <label>
                <input
                  type="email"
                  value={user.email}
                  name="email"
                  className="form-input !w-56"
                  onChange={handleEdit}
                />
              </label>
            </span>

            <Button className="w-40" type={"submit"}>
              Save
            </Button>

            {!queue_id ? (
              <Button primary onClick={startCardRegistration}>
                Add a tag to this account
              </Button>
            ) : (
              <>
                <Button primary onClick={handleRegistration}>
                  Add to this user
                </Button>
                or
                <label className="ml-4">
                  Select a guest
                  <select
                    name="by"
                    onChange={handleSelectGuest}
                    className="ml-2"
                  >
                    <option value={""}></option>
                    {user.guests.map((g, index) => {
                      return (
                        <option key={index} value={index}>
                          {g.fname + " " + g.lname}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <Button
                  primary
                  disabled={!regData.guest ? true : false}
                  onClick={warnIfGuestHasRF}
                >
                  Add to guest
                </Button>
                <Button
                  className="text-white bg-rose-600"
                  onClick={() => cancelRegistration(queue_id)}
                >
                  Cancel
                </Button>
              </>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default AccountPage;
