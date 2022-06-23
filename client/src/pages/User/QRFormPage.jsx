import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/Buttons/Main";
import { ReturnButton } from "../../components/Buttons/Return";
import { apiClient } from "../../utils/requests";
import CreateQRForm from "./CreateQRForm";
import RenderQRCode from "./RenderQRCode";

const QRFormPage = ({ authConfig }) => {
  const [qr, setQR] = useState({ url: null, name: null });

  const requestShareable = () => {
    apiClient
      .get("/user/request_share_link", authConfig)
      .then((res) => {
        navigator.clipboard.writeText(res.data.link);
        toast("Copied Link!", { theme: "dark" });
      })
      .catch(() =>
        toast.error("Could not generate link! check your connection")
      );
  };

  const handleQRRequest = (data) => {
    apiClient
      .post("user/guests/create-qr", data, authConfig)
      .then((res) => {
        if ((res.status === 201 || res.status === 200) && !res.data.message) {
          toast.success("QR generated!");
          setQR({
            url: res.data.url,
            name: data.fname + " " + data.lname,
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
      {!qr.url ? (
        <div className="w-full">
          <CreateQRForm handleQRRequest={handleQRRequest} />
          <Button primary className="w-2/5" onClick={requestShareable}>
            Share link
            <span className="material-icons-sharp md:mr-5">share</span>
          </Button>
        </div>
      ) : (
        <div className=" w-80 block px-3 md:px-5 relative">
          <ReturnButton callback={() => setQR({ url: null })} />
          <br />
          <RenderQRCode url={qr.url} name={qr.name} />
        </div>
      )}
    </div>
  );
};

export default QRFormPage;
