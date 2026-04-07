import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductDetail from "./components/ProductDetail";
import ProductDownloads from "./components/ProductDownloads";
import ProductsVideo from "./components/ProductsVideo";
import ProductNew from "./components/ProductNew";
import {useLoader} from "../LoaderContext.jsx";
import {useParams} from "react-router-dom";
import apiClient from "../api/api.js";


const Product = () => {
    const {showLoader, hideLoader} = useLoader();
    const [productDetails, setProductDetails] = useState({});
    const [productVideos, setProductVideos] = useState([]);
    const [productFiles, setProductFiles] = useState([]);
    const [productNews, setProductNews] = useState([]);
    const {id} = useParams();
    useEffect(() => {
        const getProduct = async () => {
            showLoader()
            try{
                const response = await apiClient.get(`/get-product/${id}`);
                const data = await response.data;
                setProductDetails({
                    "id": data.id,
                    "name": data.name,
                    "description": data.description,
                    "shortDescription": data.short_description,
                    "poster": data.poster,
                    "size": data.size,
                    "date": data.date,
                    "innovations": data.innovations,
                    "gallery": data.gallery,
                });
                setProductVideos(data.video);
                setProductFiles(data.product_documentations);
                setProductNews(data.news)
            }catch(e){
                console.error(e);
            }finally {
                hideLoader();
            }
        }
        getProduct();
    }, [])
  return (
    <div className="bg-white min-h-screen text-black selection:bg-[#e21e26] selection:text-white">
      <Navbar />
      <ProductDetail productDetails={productDetails} />
      <ProductsVideo  productVideos={productVideos}/>
      <ProductDownloads productFiles={productFiles}/>
      <ProductNew productNews={productNews}/>
      <Footer />
    </div>
  );
};

export default Product;
