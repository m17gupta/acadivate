"use client";
import React, { useState } from 'react';

const RegistrationForm = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-4xl bg-white shadow-[0_20px_60px_rgba(0,85,141,0.1)] rounded-[2.5rem] overflow-hidden border border-gray-100 flex flex-col md:flex-row">

                {/* LEFT SIDE: BRANDING & WELCOME */}
                <div className="md:w-5/12 bg-[#00558d] p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <span className="bg-[#ff6600] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">Join the Network</span>
                        <h1 className="text-4xl font-black tracking-tighter uppercase leading-tight mb-4">
                            Acadivate <br /> <span className="text-[#ff6600]">ARIF 2026</span>
                        </h1>
                        <p className="text-blue-100 text-sm font-medium opacity-80 leading-relaxed">
                            Register today to access the global portal for sustainability, research, and professional excellence.
                        </p>
                    </div>

                    <div className="mt-12 md:mt-0 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-1 bg-[#ff6600]"></div>
                            <p className="text-xs font-black uppercase tracking-widest opacity-60">Global Excellence</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: FORM FIELDS */}
                <div className="md:w-7/12 p-8 md:p-14 bg-white">
                    <div className="mb-10">
                        <h2 className="text-2xl font-black text-[#00558d] uppercase tracking-tight italic">Create Account</h2>
                        <p className="text-gray-400 text-sm mt-1 font-medium">Please enter your details to register.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#00558d] uppercase tracking-[0.2em] ml-1">Full Name *</label>
                                <input type="text" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none transition-all shadow-sm text-sm" placeholder="John Doe" required />
                            </div>

                            {/* Mobile Number */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#00558d] uppercase tracking-[0.2em] ml-1">Phone Number *</label>
                                <input type="tel" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none transition-all shadow-sm text-sm" placeholder="+91 00000 00000" required />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#00558d] uppercase tracking-[0.2em] ml-1">Email Address *</label>
                            <input type="email" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none transition-all shadow-sm text-sm" placeholder="john@acadivate.com" required />
                        </div>

                        {/* Category/Role Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#00558d] uppercase tracking-[0.2em] ml-1">I am a *</label>
                            <select className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none transition-all shadow-sm text-sm cursor-pointer">
                                <option>Student</option>
                                <option>Researcher / Academician</option>
                                <option>Industry Professional</option>
                                <option>Others</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#00558d] uppercase tracking-[0.2em] ml-1">Password *</label>
                                <input type="password" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none transition-all shadow-sm text-sm" placeholder="••••••••" required />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#00558d] uppercase tracking-[0.2em] ml-1">Confirm *</label>
                                <input type="password" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none transition-all shadow-sm text-sm" placeholder="••••••••" required />
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-center gap-3 pt-4">
                            <input type="checkbox" className="w-5 h-5 rounded-md accent-[#ff6600]" required />
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                I agree to Acadivate's <span className="text-[#00558d] cursor-pointer underline">Terms & Privacy</span>
                            </p>
                        </div>

                        {/* Registration Button - Extra Small & Compact */}
                        <div className="pt-8 flex justify-center">
                            <button type="submit" className="group relative px-8 py-2.5 bg-[#ff6600] text-white rounded-xl font-black text-xs shadow-[0_8px_30px_rgba(255,102,0,0.15)] hover:shadow-[0_12px_40px_rgba(255,102,0,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden uppercase tracking-[0.2em]">
                                <span className="relative z-10 text-center">Register Now</span>
                                <div className="absolute inset-0 bg-[#e65c00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            </button>
                        </div>

                        <p className="text-center text-xs font-bold text-gray-400 uppercase mt-4">
                            Already have an account? <span className="text-[#00558d] cursor-pointer hover:underline">Log in</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;