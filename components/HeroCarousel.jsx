'use client'

import { useEffect, useMemo, useState } from 'react'

const FARM_SLIDES = [
  {
    src: 'https://res.cloudinary.com/dqk7t9uam/image/upload/q_auto/f_auto/v1777285297/magoes_crate_bkbvgw.jpg',
    alt: 'Fresh Mangoes',
  },
  {
    src: 'https://res.cloudinary.com/dqk7t9uam/image/upload/q_auto/f_auto/v1777007426/couliflower_c308et.jpg',
    alt: 'Fresh vegetables harvested from a farm',
  },
  {
    src: 'https://res.cloudinary.com/dqk7t9uam/image/upload/q_auto/f_auto/v1777285324/ladies_nyoc8w.jpg',
    alt: 'Power House',
  },
  {
    src: 'https://res.cloudinary.com/dqk7t9uam/image/upload/q_auto/f_auto/v1777285329/all_log_chtesq.jpg',
    alt: 'Power House',
  },
  {
    src: 'https://res.cloudinary.com/dqk7t9uam/image/upload/q_auto/f_auto/v1777006282/well_gjy118.jpg',
    alt: 'Well',
  },
]

export default function HeroCarousel() {
  const slides = useMemo(() => FARM_SLIDES.filter(slide => slide.src), [])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return undefined

    const intervalId = window.setInterval(() => {
      setActiveIndex(current => (current + 1) % slides.length)
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <div className="hero-carousel" aria-label="Farm photos">
      <div className="hero-carousel-frame">
        {slides.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`hero-carousel-image ${index === activeIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <div className="hero-carousel-dots" aria-label="Choose farm photo">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={`hero-carousel-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show farm photo ${index + 1}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      )}
    </div>
  )
}
