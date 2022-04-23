import { ReturnButton } from "../../components/Buttons/Return";

const RenderQRCode = (props) => {
  return (
    <>
      <ReturnButton callback={props.callback} />
      <br />
      <div className="flex items-center flex-col border-2 py-11 bg-white rounded-lg border-gray-700">
        <span className="text-3xl font-display border-b-2 px-3 pb-1 border-meadow-600 mb-2  text-meadow-600 block font-bold">
          Visitor Pass
        </span>
        <img src={props.url} className="w-64 mb-4" />
        <span className=" text-lg font-display font-bold">{props.name}</span>
      </div>
    </>
  );
};

export default RenderQRCode;