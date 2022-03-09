import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";
import { apiClient } from "../utils/requests";
import CreateQRForm from "./User/CreateQRForm";
import RenderQRCode from "./User/RenderQRCode";

const VisitorForm = () => {
  const uIds = useParams().uIds.split("_");
  const [qr, setQR] = useState({ url: null, name: null });
  const [status, setStatus] = useState({ loading: false });

  const checkValidity = useCallback(() => {
    setStatus({ loading: true });
    apiClient
      .get(`public/visitor_form/${uIds[0]}/${uIds[1]}`)
      .then((res) => {
        if (res.status === 200 && res.data === "success")
          setStatus({ loading: false, valid: true });
      })
      .catch((err) =>
        setStatus({
          loading: false,
          valid: false,
          message: err.response.data.message,
        })
      );
  }, []);

  const handleQRRequest = (data) => {
    apiClient
      .post(`public/visitor_form/submit/${uIds[0]}/${uIds[1]}`, data)
      .then((res) => {
        if ((res.status === 201 || res.status === 200) && !res.data.message) {
          toast.success("QR generated!");
          setQR({
            hash: res.data.url,
            name: data.first_name + " " + data.last_name,
          });
        }
        toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    checkValidity();
  }, [checkValidity]);

  return (
    <div>
      {status.loading && <Loading />}
      {!status.loading && !status.valid && (
        <div className="w-full h-screen justify-center flex items-center text-gray-600">
          {status?.message}
        </div>
      )}
      {!qr.url && status.valid && (
        <CreateQRForm handleQRRequest={handleQRRequest} />
      )}
      {qr.url && status.valid && (
        <div className=" w-80 block px-3 md:px-5 relative">
          <RenderQRCode
            url={qr.url}
            name={qr.name}
            callback={() => setQR({ url: null })}
          />
        </div>
      )}
    </div>
  );
};
export default VisitorForm;
