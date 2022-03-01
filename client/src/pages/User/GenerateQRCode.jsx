import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "react-toastify";
import { useCallback } from "react";

const GenerateQRCode = (props) => {
  const [data, setData] = useState("");
  const generateQR = useCallback(() => {
    QRCode.toDataURL(props.text)
      .then((url) => {
        setData(url);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [props.text]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  return (
    <div className="flex items-center flex-col border-2 rounded-lg py-11 border-gray-700">
      <span className="text-3xl font-display border-b-2 px-3 pb-1 border-meadow-600 mb-2  text-meadow-600 block font-bold">
        Visitor Pass
      </span>
      <img src={data} className="w-64 mb-4" />
      <span className=" text-lg font-display font-bold">{props.name}</span>
    </div>
  );
};

export default GenerateQRCode;
