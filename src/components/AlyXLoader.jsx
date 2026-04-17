import React from 'react';
import './AlyxLoader.css';

const LightningLoader = () => {
	return (
		<div className="lightning-loader">
			{/* Left corner lightning bolt */}
			<div className="lightning-bolt left-bolt">
				<svg viewBox="0 0 200 200" preserveAspectRatio="none">
					<polyline
						points="0,0 80,40 60,80 140,120 100,170 200,200"
						fill="none"
						stroke="url(#boltGradientLeft)"
						strokeWidth="4"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="bolt-path"
					/>
				</svg>
			</div>

			{/* Right corner lightning bolt */}
			<div className="lightning-bolt right-bolt">
				<svg viewBox="0 0 200 200" preserveAspectRatio="none">
					<polyline
						points="200,0 120,40 140,80 60,120 100,170 0,200"
						fill="none"
						stroke="url(#boltGradientRight)"
						strokeWidth="4"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="bolt-path"
					/>
				</svg>
			</div>

			{/* Center logo - only visible when lightning flashes */}
			<div className="logo-container">
				<img
					src="/logo/LOGO-ALYX-BLACK.png"
					alt="ALYX"
					className="center-logo"
				/>
			</div>

			{/* SVG gradients for lightning colors */}
			<svg width="0" height="0">
				<defs>
					<linearGradient id="boltGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#FFF9C4" />
						<stop offset="50%" stopColor="#FFD54F" />
						<stop offset="100%" stopColor="#FF6F00" />
					</linearGradient>
					<linearGradient id="boltGradientRight" x1="100%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#FFF9C4" />
						<stop offset="50%" stopColor="#FFD54F" />
						<stop offset="100%" stopColor="#FF6F00" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	);
};

export default LightningLoader;