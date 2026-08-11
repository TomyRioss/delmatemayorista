"use client";

import { motion } from "motion/react";
import { FaBagShopping, FaTruckFast } from "react-icons/fa6";

const items = [
  { icon: FaBagShopping, label: "COMPRA MÍNIMA $50.000" },
  { icon: FaTruckFast, label: "ENVÍOS A TODO EL PAÍS" },
];

export default function TopBar() {
  return (
    <div className="w-full overflow-hidden ">
      <motion.div
        className="flex w-max whitespace-nowrap bg-white py-4"
        animate={{ x: ["0%", "-16.66%", "-16.66%", "-33.33%", "-33.33%", "-50%"] }}
        transition={{
          duration: 120,
          times: [0, 0.3, 0.4, 0.7, 0.8, 1],
          ease: ["easeInOut", "easeInOut", "easeInOut", "easeInOut", "easeInOut"],
          repeat: Infinity,
        }}
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <span key={i} className="flex shrink-0 items-center">
            {Array.from({ length: 4 }).map((_, j) =>
              items.map((item, k) => (
                <span
                  key={`${j}-${k}`}
                  className="mx-14 flex items-center gap-3 text-base font-normal text-[#FF3412] sm:text-lg"
                >
                  <item.icon className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
                  {item.label}
                </span>
              ))
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
