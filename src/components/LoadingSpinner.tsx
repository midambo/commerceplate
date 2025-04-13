'use client';

import { BiLoaderAlt } from "react-icons/bi";

export default function LoadingSpinner() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <BiLoaderAlt className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
