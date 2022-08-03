import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuthContext } from "../contexts/authStore";

import Spinner from "../components/Spinner";
import ContentTypes from "../components/ContentTypes";
import ContentTypeFields from "../components/ContentTypeFields";

export default function ContentTypesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [contentTypes, setContentTypes] = useState([]);
  const [count, setCount] = useState(0);
  const { authContext, toggleRefetch } = useAuthContext();

  const fetchCollectionTypes = async () => {
    try {
      const { data } = await axios.get("/contentType");
      setContentTypes(data.rows);
      setCount(data.count);
    } catch (err) {
      console.log(err);
    }
  };

  const createNewContentTypeHandler = async (name) => {
    try {
      const { data } = await axios.post("/contentType", { name });
      await fetchCollectionTypes();
      toggleRefetch();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (authContext.token.length > 0) fetchCollectionTypes();
  }, [authContext.token]);

  useEffect(() => {
    // handle situation when refresh home page, context token is reset,
    if (!Cookies.get("token")) navigate("/login");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.token]);

  return (
    <div>
      <div className="flex">
        <ContentTypes
          contentTypes={contentTypes}
          count={count}
          createNewContentTypeHandler={createNewContentTypeHandler}
        />
        <ContentTypeFields />
      </div>
    </div>
  );
}
