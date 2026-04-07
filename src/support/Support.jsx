import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  X,
  FileText,
  Download,
  FolderOpen,
  Loader2,
  FileImage,
  FileArchive,
  File,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apiClient from "../api/api";

const Support = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const wrapperRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Fetch file suggestions from API
  const fetchFileSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/get-files/", {
        params: {
          search: query,
        },
      });

      let files = [];
      if (Array.isArray(response.data)) {
        files = response.data;
      } else if (response.data.results) {
        files = response.data.results;
      } else if (response.data.data) {
        files = response.data.data;
      }

      setSuggestions(files.slice(0, 10));
    } catch (error) {
      console.error("Error fetching file suggestions:", error);
      setError("Не удалось загрузить файлы. Пожалуйста, попробуйте позже.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchTerm && searchTerm.trim().length > 0) {
        fetchFileSuggestions(searchTerm);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Handle file download
  const handleFileDownload = async (fileId, fileName, fileExtension) => {
    if (!fileId) {
      console.error("No file ID provided");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await apiClient.get(`/download-file/${fileId}/`, {
        responseType: "blob",
      });

      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      let downloadedFileName = fileName || `document_${fileId}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (filenameMatch && filenameMatch[1]) {
          downloadedFileName = filenameMatch[1].replace(/['"]/g, "");
        }
      } else if (fileExtension) {
        // Add extension if we have it
        if (!downloadedFileName.toLowerCase().endsWith(fileExtension)) {
          downloadedFileName += fileExtension;
        }
      }

      // Create download link
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", downloadedFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log("File downloaded successfully:", downloadedFileName);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Не удалось скачать файл. Пожалуйста, попробуйте позже.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  // Get file icon based on extension
  const getFileIcon = (extension) => {
    if (!extension) return <File className="h-4 w-4 text-[#e21e26]" />;

    const imageExts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
    const pdfExts = [".pdf"];
    const archiveExts = [".zip", ".rar", ".7z", ".tar", ".gz"];

    if (imageExts.includes(extension)) {
      return <FileImage className="h-4 w-4 text-blue-500" />;
    } else if (pdfExts.includes(extension)) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (archiveExts.includes(extension)) {
      return <FileArchive className="h-4 w-4 text-yellow-500" />;
    } else {
      return <File className="h-4 w-4 text-[#e21e26]" />;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setIsOpen(false);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setError(null);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (searchTerm && searchTerm.trim()) {
      fetchFileSuggestions(searchTerm);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow pt-10">
        <div className="max-w-6xl mx-auto p-6 pt-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Центр поддержки
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit}>
            <div className="relative" ref={wrapperRef}>
              <div className="relative flex items-stretch border border-gray-300 shadow-sm focus-within:ring-1 focus-within:ring-[#e21e26] focus-within:border-[#e21e26] transition-all">
                <div className="relative flex-grow flex items-center">
                  <div className="absolute left-4 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-11 pr-10 py-4 bg-white focus:outline-none text-gray-700"
                    placeholder="Поиск по документации и файлам..."
                    value={searchTerm}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsOpen(true);
                    }}
                  />
                  <div className="absolute right-3 flex items-center gap-2">
                    {searchTerm && (
                      <X
                        className="h-4 w-4 text-gray-400 cursor-pointer hover:text-black transition-colors"
                        onClick={handleClearSearch}
                      />
                    )}
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#e21e26] text-white font-bold px-10 py-4 uppercase tracking-wider text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    "Найти"
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Dropdown with suggestions */}
              {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-xl rounded-md max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-[#e21e26] mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Поиск файлов...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Найдено файлов: {suggestions.length}
                        </p>
                      </div>
                      {suggestions.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => handleSuggestionClick(file)}
                          className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getFileIcon(file.file_extension)}
                                <div className="font-semibold text-gray-900">
                                  {file.name}
                                </div>
                                {file.file_extension && (
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded ml-2">
                                    {file.file_extension.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              {file.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {file.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-2">
                                {file.file_size && (
                                  <span className="text-xs text-gray-400">
                                    {formatFileSize(file.file_size)}
                                  </span>
                                )}
                                {file.created_at && (
                                  <span className="text-xs text-gray-400">
                                    {formatDate(file.created_at)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileDownload(
                                  file.id,
                                  file.original_filename || file.name,
                                  file.file_extension,
                                );
                              }}
                              disabled={isDownloading}
                              className="ml-4 p-2 text-gray-400 hover:text-[#e21e26] transition-colors disabled:opacity-50"
                              title="Скачать файл"
                            >
                              <Download className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchTerm && searchTerm.trim().length > 0 ? (
                    <div className="p-8 text-center">
                      <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Ничего не найдено по запросу "{searchTerm}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-400">
                        Начните вводить текст для поиска файлов
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Search Results Section */}
          {suggestions.length > 0 && searchTerm && (
            <div className="mt-10 mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Результаты поиска
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((file) => (
                  <div
                    key={file.id}
                    className="p-5 border border-gray-100 bg-gray-50 rounded-lg hover:shadow-md hover:border-red-200 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getFileIcon(file.file_extension)}
                          <div className="font-semibold text-gray-900">
                            {file.name}
                          </div>
                          {file.file_extension && (
                            <span className="text-xs px-2 py-0.5 bg-white text-gray-600 rounded border">
                              {file.file_extension.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {file.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {file.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-3">
                          {file.file_size && (
                            <span className="text-xs text-gray-500">
                              {formatFileSize(file.file_size)}
                            </span>
                          )}
                          {file.created_at && (
                            <span className="text-xs text-gray-400">
                              {formatDate(file.created_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleFileDownload(
                            file.id,
                            file.original_filename || file.name,
                            file.file_extension,
                          )
                        }
                        disabled={isDownloading}
                        className="ml-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-[#e21e26] hover:text-white hover:border-[#e21e26] transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm">Скачать</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {searchTerm &&
            suggestions.length === 0 &&
            !isLoading &&
            searchTerm.trim().length > 0 && (
              <div className="mt-10 mb-12 text-center py-12">
                <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-gray-500">
                  По вашему запросу "{searchTerm}" не найдено файлов или
                  документации
                </p>
              </div>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Helper functions
const formatFileSize = (bytes) => {
  if (!bytes) return "";
  const sizes = ["Б", "КБ", "МБ", "ГБ"];
  if (bytes === 0) return "0 Б";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default Support;
