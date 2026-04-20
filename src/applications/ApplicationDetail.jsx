import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MoveRight, Calendar } from "lucide-react";
import apiClient from "../api/api.js";
import { useLoader } from "../LoaderContext.jsx";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductHighlights from "../Home/components/HighlightProducts.jsx";

const ApplicationDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { showLoader, hideLoader } = useLoader();

  const [data, setData] = useState(null);
  const baseUrl = "http://owaz.com.tm";

  useEffect(() => {
    const fetchDetails = async () => {
      showLoader();
      try {
        const response = await apiClient.get(`/get-applications/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching application details:", error);
      } finally {
        hideLoader();
      }
    };
    fetchDetails();
    // Прокрутка вверх при открытии страницы
    window.scrollTo(0, 0);
  }, [id, showLoader, hideLoader]);

  if (!data) return <div className="min-h-screen bg-white" />;

  return (
    <main className="bg-white font-sans min-h-screen">
      <Navbar />

      {/* --- HERO SECTION --- */}
      {/* Используем h-screen вместо фиксированных процентов для лучшего иммерсивного эффекта */}
      <section className="relative w-full h-[90vh] mt-30 overflow-hidden bg-black">
        {/* Картинка с эффектом легкого зума */}
        <img
          src={data.poster}
          alt={data.title}
          className="absolute inset-0 w-full h-full object-contain opacity-70 scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
        />

        {/* Сложный градиент: темный низ для текста и легкая виньетка сверху */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-24 pb-20">
          <div className="max-w-5xl">
            <h1 className="text-4xl md:text-8xl font-black text-white uppercase leading-[0.85] tracking-tighter drop-shadow-2xl">
              {data.title}
            </h1>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT SECTION --- */}
      <section className="relative z-20 -mt-10 bg-white rounded-t-[40px] py-20 px-6 md:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 text-gray-400 mb-10 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-red-600" />
              <span className="text-sm font-semibold text-gray-900">
                {data.date}
              </span>
            </div>
            <div className="h-4 w-[1px] bg-gray-300" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Details
            </span>
          </div>

          <article className="prose prose-stone max-w-none">
            <p className="text-xl md:text-2xl text-gray-800 leading-[1.6] font-light whitespace-pre-line">
              {data.description}
            </p>
          </article>
        </div>
      </section>

      {/* --- RELATED NEWS SECTION --- */}
      {data.related_news && data.related_news.length > 0 && (
        <section className="py-24 px-6 md:px-24 bg-[#fff]">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-16">
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tighter text-[#111]">
                  {t("news_related_title") || "Related Stories"}
                </h2>
                <div className="h-1.5 w-24 bg-red-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {data.related_news.map((item) => (
                <Link
                  key={item.id}
                  to={`/news-content/${item.id}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 shadow-lg">
                    <img
                      src={
                        item.poster.startsWith("http")
                          ? item.poster
                          : `${baseUrl}${item.poster}`
                      }
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] text-red-600 font-black uppercase tracking-widest">
                      {item.date || "Press Release"}
                    </span>
                    <h3 className="text-lg font-extrabold leading-tight text-[#111] group-hover:text-red-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {item.short_description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProductHighlights />
      <Footer></Footer>

      {/* Инлайновые стили для анимации зума */}
      <style>{`
        @keyframes subtle-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      `}</style>
    </main>
  );
};

export default ApplicationDetails;
