import { CLIENT_NAME } from "../../utils/appInfo";

const RenderQRCode = (props) => {
  return (
    <div className="border-4 rounded-lg text-center bg-slate-700 border-gray-700">
      <span className="text-2xl font-display py-2 mb-1 w-full text-center text-white block font-bold">
        QR Pass
      </span>
      <span className="p-5 bg-white rounded-lg flex items-center flex-col">
        <img src={props.url} className="w-64 mb-4" />
        <span className=" text-2xl font-display font-semibold">
          {props.name}
        </span>
        <span className=" w-5/6 text-center text-lg font-display font-semibold text-cyan-600 border-t-2 border-slate-700 py-2 my-2">
          {props.resident ? "Resident" : "Guest"}
        </span>
      </span>
      <span className=" w-full text-white text-sm font-semibold mt-2">
        {CLIENT_NAME}
      </span>
    </div>
  );
};

export default RenderQRCode;
