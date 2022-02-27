import { useState } from "react";
import { QrReader } from "react-qr-reader";

const GenerateQRCode = () => {
  const [data, setData] = useState("No result");
  return (
    <div>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: "100%" }}
      />
      {data}
    </div>
  );
};

export default GenerateQRCode;
