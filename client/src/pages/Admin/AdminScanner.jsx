import { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "react-toastify";
import { Button } from "../../components/Buttons/Main";
import { apiClient } from "../../utils/requests";

const AdminScanner = ({ authConfig }) => {
  /* useEffect(() => {
    let setNull = setTimeout(() => {
      console.log("nulled");
      setLast(null);
    }, 20000);

    return () => {
      clearTimeout(setNull);
    };
  }, [lastHash]); */

  return (
    <div className="w-full flex pt-16 md:pt-10 items-center h-full flex-col">
      <QRScanner openOnRender={false} authConfig={authConfig} />
    </div>
  );
};
export const QRScanner = ({ openOnRender, authConfig }) => {
  const [lastHash, setLast] = useState(null);
  const [scanner, setScanner] = useState(openOnRender);
  const toastId = useRef(null);

  const handleScanSuccess = (hash) => {
    apiClient
      .post("admin/scan", { hash, location: "site" }, authConfig)
      .then((res) => {
        if (res.status === 200) {
          toastId.current = toast.success(res.data.message, {
            autoClose: 500,
          });
          console.log("set");
          setLast(hash);
        }
      })
      .catch((err) => {
        toastId.current = toast.error(err.response.data.message, {
          autoClose: 500,
        });
      });
  };
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
              if (
                !!result &&
                lastHash !== result?.text &&
                !toast.isActive(toastId.current)
              ) {
                console.log(lastHash);
                //  console.log(toast.isActive(toastId.current));
                handleScanSuccess(result?.text);
              }
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
