"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
};

const MetricCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  iconColor,
}: MetricCardProps) => {
  return (
    <div className="bg-white rounded-xl p-5 flex items-center border border-[#EEEEEE]">
      <div
        className={`w-[52px] h-[52px] ${bgColor} rounded-full flex items-center justify-center shrink-0`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="ml-3 min-w-0">
        <h3 className="text-xl font-bold text-gray-900 truncate">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

export default MetricCard;
