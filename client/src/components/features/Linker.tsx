import React, { useContext } from "react";
import { LinkingContext } from "../../contexts/app/LinkingContext";
import Button from "../shared/Button";

const Linker: React.FC = () => {
  const { createLink, removeLink } = useContext(LinkingContext);

  return (
    <div>
      <Button onClick={createLink}>Create Link</Button>
      <Button onClick={removeLink}>Remove Link</Button>
    </div>
  );
};

export default Linker;
