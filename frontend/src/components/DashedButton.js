import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DashedButton({ onClick, content, width }) {
  return (
    <button
      onClick={onClick}
      className={`${
        width ? `w-[${width}]` : "w-full"
      } rounded-lg text-[#2f04ce] text-center p-3 border border-[#2f04ce] border-dashed`}
    >
      {content}
    </button>
  );
}
