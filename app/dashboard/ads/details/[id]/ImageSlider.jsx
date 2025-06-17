'use client';
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper';
import Lightbox from 'yet-another-react-lightbox';
import { Thumbnails as LightboxThumbnails } from 'yet-another-react-lightbox/plugins';
import { FaSearchPlus } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const ImageSlider = ({ images = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const thumbsRef = useRef();

  return (
    <>
      {/* Main Slider */}
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="mb-4"
      >
        {images.map((img, i) => (
          <SwiperSlide key={img.id || i}>
  <div
    className="relative group cursor-pointer"
    onClick={() => {
      setLightboxIndex(i);
      setLightboxOpen(true);
    }}
  >
  {img.type === 'video' ? (
    <video
                  controls
                  className="w-full h-64 object-cover rounded"
                  
                >
                  <source src={img.direct_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
  ) : (
     <img
      src={img.direct_url}
      alt={`Image ${i}`}
      className="w-full h-64 object-cover rounded"
    />
  ) }
   
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity rounded">
      <FaSearchPlus className="text-white text-3xl" />
    </div>
  </div>
</SwiperSlide>

        ))}
      </Swiper>

      {/* Thumbnails */}
      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={3.5}
        centeredSlides={true}
        className="thumbs-swiper mt-2 h-24"
        freeMode={true}
        watchSlidesProgress={true}
        onClick={(swiper) => {
            const clickedIndex = swiper.clickedIndex;
            if(typeof clickedIndex === 'number'){
                swiper.slideTo(clickedIndex - Math.floor(swiper.params.slidesPerView/2))
            }
        }}
         ref={thumbsRef}
      >
        {images.map((img, i) => (
          <SwiperSlide 
          key={i}
          className='w-24 h-24 cursor-pointer'
          >
            {img.type === 'video' ? (
              <video
                className="w-full h-full object-cover rounded"
                poster={img.poster || ''}
                muted
              />
            ) : (
              <img
                src={img.direct_url}
                alt={`Thumb ${i}`}
                className="object-cover w-full h-full rounded"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <Lightbox
        open={lightboxOpen}
        index={lightboxIndex}
        close={() => setLightboxOpen(false)}
        slides={images.map((img) => ({ src: img.direct_url }))}
        plugins={[LightboxThumbnails]}
        carousel={{ finite: true }}
        thumbnails={{
          width: 100,
          height: 60,
          borderRadius: 4,
        }}
      />
    </>
  );
};

export default ImageSlider;
