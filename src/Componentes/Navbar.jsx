"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
const navItems = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Sobre mí", href: "/#sobre-mi" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Publicaciones", href: "/#publicaciones" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId = null;

    const updateProgress = () => {
      const y = window.scrollY || 0;
      const next = Math.min(y / 200, 1);

      setScrollProgress((current) => {
        if (Math.abs(current - next) < 0.01) return current;
        return next;
      });
      rafId = null;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const bgAlpha = 0.05 + scrollProgress * 0.9;
  const blurPx = scrollProgress * 20;
  const borderAlpha = scrollProgress * 0.22;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color,border-width] duration-300"
      style={{
        background: `rgba(28,43,69,${bgAlpha})`,
        backdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(120%)` : undefined,
        borderBottomColor: `rgba(201,165,90,${borderAlpha})`,
        borderBottomStyle: "solid",
        borderBottomWidth: scrollProgress > 0.05 ? "1px" : "0px",
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 md:h-24 md:px-8 lg:px-6">
        <Link href="/#inicio" aria-label="Ir al inicio" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logocatarsisfull.png"
            alt="Logo Catarsis"
            width={62}
            height={62}
            priority
            className="h-13.5 w-auto object-contain sm:h-16"
          />
        </Link>

        <nav aria-label="Menú principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-10">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/75 transition-colors duration-200 hover:text-[#c8647a]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/agendaProfesionales"
            aria-label="Agendar sesión"
            className="hidden border border-[#c8647a] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c8647a] transition duration-300 hover:bg-[#c8647a] hover:text-white sm:inline-flex sm:px-6 sm:py-2.5 sm:text-xs"
          >
            Agendar sesión
          </Link>
          <button
            type="button"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((p) => !p)}
            className="inline-flex h-9 w-9 items-center justify-center text-white/85 transition hover:text-white lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={[
          "overflow-hidden border-t border-white/10 bg-[#1c2b45] lg:hidden",
          isOpen ? "max-h-105 opacity-100" : "max-h-0 opacity-0",
          "transition-all duration-300 ease-out",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 md:px-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70 transition hover:text-[#c8647a]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/agendaProfesionales"
            onClick={() => setIsOpen(false)}
            aria-label="Agendar sesión desde menú móvil"
            className="mt-2 border border-[#c8647a] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c8647a] transition hover:bg-[#c8647a] hover:text-white"
          >
            Agendar sesión
          </Link>
        </div>
      </div>
    </header>
  );
}
