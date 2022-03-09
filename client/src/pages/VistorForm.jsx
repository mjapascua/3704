import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../utils/requests";
import CreateQRForm from "./User/CreateQRForm";
import GenerateQRCode from "./User/GenerateQRCode";

const VisitorForm = () => {
  const uIds = useParams().uIds.split("_");
  const [qr, setQR] = useState({ hash: null, name: null });

  useEffect(() => {
    apiClient.get(`public/visitor_form/${uIds[0]}/${uIds[1]}`);
  }, [uIds]);

  const handleQRRequest = (data) => {
    apiClient
      .post(`public/visitor_form/submit/${uIds[0]}/${uIds[1]}`, data)
      .then((res) => {
        if ((res.status === 201 || res.status === 200) && !res.data.message) {
          toast.success("QR generated!");
          setQR({
            hash: res.data.hash,
            name: data.first_name + " " + data.last_name,
          });
        }
        toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div>
      {!qr.hash ? (
        <>
          <CreateQRForm handleQRRequest={handleQRRequest} />
        </>
      ) : (
        <div className=" w-80 block px-3 md:px-5 relative">
          <GenerateQRCode
            text={qr.hash}
            name={qr.name}
            callback={() => setQR({ hash: null })}
          />
        </div>
      )}
    </div>
  );
};
export default VisitorForm;
