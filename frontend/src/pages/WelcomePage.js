import React from "react";

export default function WelcomePage() {
  return (
    <div>
      <div className="w-full mt-16 py-6 text-center">
        <div className="text-6xl font-semibold">
          Welcome to <span className="text-xred">Todap</span>
        </div>
        <div className="text-6xl font-semibold mt-4">
          Let's manage your todo list
        </div>
        <div className="text-lg font-medium mt-6 mb-12">
          This is an assigment project of Code Academy 2022
        </div>
        <a
          href="/signup"
          className="font-semibold text-xl border-b border-xred hover:text-white rounded-md py-2 px-8 bg-xred hover:bg-red-500 text-white"
        >
          Get started
        </a>
      </div>
    </div>
  );
}
