import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashedButton from "../components/DashedButton";
import { useAuthContext } from "../contexts/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { notification } from "antd";
import AddEntry from "../components/AddEntry";

export default function EntriesPage() {
  const { authContext } = useAuthContext();

  const [entries, setEntries] = useState([]);
  const [count, setCount] = useState(0);
  const [fields, setFields] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [info, setInfo] = useState({});

  const onChangeHandler = (e) => {
    const { name, value } = e.currentTarget;
    setInfo({ ...info, [name]: value });
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`/contentType/entry/${id}`, info);
      await fetchEntries();
      setShowAddModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  let { id } = useParams();
  const fetchEntries = async () => {
    const { data } = await axios.get(`/contentType/entry/${id}`);
    setEntries(data.rows);
    setCount(data.count);
    const { data: columns } = await axios.get(`/contentType/field/${id}`);
    console.log(columns);
    setFields(["ID", ...columns.rows.map((item) => item.fieldName), "Actions"]);
  };

  const renderFields = () =>
    fields.map((item, idx) => (
      <th className="text-left" key={idx}>
        {item}
      </th>
    ));

  const renderEntries = () => {
    return entries.map((item, idx) => {
      return (
        <tr key={idx} className="bg-white p-4 rounded-lg items-center">
          {Object.keys(item).map((output) => (
            <td className="bg-white p-4" key={output}>
              {item[output]}
            </td>
          ))}
          <td className="flex items-center p-4">
            <FontAwesomeIcon
              icon={faCopy}
              className="text-grayBar mr-4 cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faEdit}
              className="text-grayBar mr-4 cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="text-grayBar mr-4 cursor-pointer"
              onClick={handleDelete(item.id)}
            />
          </td>
        </tr>
      );
    });
  };

  const handleDelete = (entryId) => async () => {
    try {
      await axios.delete(`/contentType/entry/${entryId}`, {
        data: {
          contentTypeId: id,
        },
      });
      await fetchEntries();
      notification.info({
        message: `Delete entry with id ${entryId}`,
        placement: "top",
        duration: 2,
      });
    } catch (err) {
      notification.error({
        message: err.message,
        placement: "top",
        duration: 2,
      });
    }
  };
  useEffect(() => {
    if (authContext.token.length > 0) fetchEntries();
  }, [authContext.token, id]);

  return (
    <div className="flex-1 min-h-screen p-5 bg-[#eaeeff]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">{count} Entries Found</h2>
        <DashedButton
          content={"Add a new entry"}
          width={64}
          onClick={() => {
            setShowAddModal(true);
          }}
        />
      </div>
      <table className="w-full">
        <thead>
          <tr>{renderFields()}</tr>
        </thead>
        <tbody className="items-center">{renderEntries()}</tbody>
      </table>
      <AddEntry
        show={showAddModal}
        fields={fields}
        onChangeHandler={onChangeHandler}
        submitHandler={submitHandler}
      />
    </div>
  );
}
