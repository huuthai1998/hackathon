import React from "react";

const InputBox = ({ onChangeHandler, name }) => (
  <div className="my-4">
    <label htmlFor="name" className="text-grayBar mb-4">
      {name}
    </label>
    <input
      type="text"
      className="w-full rounded-lg border border-[#91a5fe] bg-[#fcfcfc] p-2"
      name={name.toLowerCase()}
      onChange={onChangeHandler}
    />
  </div>
);

export default function AddEntry({
  show,
  fields,
  submitHandler,
  onChangeHandler,
}) {
  const renderInput = () => {
    return fields.map((item) => {
      if (item !== "ID" && item !== "Actions")
        return (
          <InputBox name={item} key={item} onChangeHandler={onChangeHandler} />
        );
    });
  };
  if (show)
    return (
      <div className="min-h-screen min-w-screen">
        <div className="bg-black opacity-80 min-h-screen w-screen absolute top-0 left-0"></div>
        <div className="min-h-screen bg-white absolute top-0 right-0 w-[500px]">
          <form action="" className="p-6">
            <h1 className="text-lg font-bold"> New Entry</h1>
            {renderInput()}
            <button
              onClick={submitHandler}
              className="loginButton w-full py-3 px-7 mt-2 rounded-md text-xl font-semibold text-lg bg-xred hover:bg-red-500 text-white"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    );
}
