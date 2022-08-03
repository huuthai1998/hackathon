import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function FieldCard({ name, type }) {
  return (
    <div className="my-3 rounded-lg flex justify-between w-full p-4 px-6 bg-white border border-white">
      <p className="">{name}</p>
      <p className="text-[#363636] opacity-50">{type}</p>
      <div className="flex">
        <FontAwesomeIcon
          icon={faEdit}
          size="lg"
          className="text-grayBar mr-8"
        />
        <FontAwesomeIcon icon={faTrash} size="lg" className="text-grayBar" />
      </div>
    </div>
  );
}
