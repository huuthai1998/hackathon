import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import DashedButton from "./DashedButton";
import FieldCard from "./FieldCard";
import { useAuthContext } from "../contexts/authStore";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import ContentTypePopup from "./ContentTypePopup";

const getTabName = (search) => {
  return new URLSearchParams(search).get("name");
};

export default function ContentTypeFields() {
  const { authContext } = useAuthContext();
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [fields, setFields] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [info, setInfo] = useState({});

  const onChangeHandler = (e) => {
    const { name, value } = e.currentTarget;
    setInfo({ ...info, [name]: value.toLowerCase() });
  };

  const onSelectType = (value) => {
    setInfo({ ...info, fieldType: value });
  };

  const closeModal = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      await axios.post(`/contentType/field/${id}`, info);
      await fetchFields();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  let { id } = useParams();

  const { search } = useLocation();

  useEffect(() => {
    setName(getTabName(search));
  }, [search]);

  const fetchFields = async () => {
    const { data } = await axios.get(`/contentType/field/${id}`);
    setFields(data.rows);
    setCount(data.count);
  };

  useEffect(() => {
    if (authContext.token.length > 0) fetchFields();
  }, [authContext.token, id]);

  return (
    <div className="min-h-screen flex-1 bg-[#eaeeff] p-5">
      <div className="flex items-baseline">
        <h1 className="text-2xl">{name}</h1>
        <FontAwesomeIcon
          icon={faEdit}
          size="lg"
          className="text-grayBar ml-4"
        />
      </div>
      <h3 className="text-[#4f4f4f]">{count} Fields</h3>
      <DashedButton
        content={"Add another field"}
        onClick={() => {
          setShowModal(true);
        }}
      />

      {fields.map((item) => (
        <FieldCard key={item.id} name={item.fieldName} type={item.fieldType} />
      ))}
      <ContentTypePopup
        type={"addFieldModal"}
        show={showModal}
        closeModal={closeModal}
        submitHandler={submitHandler}
        onChangeHandler={onChangeHandler}
        onSelectType={onSelectType}
      />
    </div>
  );
}
