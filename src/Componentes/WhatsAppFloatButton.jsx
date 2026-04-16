import { MessageCircle } from "lucide-react";

export default function WhatsAppFloatButton() {
  return (
    <a
      href="https://wa.me/56988861197"
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir WhatsApp de Catarsis"
      className="fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#c8647a]/40 bg-[linear-gradient(145deg,#c8647a_0%,#b55567_100%)] text-white shadow-[0_18px_45px_-20px_rgba(200,100,122,0.65)] transition duration-300 ease-out hover:scale-105 hover:brightness-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
