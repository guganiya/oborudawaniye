import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Search,
  ArrowRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import apiClient from "../api/api.js";

const PAGE_SIZE = 6;
const brandRed = "#e21e26";

const News = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [topicOptions, setTopicOptions] = useState([]);

  // Slider state
  const [sliderNews, setSliderNews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(
    searchParams.get("category_id") || "",
  );

  // Refs для бесконечного скролла
  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore],
  );

  // 1. Загрузка категорий
  useEffect(() => {
    apiClient
      .get("/get-news-categories")
      .then((res) => setTopicOptions(res.data));
  }, []);

  // 2. Загрузка слайдера
  useEffect(() => {
    apiClient.get(`/news?page=1&page_size=5`).then((res) => {
      setSliderNews(res.data.results || []);
    });
  }, []);

  // 3. Загрузка основного списка
  const fetchNews = useCallback(async (pageNum, catId, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const res = await apiClient.get(
        `/news?page=${pageNum}&page_size=${PAGE_SIZE}${catId ? `&category=${catId}` : ""}`,
      );
      const newItems = res.data.results || [];
      setItems((prev) => (append ? [...prev, ...newItems] : newItems));
      setHasMore(pageNum * PAGE_SIZE < res.data.count);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Сброс при смене категории
  useEffect(() => {
    setPage(1);
    fetchNews(1, category, false);
  }, [category, fetchNews]);

  // Загрузка следующей страницы при изменении state page
  useEffect(() => {
    if (page > 1) {
      fetchNews(page, category, true);
    }
  }, [page, category, fetchNews]);

  const handleCategoryChange = (id) => {
    setCategory(id);
    setSearchParams(id ? { category_id: id } : {});
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen font-sans">
      <Navbar />

      {/* --- HERO SLIDER --- */}
      <section className="relative h-[80vh] mt-30 bg-black">
        <AnimatePresence mode="wait">
          {sliderNews.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img
                src={sliderNews[currentSlide].poster}
                className="w-full h-full object-cover opacity-60"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20">
                <div className="max-w-4xl">
                  <span className="text-red-600 font-bold uppercase tracking-widest text-xs mb-4 block">
                    {t("featured_news") || "Latest News"}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-black text-white uppercase leading-tight mb-6">
                    {sliderNews[currentSlide].title}
                  </h1>
                  <Link
                    to={`/news-content/${sliderNews[currentSlide].id}`}
                    className="inline-flex items-center gap-3 px-8 py-3 bg-red-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                  >
                    {t("read_more")} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-10 right-10 flex gap-4 z-20">
          <button
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === 0 ? sliderNews.length - 1 : prev - 1,
              )
            }
            className="p-3 bg-white/10 text-white hover:bg-red-600 transition-colors"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === sliderNews.length - 1 ? 0 : prev + 1,
              )
            }
            className="p-3 bg-white/10 text-white hover:bg-red-600 transition-colors"
          >
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
            {t("news_title_main") || "News Feed"}
          </h2>
          <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border">
            <Search size={18} className="ml-2 text-gray-400" />
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-transparent outline-none text-xs font-bold uppercase tracking-widest p-2 cursor-pointer"
            >
              <option value="">
                {t("all_categories") || "All Categories"}
              </option>
              {topicOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            // Если это последний элемент в массиве, вешаем на него ref
            if (items.length === index + 1) {
              return (
                <Link
                  ref={lastItemRef}
                  key={item.id}
                  to={`/news-content/${item.id}`}
                  className="group bg-white flex flex-col h-full border hover:shadow-2xl transition-all duration-300"
                >
                  <NewsCardContent item={item} t={t} />
                </Link>
              );
            } else {
              return (
                <Link
                  key={item.id}
                  to={`/news-content/${item.id}`}
                  className="group bg-white flex flex-col h-full border hover:shadow-2xl transition-all duration-300"
                >
                  <NewsCardContent item={item} t={t} />
                </Link>
              );
            }
          })}
        </div>

        {/* Индикаторы загрузки */}
        {(loading || loadingMore) && (
          <div className="py-10 flex justify-center">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

// Вынес внутренности карточки для чистоты кода
const NewsCardContent = ({ item, t }) => (
  <>
    <div className="aspect-video overflow-hidden">
      <img
        src={item.poster}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        alt=""
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest mb-2">
        {item.date}
      </span>
      <h3 className="text-xl font-bold leading-tight mb-4 group-hover:text-red-600 transition-colors">
        {item.title}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-3 mb-6">
        {item.short_description}
      </p>
      <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
        {t("read_more")} <ArrowRight size={14} />
      </div>
    </div>
  </>
);

export default News;
