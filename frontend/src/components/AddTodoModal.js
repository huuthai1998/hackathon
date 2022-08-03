import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

import { DatePicker, Select, Input, notification } from "antd";
import { COLORS, CATEGORY_LIST, PRIORITY_LIST, TAB_STATUS } from "../constant";
import { useTodoContext } from "../contexts/todoStore";
import Spinner from "./Spinner";

const { Option } = Select;
const { TextArea } = Input;

export default function AddTodoModal({ setShowAddTodo }) {
  const [dataToAdd, setDataToAdd] = useState({
    content: "",
    dueDate: moment(),
    status: TAB_STATUS.IN_PROGRESS,
    category: CATEGORY_LIST[0],
    priority: PRIORITY_LIST[0],
  });
  const [loading, setLoading] = useState(false);

  const { addTodo } = useTodoContext();

  const sharedInputProps = {
    style: {
      maxWidth: 920,
      borderRadius: 10,
      marginBottom: 15,
    },
    maxLength: 200,
    showCount: true,
    autoFocus: true,
    size: "large",
    onChange: (ref) => {
      setDataToAdd({ ...dataToAdd, content: ref.target.value });
    },
  };

  const handleAdd = async () => {
    console.log("Add todo:", dataToAdd);
    try {
      if (!dataToAdd.content || dataToAdd.content.trim().length <= 0)
        throw new Error("Please enter content of task");
      dataToAdd.content = dataToAdd.content.trim();
      const { status, data } = await axios.post("/todo/", dataToAdd);
      if (status === 201) {
        addTodo(data.data);
        setShowAddTodo(false);
      }
      notification.info({
        message: data.message,
        placement: "top",
        duration: 2,
      });
    } catch (err) {
      notification.error({
        message: err.response?.data?.message || err.message,
        placement: "top",
      });
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoading(true);
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().add(-1, "days");
  };

  useEffect(() => {
    if (loading) {
      // setTimeout(() => {
      setLoading(false);
      handleAdd();
      // }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {loading && <Spinner />}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Add a new task
                  </h3>
                  <div className="mt-2 md:w-[800px]">
                    <div className="pt-4">
                      <div>
                        <TextArea {...sharedInputProps} />
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <span className="mr-5">
                            <DatePicker
                              showTime
                              format="YYYY-MM-DD HH:mm"
                              defaultValue={moment()}
                              onChange={(value) => {
                                setDataToAdd({ ...dataToAdd, dueDate: value });
                              }}
                              disabledDate={disabledDate}
                            />
                          </span>
                          <span className="mr-4">
                            <Select
                              defaultValue={CATEGORY_LIST[0]}
                              className="w-32"
                              onChange={(value) => {
                                setDataToAdd({ ...dataToAdd, category: value });
                              }}
                            >
                              {CATEGORY_LIST.map((val) => (
                                <Option key={val} value={val}>
                                  {val}
                                </Option>
                              ))}
                            </Select>
                          </span>
                          <span>
                            <Select
                              defaultValue={PRIORITY_LIST[0]}
                              className="w-32"
                              onChange={(value) => {
                                setDataToAdd({ ...dataToAdd, priority: value });
                              }}
                            >
                              {PRIORITY_LIST.map((val) => (
                                <Option
                                  key={val}
                                  value={val}
                                  style={{ color: COLORS[val] }}
                                >
                                  {val}
                                </Option>
                              ))}
                            </Select>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={submitHandler}
                className="w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-xred text-base font-medium text-white hover:bg-red-600 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddTodo(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-black hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
