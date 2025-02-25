"use client";

import Image from "next/image";
import { useState } from "react";

const ImageFallback = (props: any) => {
  const { src, fallback = "/images/placeholder.jpg", ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallback);
      }}
    />
  );
};

export default ImageFallback;
