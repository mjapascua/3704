import { useEffect, useRef, useState, useCallback } from "react";
import { QrReader } from "react-qr-reader";
import Swal from "sweetalert2";
import { Button } from "../../components/Buttons/Main";
import { useAuthHeader } from "../../utils/authService";
import { useIsMounted } from "../../utils/general";
import { apiClient } from "../../utils/requests";

const AdminScanner = () => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const authConfig = useAuthHeader();
  const isMounted = useIsMounted();

  const getLoc = useCallback(() => {
    apiClient
      .get("admin/locations?a=true", authConfig)
      .then((res) => {
        if (res.status === 200 && isMounted) {
          setLocations(res.data);
          setLocation(res.data[0]._id);
        }
      })
      .catch((err) => {
        Swal.fire({ title: "Scanner fail", icon: "error", text: err });
      });
  }, []);

  useEffect(() => {
    getLoc();
  }, [getLoc]);

  return (
    <div className="w-full flex bg-slate-50 shadow-lg p-4 items-center h-full flex-col">
      <label className="p-2">
        <b>Location</b>
        <select
          name="scan_point"
          value={location}
          onChange={(e) => {
            if (isMounted) setLocation(e.target.value);
          }}
          className="ml-3"
        >
          {locations.map((l, index) => {
            return (
              <option key={index} value={l._id}>
                {l.label}
              </option>
            );
          })}
        </select>
      </label>
      <QRScanner
        location={location}
        openOnRender={false}
        authConfig={authConfig}
      />
    </div>
  );
};

export const QRScanner = ({ location, openOnRender, authConfig }) => {
  const [scanner, setScanner] = useState(openOnRender);
  const [lastHash, setLastHash] = useState("");
  const isMounted = useIsMounted();
  let expireHash;

  const handleScanSuccess = useCallback(() => {
    if (!lastHash) return;
    apiClient
      .post(
        "admin/scan",
        { hash: lastHash, locID: location ? location : null },
        authConfig
      )
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "SUCCESS",
            icon: "success",
            customClass: {
              popup: "qr-success-popup",
            },
            showConfirmButton: false,
            timer: "2000",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "NO MATCH",
          icon: "error",
          customClass: {
            popup: "qr-error-popup",
          },
          showConfirmButton: false,
          timer: "2000",
        });
      });
    expireHash = setTimeout(() => {
      if (isMounted) setLastHash("");
    }, 8000);
  }, [lastHash]);

  useEffect(() => {
    handleScanSuccess();
    return () => {
      clearTimeout(expireHash);
    };
  }, [lastHash]);

  return (
    <div className="flex flex-col items-center relative">
      <Button
        primary
        onClick={() =>
          setTimeout(() => {
            setScanner((prev) => !prev);
          }, 300)
        }
      >
        {!scanner ? "Open scanner" : "Close"}
      </Button>
      <div className="mt-4 bg-black md:p-10">
        <div className=" w-80 h-80 md:w-96 md:h-96 text-center  block">
          {!scanner ? (
            <span className="h-full pt-5 text-white block">
              Please allow to access device's camera
            </span>
          ) : (
            <QrReader
              ViewFinder={() => (
                <div className="block absolute top-0 h-3/5 my-16 mx-7 md:my-20 w-5/6 p-5 border-4 rounded-2xl z-20 border-white"></div>
              )}
              className={"qr-vid-container"}
              onResult={(result, error) => {
                if (!!result && lastHash !== result?.text) {
                  setLastHash(result.text);
                }
              }}
              constraints={{
                facingMode: "environment",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminScanner;
