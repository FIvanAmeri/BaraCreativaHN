"use client";
import React from "react";
import Link from "next/link";

export default function Cursos({ className }: { className?: string }) {
  return (
    <Link
      href="/cursos"
      className={`
        flex items-center justify-center
        bg-red-600 text-white relative overflow-hidden group z-10
        hover:text-white duration-1000 rounded-[1.25rem]
        py-2 sm:py-3
        px-3 sm:px-4
        text-[clamp(0.65rem,1.5vw,1rem)] tracking-tight
        w-fit min-w-[6rem] max-w-[16rem]
        ${className || ""}
      `}
    >
      <span className="absolute bg-yellow-300 w-44 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
      <span className="absolute bg-yellow-500 w-44 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
      Cursos
    </Link>
  );
}