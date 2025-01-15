import Carousel from "@/screens/carousel/Carousel";
import React from "react";

function page() {
  return (
    <div className="mx-auto w-full">
      <div className="flex items-center flex-col mb-4">
        <p className="text-xs text-slate-500">Create</p>
        <h1 className="text-3xl font-bold">Carousel</h1>
      </div>
      <Carousel />
    </div>
  );
}

export default page;
