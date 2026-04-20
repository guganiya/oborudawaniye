import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import apiClient from '../../api/api'
import { useLoader } from '../../LoaderContext.jsx'
import { useTranslation } from 'react-i18next'

// Swiper for the "Highlights" feel
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'

const ProductHighlights = () => {
    const { t } = useTranslation()
    const { showLoader, hideLoader } = useLoader()
    const [products, setProducts] = useState([])
    const prevRef = useRef(null)
    const nextRef = useRef(null)

    useEffect(() => {
        const fetchHighlights = async () => {
            showLoader()
            try {
                // Adjust endpoint if you have a specific "popular" or "highlights" one
                const response = await apiClient.get('/get-popular-products/')
                setProducts(response.data || [])
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                hideLoader()
            }
        }
        fetchHighlights()
    }, [showLoader, hideLoader])

    return (

        <section className='bg-white py-16 px-6 md:px-20 font-sans border-t border-gray-100 overflow-hidden'>
            {/* Header Section */}
            <div className='flex justify-between items-center mb-10'>
                <h2 className='text-2xl md:text-4xl font-extrabold text-[#222] tracking-tight'>
                    {t('product_highlights_title') || 'Product highlights'}
                </h2>

                <div className='flex items-center gap-6'>
                    <Link
                        to='/products'
                        className='text-[11px] font-bold uppercase tracking-widest text-gray-800 hover:opacity-70 border-b-2 border-black pb-1'
                    >
                        {t('view_all') || 'VIEW ALL'}
                    </Link>

                    {/* Custom Navigation Arrows */}
                    <div className='flex gap-2'>
                        <button ref={prevRef} className='cursor-pointer hover:text-gray-400 transition-colors'>
                            <ArrowLeft size={20} strokeWidth={1.5} />
                        </button>
                        <button ref={nextRef} className='cursor-pointer hover:text-gray-400 transition-colors'>
                            <ArrowRight size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Swiper Grid */}
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1.2}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 4 },
                    1440: { slidesPerView: 5 },
                }}
                className="highlight-swiper"
            >

                {/* Swiper Grid */}
                {products.length === 0 ? (
                    <div className="w-full py-20 text-center text-gray-400 uppercase tracking-widest text-xs border border-dashed border-gray-100">
                        {t('nothing_to_show')}
                    </div>
                ) : (
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={1.2}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2.2 },
                            1024: { slidesPerView: 4 },
                            1440: { slidesPerView: 5 },
                        }}
                        className="highlight-swiper"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <Link
                                    to={`/product/${product.id}`}
                                    className='group block bg-white border border-gray-100 p-4 h-full transition-shadow hover:shadow-xl relative'
                                >
                                    {/* NEW Tag - Shown only if product was added recently or has is_popular */}
                                    <span className='absolute top-4 right-4 text-[#ff0000] text-[10px] font-black uppercase tracking-tighter'>
                        {t("new")}
                    </span>


                                    {/* Product Image */}
                                    <div className='aspect-square flex items-center justify-center mb-6 mt-6'>
                                        <img
                                            src={product.poster}
                                            alt={product.name}
                                            className='max-h-full object-contain transition-transform duration-500 group-hover:scale-110'
                                        />
                                    </div>

                                    {/* Info Section */}
                                    <div className='mt-auto'>
                                        <h3 className='text-sm md:text-[15px] font-bold text-[#1a1a1a] mb-1 group-hover:text-[#ff0000] transition-colors'>
                                            {product.name}
                                        </h3>
                                        <p className='text-[11px] text-gray-500 uppercase font-medium mb-1'>
                                            {product.subcategory || product.category}
                                        </p>
                                        <p className='text-[10px] text-gray-400 uppercase tracking-tighter'>
                                            {product.size}
                                        </p>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

            </Swiper>

            <style dangerouslySetInnerHTML={{ __html: `
                .highlight-swiper { overflow: visible !important; }
            `}} />
        </section>
    )
}

export default ProductHighlights