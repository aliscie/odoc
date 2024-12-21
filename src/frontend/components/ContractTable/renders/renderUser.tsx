import { useSelector } from "react-redux";

export function RenderUser(props) {
  const { all_friends, profile } = useSelector(
    (state: any) => state.filesState,
  );
  let users = [...all_friends, profile];
  let user = { name: "None" };
  if (props.value !== "2vxsx-fae") {
    user = users.find((u) => u.id == props.value);
  }

  return <dive {...props}>{user && user.name}</dive>;
}
