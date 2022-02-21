import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Button } from "../../components/Buttons/Main";

const AdminScanner = () => {
  const [scanner, setScanner] = useState({ open: false, data: "No result" });
  return (
    <div className="w-full flex pt-16 md:pt-10 items-center h-full flex-col">
      <Button
        onClick={() =>
          setTimeout(() => {
            setScanner((prev) => {
              return { ...prev, open: !prev.open };
            });
          }, 300)
        }
      >
        {!scanner.open ? "Open scanner" : "Close"}
      </Button>
      <div className=" w-80 mt-5 block md:py-9 py-7 px-3 md:px-5 rounded-lg relative mb-12 border-y-8 border-meadow-500">
        {!scanner.open ? (
          <span className="w-full h-60 block">
            Please allow to access device's camera
          </span>
        ) : (
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                setScanner((prev) => {
                  return { ...prev, data: result?.text };
                });
              }
            }}
            constraints={{ facingMode: "environment", height: 100, width: 100 }}
          />
        )}
      </div>
      <span>{scanner.data}</span>
    </div>
  );
};

export default AdminScanner;
