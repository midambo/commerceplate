"use client";

import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingCategory from "./skeleton/SkeletonCategory";

const CollectionsSlider = ({ collections }: { collections: any }) => {
  const [_, setInit] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [collectionsData, setCollectionsData] = useState([]);
  const [loadingCollectionsData, setLoadingCollectionsData] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    setCollectionsData(collections);
    setLoadingCollectionsData(false);
  }, [collections]);

  if (loadingCollectionsData) {
    return <LoadingCategory />;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        modules={[Pagination, Navigation]}
        slidesPerView={2}
        spaceBetween={10}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        onInit={() => setInit(true)}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        className="relative flex items-center"
      >
        {collectionsData?.map((collection: any, index: number) => (
          <SwiperSlide key={index}>
            <Link href={`/collections/${collection.handle}`}>
              <div className="relative">
                <ImageFallback
                  src={collection.image?.src || '/images/placeholder.jpg'}
                  alt={collection.title || 'Collection Image'}
                  width={424}
                  height={306}
                  className="h-[150px] md:h-[250px] lg:h-[306px] object-cover rounded-md"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={`hidden md:block w-full absolute top-[33%] z-10 px-4 text-dark ${
          isHovered
            ? "opacity-100 transition-opacity duration-300 ease-in-out"
            : "opacity-0 transition-opacity duration-300 ease-in-out"
        }`}
      >
        <div
          ref={prevRef}
          className="p-2 lg:p-3 rounded-md bg-body cursor-pointer shadow-sm absolute left-4"
        >
          <HiOutlineArrowNarrowLeft size={24} />
        </div>
        <div
          ref={nextRef}
          className="p-2 lg:p-3 rounded-md bg-body cursor-pointer shadow-sm absolute right-4"
        >
          <HiOutlineArrowNarrowRight size={24} />
        </div>
      </div>
    </div>
  );
};

export default CollectionsSlider;
