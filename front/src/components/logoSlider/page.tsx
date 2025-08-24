"use client";
// components/LogoSlider/page.tsx
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const brands = [
  { src: "/empresa-1.jpg" },
  { src: "/empresa-2.jpg" },
  { src: "/empresa-3.jpg" },
  { src: "/empresa-4.jpg" },
  { src: "/empresa-5.jpg" },
  { src: "/empresa-6.jpg" },
  { src: "/empresa-7.jpg" },
  { src: "/empresa-8.jpg" },
  { src: "/empresa-9.jpeg" },
  { src: "/empresa-10.jpg" },
  { src: "/empresa-11.jpg" },
  { src: "/empresa-12.jpg" },
  { src: "/empresa-13.jpg" },
  { src: "/empresa-14.jpg" },
  { src: "/empresa-15.jpg" },
  { src: "/empresa-16.jpg" },
  { src: "/empresa-17.jpg" },
  { src: "/empresa-18.jpg" },
  { src: "/empresa-19.png" },
  { src: "/empresa-20.png" },
  { src: "/empresa-21.png" },
  { src: "/empresa-22.png" },
];

const LogoSlider = () => {
  return (
    <section className="container mx-auto py-8 bg-[var(--background)] text-white">
      <h2 className="text-2xl font-bold text-center mb-6">
        Clientes con los que hemos trabajado
      </h2>
      <Swiper
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        spaceBetween={16}
        loop={brands.length > 1}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        speed={5000}
        modules={[Autoplay]}
        className="w-full"
      >
        {brands.map((brand, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <div className="w-full max-w-[180px] aspect-[5/3]">
              <Image
                src={brand.src}
                alt={`Logo ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default LogoSlider;
