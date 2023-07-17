import { useContext } from "react";
import { LinkingContext } from "../contexts/app/LinkingContext";

function useLinking() {
  const { createLink, removeLink } = useContext(LinkingContext);

  return {
    createLink,
    removeLink,
  };
}
