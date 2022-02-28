import { useEffect, useState } from "react";
import QRCode from "qrcode";

const GenerateQRCode = () => {
  const [data, setData] = useState("");
  const generateQR = (text) => {
    QRCode.toDataURL(text)
      .then((url) => {
        setData(url);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    generateQR("9e107d9d372bb6826bd81d3542a419d6");
  }, []);

  return (
    <div>
      <img src={data} width="250" />
    </div>
  );
};

export default GenerateQRCode;
