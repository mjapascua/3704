export const Icon = (props) => {
  return (
    <img
      src={props.data?.src}
      alt={props.data?.alt}
      style={{ filter: props.data?.fill }}
      width={props.data?.size}
      height={props.data?.size}
      className={props.data?.classes + " inline-block"}
    />
  );
};
