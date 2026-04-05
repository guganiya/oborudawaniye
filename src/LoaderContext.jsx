import React, { createContext, useContext, useState } from 'react';
import AlyxLoader from './components/AlyXLoader.jsx'; // The visual component

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader }}>
            {loading && <AlyxLoader />}
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);