import React from "react";

const ConfigurationsPage = () => {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="bg-white rounded-[32px] p-12 flex flex-col items-center max-w-lg text-center relative overflow-hidden transition-all hover:shadow-lg border border-[#F3F4F6] shadow-sm">
        {/* Decorative Background Elements */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#193F7F] opacity-[0.03] rounded-full filter blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#22C55E] opacity-[0.03] rounded-full filter blur-2xl"></div>

        {/* Icon Container */}
        <div className="relative group mb-8">
          {/* Subtle spinning dashed border */}
          <div className="absolute -inset-4 border-[2px] border-dashed border-[#193F7F]/20 rounded-full animate-[spin_10s_linear_infinite]" />
          
          <div className="w-28 h-28 bg-gradient-to-tr from-[#EEF2F6] to-white border border-[#E2E8F0] shadow-sm rounded-[28px] flex items-center justify-center transform group-hover:-translate-y-1 group-hover:rotate-6 transition-all duration-300 ease-out relative z-10">
            <span className="text-[52px] drop-shadow-sm filter mt-2">🛠️</span>
          </div>
        </div>

        <h1 className="text-[28px] font-bold text-[#0B1527] mb-3 leading-tight tracking-tight">
          System Configurations
        </h1>
        <p className="text-[15px] text-[#4E7397] leading-relaxed mb-8 px-2">
          We are currently building this module to give you powerful, centralized control over your system parameters and logic. <br className="hidden sm:block" />
          <span className="font-medium text-[#193F7F]">Stay tuned! 🚀</span>
        </p>

        {/* Status Badge */}
        <div className="inline-flex items-center px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0]/80 rounded-full text-[#475569] text-[13px] font-medium shadow-xs">
          <span className="relative flex h-2.5 w-2.5 mr-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#193F7F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#193F7F]"></span>
          </span>
          Under Development
        </div>
      </div>
    </div>
  );
};

export default ConfigurationsPage;
