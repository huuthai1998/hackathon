import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

import {
  Typography,
  Popconfirm,
  DatePicker,
  Select,
  Input,
  notification,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCalendarDays,
  faCircle,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons";

import { useTodoContext } from "../contexts/todoStore";
import { COLORS, CATEGORY_LIST, PRIORITY_LIST, TAB_STATUS } from "../constant";
import Spinner from "./Spinner";

const { Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const styles = {
  checkCircle: {
    border: 0,
    backgroundColor: COLORS.BG_COMPLETED,
  },
  circle: {
    border: `4px solid ${COLORS.LIGHT_GRAY}`,
  },
  todo_props: {
    border: 0,
    fontSize: 14,
    backgroundColor: "white",
    fontWeight: 500,
    marginLeft: 8,
  },
};

const HANDLE_OPTIONS = {
  EDIT_TODO: "EDIT_TODO",
  DELETE_TODO: "DELETE_TODO",
  CHANGE_STATUS: "CHANGE_STATUS",
};

export default function TodoCard(props) {
  const [curData, setCurData] = useState(props.data);
  const [newData, setNewData] = useState({}); // contain only part of todo props
  const [isCompleted, setIsCompleted] = useState(props.isCompleted);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState("");

  const { editTodo, deleteTodo } = useTodoContext();

  const sharedInputProps = {
    className: "xl:w-[1040px] lg:w-[880px] md:w-[660px] sm:w-[400px]",
    defaultValue: curData.content,
    maxLength: 200,
    showCount: true,
    autoFocus: true,
    size: "large",
    onChange: (ref) => {
      setNewData({ ...newData, content: ref.target.value });
      setIsChanged(true);
    },
  };

  const handleDelete = async () => {
    console.log("Delete todo:", curData.id);
    try {
      await axios.delete(`/todo/${curData.id}`);
      deleteTodo(curData.id);
    } catch (err) {
      notification.error({
        message: err.message,
        placement: "top",
        duration: 2,
      });
    }
  };

  const handleEdit = async () => {
    if (!isChanged) {
      setIsEditing(false);
      return;
    }
    console.log("Edit todo:", curData.id);
    try {
      if (newData.content?.trim().length <= 0) {
        throw new Error("Content of task can't be empty");
      } else if (newData.content) newData.content = newData.content.trim();
      const { data } = await axios.patch(`/todo/${curData.id}`, newData);
      editTodo({ ...curData, ...newData });
      setIsEditing(false);
      notification.info({
        message: data.message,
        placement: "top",
        duration: 2,
      });
      setNewData(newData);
      setCurData({ ...curData, ...newData });
    } catch (err) {
      notification.error({
        message: err.message,
        placement: "top",
      });
    }
    setIsChanged(false);
  };

  const handleChangeStatus = async () => {
    if (isEditing) return;
    console.log("Change todo status:", curData.id);
    const newStatus = !isCompleted
      ? TAB_STATUS.COMPLETED
      : TAB_STATUS.IN_PROGRESS;
    if (isCompleted) console.log("Uncheck");
    else console.log("Check");
    try {
      await axios.patch(`/todo/${curData.id}`, {
        status: newStatus,
      });
      setIsCompleted(!isCompleted);
      editTodo({ ...curData, status: newStatus });
      notification.info({
        message: "Status updated",
        placement: "top",
        duration: 2,
      });
    } catch (err) {
      notification.error({
        message: err.message,
        placement: "top",
      });
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().add(-1, "days");
  };

  const submitHandler = (opt) => {
    setOption(opt);
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      // setTimeout(() => {
      setLoading(false);
      switch (option) {
        case HANDLE_OPTIONS.EDIT_TODO:
          handleEdit();
          break;
        case HANDLE_OPTIONS.DELETE_TODO:
          handleDelete();
          break;
        case HANDLE_OPTIONS.CHANGE_STATUS:
          handleChangeStatus();
          break;
        default:
          console.log("do nothing");
      }
      // }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className="min-h-[100px] max-w-6xl grid grid-cols-12 bg-white rounded-lg shadow-[0_0_8px_2px_rgba(0,0,0,0.05)]">
      {loading && <Spinner />}
      <div className="col-span-1 grid h-full place-items-center">
        <button
          className="rounded-full md:w-10 md:h-10 w-7 h-7"
          style={isCompleted ? styles.checkCircle : styles.circle}
          onClick={() => submitHandler(HANDLE_OPTIONS.CHANGE_STATUS)}
        >
          {isCompleted ? (
            <FontAwesomeIcon
              icon={faCheck}
              className="text-completed-400 text-xl"
            />
          ) : null}
        </button>
      </div>
      <div className="col-span-11">
        <div className="flex justify-between pt-4">
          <div>
            {isEditing ? (
              <TextArea {...sharedInputProps} />
            ) : (
              <Paragraph
                ellipsis={{
                  rows: 2,
                  // // could slow down ui
                  // expandable: true,
                  // symbol: "more",
                }}
                className="text-xl max-w-[920px] text-black font-medium"
              >
                {curData.content}
              </Paragraph>
            )}
          </div>
          {isEditing ? null : (
            <div>
              {isCompleted ? null : (
                <button
                  className="font-medium text-lg pb-1 px-2 mr-2 hover:text-gray-600 text-gray-500"
                  onClick={() => setIsEditing(true)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}
              <Popconfirm
                placement="bottomLeft"
                title="Do you really want to delete this task?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => submitHandler(HANDLE_OPTIONS.DELETE_TODO)}
              >
                <button className="font-medium text-lg pb-1 px-2 mr-2 hover:text-red-700 text-xred">
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </Popconfirm>
            </div>
          )}
        </div>
        <div className="pb-4">
          <div className="flex justify-between">
            <div>
              <span className="mr-5">
                {isEditing ? (
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    defaultValue={moment(curData.dueDate)}
                    onChange={(value) => {
                      setNewData({ ...newData, dueDate: value });
                      setIsChanged(true);
                    }}
                    disabledDate={disabledDate}
                  />
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      color={COLORS.TIME}
                    />
                    <span style={{ ...styles.todo_props, color: COLORS.TIME }}>
                      {moment(curData.dueDate).format("ddd MMM DD YYYY HH:mm")}
                    </span>
                  </>
                )}
              </span>
              <span className="mr-5">
                {isEditing ? (
                  <Select
                    defaultValue={curData.category}
                    className="w-32"
                    onChange={(value) => {
                      setNewData({ ...newData, category: value });
                      setIsChanged(true);
                    }}
                  >
                    {CATEGORY_LIST.map((val) => (
                      <Option key={val} value={val}>
                        {val}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCircle} color={COLORS.BG_BLUE} />
                    <span
                      style={{ ...styles.todo_props, color: COLORS.CATEGORY }}
                    >
                      {curData.category}
                    </span>
                  </>
                )}
              </span>
              <span>
                {isEditing ? (
                  <Select
                    defaultValue={curData.priority}
                    className="w-32"
                    onChange={(value) => {
                      setNewData({ ...newData, priority: value });
                      setIsChanged(true);
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
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faFlag}
                      color={COLORS[curData.priority]}
                    />
                    <span
                      style={{
                        ...styles.todo_props,
                        color: COLORS[curData.priority],
                      }}
                    >
                      {curData.priority}
                    </span>
                  </>
                )}
              </span>
            </div>
            {isEditing ? (
              <div className="mt-8">
                <button
                  className="rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-black hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md shadow-sm px-4 py-1 mr-4 bg-xred text-base font-medium text-white hover:bg-red-600 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => submitHandler(HANDLE_OPTIONS.EDIT_TODO)}
                >
                  Save
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
