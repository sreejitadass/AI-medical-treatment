import React from "react";

const MetricsCard = ({ title, value, icon: Icon }) => (
  <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-800 dark:bg-[#13131a]">
    <div className="flex justify-between gap-x-3 p-4 md:p-5">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
          {title}
        </p>
        <div className="mt-1 flex items-center gap-x-2">
          <h3 className="text-xl font-medium text-gray-800 sm:text-2xl dark:text-neutral-200">
            {value}
          </h3>
        </div>
      </div>
      <div className="flex size-[46px] h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-[#1c1c24] dark:text-blue-200">
        <Icon size={25} className="text-green-500" />
      </div>
    </div>
  </div>
);

export default MetricsCard;
