import { useEffect, useRef, useState, useCallback } from "react";
import { QrReader } from "react-qr-reader";
import Swal from "sweetalert2";
import { Button } from "../../components/Buttons/Main";
import { apiClient } from "../../utils/requests";

const AdminScanner = ({ authConfig }) => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const getLoc = useCallback(() => {
    apiClient
      .get("admin/locations", authConfig)
      .then((res) => {
        if (res.status === 200) {
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
    <div className="w-screen flex pt-16 md:pt-10 items-center h-full flex-col">
      <label className="ml-6">
        Location
        <select
          name="scan_point"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          className="ml-2"
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
      setLastHash("");
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

      <div className=" w-96 mt-5 block md:py-9 py-7 px-3 md:px-5 rounded-lg ">
        {!scanner ? (
          <span className="w-full h-60 block">
            Please allow to access device's camera
          </span>
        ) : (
          <QrReader
            ViewFinder={() => (
              <div className="block absolute top-0 h-4/5 m-9 w-4/5 p-5 border-4 z-20 border-red-500"></div>
            )}
            className={"qr-vid-container"}
            onResult={(result, error) => {
              if (!!result && lastHash !== result?.text) {
                setLastHash(result.text);
              }
            }}
            style={{ width: "40%" }}
            constraints={{ facingMode: "environment", height: 100, width: 100 }}
          />
        )}
      </div>
    </div>
  );
};
export default AdminScanner;
