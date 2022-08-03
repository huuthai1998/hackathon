import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DashedButton from "./DashedButton";
import { Link, useLocation, useParams } from "react-router-dom";
import ContentTypePopup from "./ContentTypePopup";

function ContentTypeBox({ content }) {
  const location = useLocation();
  let { id } = useParams();

  return (
    <Link
      key={content.id}
      to={`/builder/${content.id}?name=${content.name}`}
      className={`${
        content.id !== id || !location.pathname.includes("builder")
          ? "text-grayBar border-white bg-white"
          : "border-highlightPurple text-white bg-highlightPurple"
      } border items-center align-middle text-white p-3 my-3 flex justify-between ${"w-full"} rounded-lg`}
    >
      <p className=""> {content.name}</p>
    </Link>
  );
}

export default function ContentTypes({
  count,
  contentTypes,
  createNewContentTypeHandler,
}) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  const onChangeHandler = (e) => {
    setName(e.currentTarget.value);
  };

  const closeModal = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await createNewContentTypeHandler(name);
    setShowModal(false);
  };
  return (
    <div className="w-[300px] px-[30px] py-5 bg-[#D3D7E6] min-h-screen">
      <div className="flex justify-between">
        <p className="mb-5">{count} Types</p>
        <FontAwesomeIcon icon={faSearch} size="lg" className="text-grayBar" />
      </div>
      <DashedButton
        content={"+ New Type"}
        onClick={() => {
          setShowModal(true);
        }}
      />
      {contentTypes.map((item) => (
        <ContentTypeBox content={item} key={item.id} />
      ))}
      <ContentTypePopup
        show={showModal}
        closeModal={closeModal}
        submitHandler={submitHandler}
        onChangeHandler={onChangeHandler}
      />
    </div>
  );
}
