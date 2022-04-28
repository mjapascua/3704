import { useEffect, useRef, useState, useCallback } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "react-toastify";
import { Button } from "../../components/Buttons/Main";
import { apiClient } from "../../utils/requests";

const AdminScanner = ({ authConfig }) => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  /* useEffect(() => {
    let setNull = setTimeout(() => {
      console.log("nulled");
      setLast(null);
    }, 20000);

    return () => {
      clearTimeout(setNull);
    };
  }, [lastHash]); */
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
        toast.error(err);
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
  const toastId = useRef(null);
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
          toastId.current = toast.success(res.data.message, {
            autoClose: 500,
          });
        }
      })
      .catch((err) => {
        toastId.current = toast.error(err.response.data.message, {
          autoClose: 500,
        });
      });
    expireHash = setTimeout(() => {
      setLastHash("");
    }, 5000);
  }, [lastHash]);

  useEffect(() => {
    handleScanSuccess();
    return () => {
      clearTimeout(expireHash);
    };
  }, [lastHash]);

  return (
    <>
      <span className="w-48">
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
      </span>

      <div className=" w-80 mt-5 block md:py-9 py-7 px-3 md:px-5 rounded-lg relative mb-12 border-y-8 border-meadow-500">
        {!scanner ? (
          <span className="w-full h-60 block">
            Please allow to access device's camera
          </span>
        ) : (
          <QrReader
            onResult={(result, error) => {
              if (!!result && lastHash !== result?.text) {
                setLastHash(result.text);
              }
              /*  if (
                !!result &&
                lastHash !== result?.text &&
                !toast.isActive(toastId.current)
              ) {
                //  console.log(toast.isActive(toastId.current));
                //handleScanSuccess(result?.text);
              } */
              if (error) {
                toast.error(error);
              }
            }}
            scanDelay={4000}
            constraints={{ facingMode: "environment", height: 100, width: 100 }}
          />
        )}
      </div>
    </>
  );
};
export default AdminScanner;
