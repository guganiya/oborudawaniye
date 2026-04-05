import React from 'react';

// Replace with your actual logo import
// import Logo from '../assets/logo.svg';

const AlyxLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">

                {/* The Professional Spinner */}
                <div className="h-50 w-50 animate-spin rounded-full border-4 border-gray-100 border-t-[#ff0000]"></div>

                {/* The Logo - Perfectly Centered */}
                <div className="absolute inset-0 flex items-center justify-center ">
                    <img
                        src="/public/logo/LOGO-ALYX-BLACK.png" // Path to your logo
                        alt="Loading..."
                        className="h-30 w-30 object-contain"
                    />
                </div>

            </div>
        </div>
    );
};

export default AlyxLoader;