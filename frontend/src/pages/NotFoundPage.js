import React from "react";

export default function NotFoundPage() {
  return (
    <div>
      <div className="w-full mt-16 py-6 text-center">
        <div className="font-bold text-black text-9xl mb-8">404</div>
        <div className="text-2xl mb-4 font-bold text-center text-gray-800 md:text-3xl">
          <span className="text-xred">Oops!</span> Page not found
        </div>
        <p className="mb-12 text-center text-gray-500 md:text-lg">
          {"The page you’re looking for doesn’t exist."}
        </p>
        <a
          href="/"
          className="font-semibold text-xl border-b border-xred hover:text-white rounded-md py-2 px-8 bg-xred hover:bg-red-500 text-white"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
