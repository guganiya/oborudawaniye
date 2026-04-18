import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apiClient from "../api/api";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 6;
const brandRed = "#e21e26";

const Innovations = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderItems, setSliderItems] = useState([]);

  const loadInnovations = useCallback(async (pageNum, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await apiClient.get(
        `/innovations?page=${pageNum}&page_size=${PAGE_SIZE}`,
      );
      const newItems = response.data.results || [];

      if (append) {
        setItems((prev) => [...prev, ...newItems]);
      } else {
        setItems(newItems);
        setSliderItems(newItems.slice(0, 5)); // Первые 5 для слайдера
      }

      setHasMore(pageNum * PAGE_SIZE < response.data.count);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadInnovations(1, false);
  }, [loadInnovations]);

  // Авто-слайдер
  useEffect(() => {
    if (sliderItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderItems]);

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />

      {/* --- SIMPLE HERO SLIDER --- */}
      <section className="relative h-[80vh] bg-black mt-30 overflow-hidden">
        <AnimatePresence mode="wait">
          {sliderItems.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img
                src={sliderItems[currentSlide]?.image}
                alt=""
                className="w-full h-full object-contain opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-24">
                <div className="max-w-4xl">
                  <span className="text-red-600 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
                    {t("innovations_featured_label") || "Innovation Focus"}
                  </span>
                  <h1 className="text-5xl md:text-8xl font-black text-white uppercase leading-[0.9] mb-8">
                    {sliderItems[currentSlide]?.name}
                  </h1>
                  <Link
                    to={`/innovations/${sliderItems[currentSlide]?.id}`}
                    className="inline-flex items-center gap-4 px-10 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    {t("innovations_btn_explore")} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slider Controls */}
        <div className="absolute bottom-10 right-10 z-30 flex gap-2">
          <button
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === 0 ? sliderItems.length - 1 : prev - 1,
              )
            }
            className="p-4 bg-white/10 text-white hover:bg-red-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % sliderItems.length)
            }
            className="p-4 bg-white/10 text-white hover:bg-red-600 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* --- MAIN GRID --- */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            {t("innovations_grid_title") || "Our Developments"}
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/innovations/${item.id}`}
                  className="group flex flex-col"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-50 mb-8 border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-black uppercase tracking-widest mb-4 group-hover:text-red-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 px-4 italic">
                      {item.description}
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div className="w-8 h-[2px] bg-gray-200 group-hover:w-16 group-hover:bg-red-600 transition-all duration-500" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-20 text-center">
                <button
                  onClick={() => {
                    const next = page + 1;
                    setPage(next);
                    loadInnovations(next, true);
                  }}
                  disabled={loadingMore}
                  className="px-12 py-4 border-2 border-black text-black text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50"
                >
                  {loadingMore ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    t("innovations_btn_more")
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Innovations;
