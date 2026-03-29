"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({ expiryTime }: { expiryTime: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(expiryTime).getTime() - Date.now();
      if (diff <= 0) {
        setLabel("Expired");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setLabel(`${hours}h ${minutes}m left`);
    }

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  return <span className="text-sm font-medium text-coral">{label}</span>;
}

