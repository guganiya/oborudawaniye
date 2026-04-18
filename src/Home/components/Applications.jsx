import React, { useState, useEffect } from "react";
import apiClient from "../../api/api";
import { useLoader } from "../../LoaderContext.jsx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Applications = () => {
  const { t } = useTranslation();
  const { showLoader, hideLoader } = useLoader();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      showLoader();
      try {
        const response = await apiClient.get("/get-applications");
        // Сортируем по приоритету, если нужно
        setApps(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        hideLoader();
      }
    };
    fetchApps();
  }, [showLoader, hideLoader]);

  return (
    <section className="bg-white py-12 px-6 md:px-24 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок из JSON перевода */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {t("solutions_title") ||
            "We have solutions for every market and every need"}
        </h2>

        {/* Сетка Tailwind Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {apps.map((app, index) => {
            // Логика для того, чтобы делать некоторые блоки шире (как на фото)
            // Например: 1-й и 6-й элементы занимают 2 колонки (col-span-2)
            const isWide = index === 0 || index === 5;

            return (
              <div
                key={app.id}
                className={`relative group overflow-hidden rounded-2xl h-64 md:h-80 bg-gray-200 
                                ${isWide ? "md:col-span-2" : "md:col-span-1"}`}
              >
                {/* Изображение */}
                <img
                  src={app.poster}
                  alt={app.title}
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />

                {/* Градиентный слой для читаемости текста */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Контент */}
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white text-xl font-bold tracking-tight">
                    {app.title}
                  </h3>
                </div>

                {/* Ссылка/Клик (опционально) */}
                <Link
                  to={`/applications/${app.id}`}
                  className="absolute inset-0 z-10"
                >
                  <span className="sr-only">View {app.title}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Applications;
