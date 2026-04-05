import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const Signup = () => {
	const brandRed = '#e21e26'

	return (
		<div className='min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24 font-sans'>
			<motion.div
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				className='w-full max-w-[450px] bg-white p-10 md:p-14 border border-black/5 shadow-sm'
			>
				<h1 className='text-3xl font-black uppercase tracking-tighter mb-2 italic text-center'>
					Create Account<span style={{ color: brandRed }}>.</span>
				</h1>
				<p className='text-center text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-10'>
					Join our professional lighting network
				</p>

				<form className='space-y-8'>
					<div className='relative'>
						<input
							type='text'
							required
							className='w-full bg-transparent border-b border-gray-200 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#e21e26] transition-colors peer'
						/>
						<label className='absolute left-0 top-3 text-[9px] font-black uppercase tracking-widest text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#e21e26]'>
							Full Name
						</label>
					</div>

					<div className='relative'>
						<input
							type='email'
							required
							className='w-full bg-transparent border-b border-gray-200 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#e21e26] transition-colors peer'
						/>
						<label className='absolute left-0 top-3 text-[9px] font-black uppercase tracking-widest text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#e21e26]'>
							Email Address
						</label>
					</div>

					<button
						type='submit'
						style={{ backgroundColor: brandRed }}
						className='w-full py-5 text-white flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all cursor-pointer'
					>
						Register <ArrowRight size={16} />
					</button>
				</form>
			</motion.div>
		</div>
	)
}

export default Signup
