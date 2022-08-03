import { Link, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../contexts/authStore";

export default function Sidebar() {
  const [contentTypes, setContentTypes] = useState([]);
  let { id } = useParams();
  const { authContext } = useAuthContext();
  const location = useLocation();

  const renderContentType = () => {
    return contentTypes.map((item) => (
      <Link
        key={item.id}
        to={{ pathname: `/entry/${item.id}`, search: `?name=${item.name}` }}
        className={`w-full flex items-center py-3 pl-[41px] my-4 text-base hover:text-black font-medium hover:bg-gray-200 ${
          item.id !== id || !location.pathname.includes("entry")
            ? "text-grayBar"
            : "bg-gray-200 text-black"
        }`}
      >
        <span className="ml-3">{item.name}</span>
      </Link>
    ));
  };

  const fetchCollectionTypes = async () => {
    try {
      const { data } = await axios.get("/contentType");
      setContentTypes(data.rows);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (authContext.token.length > 0) fetchCollectionTypes();
  }, [authContext.token, authContext.refetch]);

  return (
    <aside className="w-[400px] bg-[#FAFAFA] min-h-screen hidden md:block">
      <div className="bg-highlightPurple">
        <h1 className="text-white text-2xl px-5 py-4 m-0">CMS+</h1>
      </div>
      <div className="bg-[#272727] px-5 py-10 min-h-screen">
        <div className="flex justify-between">
          <h1 className="text-grayBar uppercase font-bold">Collection Types</h1>
          <FontAwesomeIcon icon={faSearch} size="lg" className="text-grayBar" />
        </div>
        <ul className="space-y-2">{renderContentType()}</ul>
        <div className="flex justify-between">
          <Link to={"/builder"} className="text-grayBar uppercase font-bold">
            Content Type Builder
          </Link>
        </div>
      </div>
    </aside>
  );
}
