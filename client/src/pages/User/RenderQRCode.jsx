const RenderQRCode = (props) => {
  return (
    <div className="border-2 bg-white rounded-lg border-gray-700">
      <span className="text-2xl font-display py-2 mb-2 bg-slate-700 w-full text-center text-white block font-bold">
        QR Pass
      </span>
      <span className="py-3 px-5 flex items-center flex-col">
        <img src={props.url} className="w-64 mb-4" />
        <span className=" text-2xl font-display font-semibold">
          {props.name}
        </span>
        <span className=" w-5/6 text-center text-lg font-display font-semibold text-cyan-600 border-t-2 border-slate-700 py-2 my-2">
          {props.resident ? "Resident" : "Guest"}
        </span>
        <span className=" text-center text-sm font-semibold mt-2">
          {process.env.REACT_APP_NAME}
        </span>
      </span>
    </div>
  );
};

export default RenderQRCode;
