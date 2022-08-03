import { Select } from "antd";
import React from "react";

const InputBox = ({ onChangeHandler, name, label }) => (
  <div className="my-4">
    <label htmlFor="name" className="text-grayBar mb-4">
      {label}
    </label>
    <input
      type="text"
      className="w-full rounded-lg border border-[#91a5fe] bg-[#fcfcfc] p-2"
      name={name}
      onChange={onChangeHandler}
    />
  </div>
);

export default function ContentTypePopup({
  type,
  show,
  submitHandler,
  onChangeHandler,
  closeModal,
  onSelectType,
}) {
  if (show)
    return (
      <div className="min-h-screen min-w-screen">
        <div className="bg-black opacity-80 min-h-screen w-screen absolute top-0 left-0"></div>
        <div className="contentModal h-[350px] bg-white absolute top-0 left-0 w-[500px] mr-auto ml-auto">
          {type === "addFieldModal" ? (
            <form action="" className="p-6">
              <h1 className="text-lg font-bold"> Create a new field</h1>
              <InputBox
                name={"fieldName"}
                label={"Name of the field"}
                onChangeHandler={onChangeHandler}
              />
              <Select
                className="w-full mb-5 rounded-lg p-4"
                style={{ "margin-bottom": "15px" }}
                onChange={onSelectType}
                name={"fieldType"}
              >
                <Select.Option value="text">Text</Select.Option>
                <Select.Option value="INT">Number</Select.Option>
                <Select.Option value="boolean">Boolean</Select.Option>
              </Select>
              <button
                onClick={closeModal}
                className=" w-full py-3 px-7 mt-2 rounded-md text-xl font-semibold text-lg bg-xred hover:bg-red-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitHandler}
                className="loginButton w-full py-3 px-7 mt-2 rounded-md text-xl font-semibold text-lg bg-xred hover:bg-red-500 text-white"
              >
                Create
              </button>
            </form>
          ) : (
            <form action="" className="p-6">
              <h1 className="text-lg font-bold"> Create a new content type</h1>
              <InputBox
                name={"name"}
                label={"Name of the content type"}
                onChangeHandler={onChangeHandler}
              />
              <button
                onClick={closeModal}
                className=" w-full py-3 px-7 mt-2 rounded-md text-xl font-semibold text-lg bg-xred hover:bg-red-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitHandler}
                className="loginButton w-full py-3 px-7 mt-2 rounded-md text-xl font-semibold text-lg bg-xred hover:bg-red-500 text-white"
              >
                Create
              </button>
            </form>
          )}
        </div>
      </div>
    );
}
