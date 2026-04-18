import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Contacts from "./Contacts/Contacts";
import Signup from "./auth/Signup";
import News from "./New/News";
import NewsContent from "./New/NewsContent";
import Innovations from "./inovation/Innovations";
import InnovationContent from "./inovation/InnovationContent";
import AboutUs from "./About/AboutUs";
import { LoaderProvider } from "./LoaderContext.jsx";
import Products from "./products/Products.jsx";
import SubCategory from "./products/SubCategory.jsx";
import Product from "./products/Product.jsx";
import Support from "./support/Support.jsx";
import NotFound from "./components/404.jsx";
import SubCategoryProducts from "./products/SubcatProducts.jsx";
import SearchPage from "./components/SearchPage.jsx";
import ApplicationDetails from "./applications/ApplicationDetail.jsx";

function App() {
  return (
    <>
      <LoaderProvider>
        <Routes>
          <Route path="*" element={<NotFound />}></Route>
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/news" element={<News />} />
          <Route path="/news-content/:id" element={<NewsContent />} />
          <Route path="/innovation" element={<Innovations />} />
          <Route path="/innovations/:id" element={<InnovationContent />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/subcategory/:categoryId" element={<SubCategory />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/support" element={<Support />} />
          <Route
            path="products/:subId"
            element={<SubCategoryProducts />}
          ></Route>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/applications/:id" element={<ApplicationDetails />} />
        </Routes>
      </LoaderProvider>
    </>
  );
}

export default App;
