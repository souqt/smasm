import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { Server, ShieldCheck, Zap } from "lucide-react";
import { DataContext } from "@/context/DataContext";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const context = useContext(DataContext);
  const data = context?.data;
  const [progress, setProgress] = useState(0);

  const siteName = data?.settings?.siteName || "تلجاوي";
  const tagline = data?.settings?.tagline || "استضافة ومنتجات رقمية وبرمجة ويب";

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((value) => {
        const next = Math.min(100, value + 8 + Math.random() * 13);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 350);
        }
        return next;
      });
    }, 140);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-secondary text-secondary-foreground"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      dir="rtl"
    >
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
        backgroundSize: "42px 42px",
      }} />
      <motion.div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-primary"
        initial={{ scaleX: 0, transformOrigin: "right" }}
        animate={{ scaleX: progress / 100 }}
      />

      <div className="relative z-10 w-[min(560px,calc(100vw-2rem))] text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-lg border border-white/15 bg-white/10 shadow-elevated backdrop-blur"
        >
          <Server className="h-10 w-10 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading text-4xl font-bold sm:text-5xl"
        >
          {siteName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mx-auto mt-3 max-w-md text-sm leading-7 text-secondary-foreground/70 sm:text-base"
        >
          {tagline}
        </motion.p>

        <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-secondary-foreground/70">
          {[
            { icon: ShieldCheck, label: "دفع آمن" },
            { icon: Zap, label: "تحميل محمي" },
            { icon: Server, label: "استضافة سريعة" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
              <item.icon className="mx-auto mb-2 h-4 w-4 text-primary" />
              {item.label}
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-2 rounded-full bg-gradient-primary" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-secondary-foreground/55">
          <span>تجهيز الواجهة</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
