"use client";
import { FloatingWhatsApp } from "react-floating-whatsapp";

export default function WhatsAppButton() {
    return (
        <FloatingWhatsApp
            phoneNumber="+56988861197"
            accountName="Catarsis · Valeria Díaz"
            avatar="/logocatarsis.png"
            statusMessage=""
            chatMessage="Hola, gracias por contactar a Catarsis. ¿En qué puedo ayudarte?"
            placeholder="Escribe tu mensaje..."
            notification
            notificationSound
        />
    );
}
