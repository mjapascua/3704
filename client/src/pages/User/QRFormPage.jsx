import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/Buttons/Main";
import { apiClient } from "../../utils/requests";
import CreateQRForm from "./CreateQRForm";
import GenerateQRCode from "./GenerateQRCode";

const QRFormPage = ({ authConfig }) => {
  const [qr, setQR] = useState({ hash: null, name: null });

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
          <Button primary onClick={requestShareable}>
            Share link
            <span className="material-icons-sharp md:mr-5">share</span>
          </Button>
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

export default QRFormPage;
