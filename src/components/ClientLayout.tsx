'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Spinner from "./Spinner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
  if (firstLoad) {
    const timer = setTimeout(() => {
      setFirstLoad(false);
      setLoading(false);
    }, 800); // Mostrar spinner mínimo 0.8s en primera carga
    return () => clearTimeout(timer);
  }

  setLoading(true);
  const timer = setTimeout(() => {
    setLoading(false);
  }, 1800); // Reducir tiempo máximo de 5.5s a 1.8s

  return () => clearTimeout(timer);
}, [pathname]);

  return <>{loading ? <Spinner /> : children}</>;
}
