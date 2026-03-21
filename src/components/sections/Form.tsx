"use client";
import React from 'react';

const AcadivateForm = () => {
    return (
        <div className="w-full max-w-5xl mx-auto my-12 bg-white shadow-[0_20px_50px_rgba(0,85,141,0.12)] rounded-[2rem] overflow-hidden border border-gray-100 font-sans text-gray-800">

            {/* HEADER SECTION */}
            <div className="bg-[#00558d] p-10 md:p-14 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.45L19.15 19H4.85L12 5.45z" /></svg>
                </div>
                <div className="relative z-10">
                    <span className="bg-[#ff6600] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4 inline-block">Official Nomination Portal</span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">ARIF 2026 AWARDS</h1>
                    <p className="text-blue-100 text-lg opacity-80 max-w-2xl font-medium">International Conference on Global Sustainability & Research Innovation.</p>
                </div>
            </div>

            <form className="p-8 md:p-12 space-y-16">

                {/* SECTION 1: CONTACT INFORMATION */}
                <section>
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-2xl font-black text-[#00558d] uppercase tracking-tight italic">01. Contact Information</h2>
                        <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-100 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#00558d] uppercase tracking-widest">Nominee's First Name *</label>
                            <input type="text" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none transition-all shadow-sm" placeholder="Enter first name" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#00558d] uppercase tracking-widest">Nominee's Last Name *</label>
                            <input type="text" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none transition-all shadow-sm" placeholder="Enter last name" required />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black text-[#00558d] uppercase tracking-widest">Nominee's Email Address *</label>
                            <input type="email" className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none transition-all shadow-sm" placeholder="email@domain.com" required />
                        </div>
                    </div>

                    {/* Radio Buttons - Image Content */}
                    <div className="mt-10 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4">
                        <p className="text-sm font-bold text-[#00558d]">Are you voting for the individual above for this nomination? *</p>
                        <div className="flex gap-10">
                            {["Yes", "No"].map((opt) => (
                                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="radio" name="voting" className="w-5 h-5 accent-[#ff6600]" />
                                    <span className="text-sm font-bold group-hover:text-[#ff6600] transition-colors">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Checkbox Grid - Image Content */}
                    <div className="mt-10 space-y-4">
                        <label className="block text-sm font-black text-[#00558d] uppercase">How did you hear about us? *</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-3xl">
                            {["Email / Direct Mail", "LinkedIn Network", "Google / Search", "Instagram / FB", "Facebook Post", "Colleague / Friend", "Website / News", "Twitter / X", "Other"].map((item) => (
                                <label key={item} className="flex items-center gap-3 text-sm font-medium cursor-pointer hover:text-[#ff6600]">
                                    <input type="checkbox" className="w-4 h-4 rounded accent-[#ff6600]" /> {item}
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 2: NARRATIVE - Full Content */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-[#00558d] uppercase tracking-tight italic">02. Nomination Narrative</h2>
                        <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-100 to-transparent"></div>
                    </div>

                    <div className="bg-orange-50 border-l-8 border-[#ff6600] p-8 rounded-3xl mb-6 shadow-sm">
                        <h3 className="text-[#ff6600] font-black text-sm uppercase mb-3">Submission Guidelines:</h3>
                        <ul className="text-sm space-y-2 text-gray-700 font-medium">
                            <li className="flex gap-2"><span>•</span> Why are you nominating this individual? (Min 250 words)</li>
                            <li className="flex gap-2"><span>•</span> Detail their key professional achievements and leadership roles.</li>
                            <li className="flex gap-2"><span>•</span> What impact have they made in the field of sustainability?</li>
                            <li className="flex gap-2"><span>•</span> List any awards, patents, or notable contributions.</li>
                        </ul>
                    </div>

                    <textarea rows={12} className="w-full p-8 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-[#00558d] outline-none transition-all shadow-inner text-lg" placeholder="Start typing your full narrative here..." required></textarea>
                </section>

                {/* SECTION 3: LEADERSHIP & BACKGROUND */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-[#00558d] uppercase tracking-tight italic">03. Professional Background</h2>
                        <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-100 to-transparent"></div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-sm font-black text-[#00558d] uppercase">Roles & Organizations *</label>
                            <textarea rows={4} className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none" placeholder="List organizations and roles..."></textarea>
                        </div>
                        <div className="space-y-3">
                            <label className="block text-sm font-black text-[#00558d] uppercase">Educational Background *</label>
                            <textarea rows={4} className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#00558d] outline-none" placeholder="University, Degrees, Certifications..."></textarea>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: CLICKABLE SUPPORTING MATERIALS */}
                <section>
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-2xl font-black text-[#00558d] uppercase tracking-tight italic">04. Supporting Materials</h2>
                        <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-100 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="group flex flex-col">
                                <label className="text-xs font-black text-[#00558d] uppercase mb-3 tracking-widest italic">Document / Research File {i}</label>

                                {/* Fully Clickable Modular Block */}
                                <label className="relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50 cursor-pointer group-hover:border-[#ff6600] group-hover:bg-orange-50/40 transition-all duration-500 shadow-sm overflow-hidden">
                                    <div className="absolute inset-0 bg-[#ff6600] opacity-0 group-hover:opacity-[0.02] transition-opacity"></div>
                                    <div className="flex flex-col items-center p-6">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform border border-gray-50">
                                            <svg className="w-8 h-8 text-[#ff6600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-black text-[#00558d] mb-1">Click to Upload File</span>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">PDF / Word / JPG (10MB Max)</p>
                                    </div>
                                    <input type="file" className="hidden" />
                                </label>

                                <input type="text" placeholder="Add description or website link..." className="mt-4 w-full px-4 py-2 text-xs font-bold border-b-2 border-gray-100 focus:border-[#ff6600] bg-transparent outline-none transition-all placeholder:text-gray-300" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* SUBMIT SECTION */}
                {/* SUBMIT SECTION - Updated to be smaller and centered */}
                <div className="pt-12 pb-6 border-t border-gray-100 flex flex-col items-center space-y-6">
                    <div className="flex items-center gap-3 text-center max-w-sm">
                        <input type="checkbox" className="w-4 h-4 rounded accent-[#00558d] cursor-pointer" required />
                        <p className="text-[9px] font-black text-gray-400 uppercase leading-relaxed tracking-wider">
                            I certify that the information provided is correct.
                        </p>
                    </div>

                    <div className="flex justify-center w-full">
                        <button type="submit" className="group relative px-10 py-2.5 bg-[#ff6600] text-white rounded-full font-black text-xs shadow-[0_12px_35px_rgba(255,102,0,0.2)] hover:shadow-[0_18px_45px_rgba(255,102,0,0.3)] hover:-translate-y-1 transition-all duration-500 active:scale-95 overflow-hidden">
                            <span className="relative z-10 uppercase tracking-[0.2em]">Submit Nomination</span>
                            <div className="absolute inset-0 bg-[#e65c00] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                        </button>
                    </div>
                </div>
            </form>

            {/* ACADIVATE BRANDING FOOTER */}
            <footer className="bg-[#f8fafc] p-12 border-t border-gray-100 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-6">
                        <span className="text-3xl font-black text-[#00558d] italic tracking-tighter uppercase">Acadivate</span>
                        <div className="h-8 w-[2px] bg-gray-200 rotate-[20deg]"></div>
                        <span className="text-3xl font-black text-[#ff6600] italic tracking-tighter uppercase">Arif 2026</span>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Global Sustainability & Professional Excellence</p>
                </div>
            </footer>
        </div>
    );
};

export default AcadivateForm;