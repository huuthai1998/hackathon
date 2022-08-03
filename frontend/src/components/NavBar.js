import { useLocation } from "react-router";

import { useEffect, useState } from "react";

const getTabName = (search) => {
  return new URLSearchParams(search).get("name");
};

export default function NavBar() {
  const [name, setName] = useState("");
  const { search } = useLocation();

  useEffect(() => {
    setName(getTabName(search));
  }, [search]);

  return (
    <nav className="min-w-screen">
      <h1 className="text-2xl px-5 py-4 m-0">{name || `Content types`}</h1>
    </nav>
  );
}
