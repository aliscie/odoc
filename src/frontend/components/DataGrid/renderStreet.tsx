import { css } from "@linaria/core";
import { Row } from "./index";
import HomeIcon from "@mui/icons-material/Home";

// const avatarClassname = css`
//   margin: auto;
//   background-size: 100%;
//   block-size: 28px;
//   inline-size: 28px;
// `;

export function renderStreet({ row }: { row: Row }) {
  return (
    <div>
      <HomeIcon />
      {row.street}
    </div>
  );
}
