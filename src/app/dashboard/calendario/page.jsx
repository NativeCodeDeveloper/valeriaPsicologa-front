"use client"

import {useState, useMemo, useEffect, useRef, Suspense} from "react";
import {useSearchParams} from "next/navigation";
import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";

import es from "date-fns/locale/es";
import {InfoButton} from "@/Componentes/InfoButton";
import {SelectDinamic} from "@/Componentes/SelectDinamic";

const locales = {es: es};
const dfStartOfWeek = (date) => startOfWeek(date, {locale: es});
const localizer = dateFnsLocalizer({format, parse, startOfWeek: dfStartOfWeek, getDay, locales});
const DnDCalendar = withDragAndDrop(Calendar);
const HORA_MINIMA_AGENDA = 9;
const HORA_MAXIMA_AGENDA = 20;

function crearHoraLimite(hora, minuto = 0, segundo = 0) {
    const fecha = new Date();
    fecha.setHours(hora, minuto, segundo, 0);
    return fecha;
}

function normalizarIdProfesional(valor) {
    if (valor === null || valor === undefined) return "";
    return String(valor);
}

function normalizarCorreoOpcional(valor) {
    const correo = (valor ?? "").trim();
    return correo || null;
}

export default function Calendario() {
    return (
        <Suspense fallback={<div className="min-h-screen grid place-items-center"><span className="text-sm text-slate-400">Cargando calendario...</span></div>}>
            <CalendarioContent />
        </Suspense>
    );
}

function CalendarioContent() {

    const API = process.env.NEXT_PUBLIC_API_URL;
    const popupRef = useRef(null);
    const popupDragStateRef = useRef({dragging: false, offsetX: 0, offsetY: 0});
    const selectionGuardRef = useRef({missingProfessional: false, overlap: false, past: false, outOfHours: false});

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .rbc-calendar, .rbc-time-view, .rbc-month-view {
                border: 0 !important;
                background: transparent !important;
            }
            .rbc-toolbar {
                margin-bottom: 16px !important;
                gap: 10px !important;
            }
            .rbc-toolbar button {
                border-radius: 12px !important;
                border: 1px solid #e2e8f0 !important;
                background: #ffffff !important;
                color: #475569 !important;
                box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
            }
            .rbc-toolbar button:hover,
            .rbc-toolbar button:focus {
                background: #faf5ff !important;
                border-color: #c084fc !important;
                color: #7c3aed !important;
            }
            .rbc-toolbar button.rbc-active {
                background: linear-gradient(135deg, #9333ea, #7c3aed) !important;
                border-color: #7c3aed !important;
                color: #ffffff !important;
                box-shadow: 0 12px 24px rgba(124, 58, 237, 0.22) !important;
            }
            .rbc-header {
                padding: 12px 8px !important;
                border-bottom: 1px solid #e2e8f0 !important;
                color: #475569 !important;
                font-size: 12px !important;
                font-weight: 700 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.08em !important;
                background: rgba(248, 250, 252, 0.85) !important;
            }
            .rbc-time-view .rbc-header,
            .rbc-time-view .rbc-time-gutter .rbc-label,
            .rbc-time-view .rbc-time-slot {
                font-size: 14.4px !important;
            }
            .rbc-time-header-content,
            .rbc-time-content,
            .rbc-time-view,
            .rbc-timeslot-group,
            .rbc-day-bg + .rbc-day-bg,
            .rbc-month-row + .rbc-month-row,
            .rbc-header + .rbc-header,
            .rbc-time-header-content + .rbc-time-header-content {
                border-color: #e2e8f0 !important;
            }
            .rbc-time-content {
                -webkit-overflow-scrolling: touch !important;
                touch-action: pan-y !important;
                overscroll-behavior: contain !important;
            }
            .rbc-time-view .rbc-timeslot-group {
                min-height: 44px !important;
            }
            .rbc-time-slot {
                transition: background-color 120ms ease !important;
            }
            .rbc-day-slot .rbc-time-slot:hover {
                background: rgba(168, 85, 247, 0.06) !important;
            }
            .rbc-today {
                background: rgba(237, 233, 254, 0.42) !important;
            }
            .rbc-current-time-indicator {
                background-color: #7c3aed !important;
                height: 2px !important;
            }
            .rbc-slot-selection {
                background: rgba(124, 58, 237, 0.22) !important;
                border: 1px solid rgba(124, 58, 237, 0.42) !important;
                border-radius: 16px !important;
                box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2) !important;
            }
            .rbc-selected-cell {
                background: rgba(124, 58, 237, 0.08) !important;
            }
            .rbc-event,
            .rbc-background-event {
                border-radius: 0 !important;
                box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08) !important;
            }
            .rbc-background-event {
                background-color: rgba(107, 114, 128, 0.28) !important;
                border: 1px solid rgba(107, 114, 128, 0.38) !important;
                border-left: 4px solid rgba(71, 85, 105, 0.95) !important;
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16) !important;
            }
            .rbc-addons-dnd-resizable {
                border-radius: 16px !important;
            }
            .rbc-addons-dnd-resize-anchor {
                width: 100% !important;
                height: 6px !important;
            }
            .rbc-month-view .rbc-event {
                min-height: 0 !important; height: 20px !important; padding: 0 5px !important;
                line-height: 20px !important; white-space: nowrap !important; overflow: hidden !important;
                text-overflow: ellipsis !important; font-size: 0.72rem !important;
                border-radius: 4px !important; margin-bottom: 2px !important;
            }
            .rbc-month-view .rbc-row-content { overflow: hidden !important; }
            .rbc-month-view .rbc-month-row { overflow: hidden !important; }
            .rbc-time-view .rbc-event {
                min-height: 0 !important; padding: 4px 8px !important;
                line-height: 1.3 !important; overflow: hidden !important;
                font-size: 0.78rem !important; border-radius: 6px !important;
            }
            .rbc-time-view .rbc-event-content { overflow: hidden !important; height: 100% !important; font-size: 0.78rem !important; white-space: normal !important; }
            .rbc-row-segment { z-index: 1 !important; }
            .rbc-event-label { display: none !important; }
            .rbc-event-content { overflow: hidden !important; font-size: inherit !important; }
            .rbc-agenda-view table.rbc-agenda-table { border-collapse: collapse !important; width: 100% !important; }
            .rbc-agenda-view .rbc-agenda-date-cell, .rbc-agenda-view .rbc-agenda-time-cell { font-size: 0.78rem !important; color: #475569 !important; font-weight: 500 !important; padding: 8px 12px !important; vertical-align: middle !important; white-space: nowrap !important; }
            .rbc-agenda-view .rbc-agenda-event-cell { padding: 6px 10px !important; vertical-align: middle !important; }
            .rbc-agenda-view tbody > tr { border-top: 1px solid #f1f5f9 !important; transition: background 100ms !important; }
            .rbc-agenda-view tbody > tr:hover { background: rgba(124, 58, 237, 0.03) !important; }
            .rbc-agenda-view .rbc-agenda-date-cell { font-weight: 700 !important; color: #7c3aed !important; font-size: 0.8rem !important; }
            .rbc-agenda-empty { text-align: center !important; color: #94a3b8 !important; font-size: 0.85rem !important; padding: 32px !important; }
            .rbc-show-more { font-size: 0.7rem !important; color: #7c3aed !important; font-weight: 600 !important; padding: 0 4px !important; }
            .rbc-month-view .rbc-date-cell { padding: 4px 6px !important; font-size: 0.8rem !important; font-weight: 600 !important; color: #475569 !important; }
            .rbc-month-view .rbc-row-bg .rbc-day-bg { border-radius: 0 !important; }
            @media (max-width: 767px) {
                .rbc-time-view,
                .rbc-time-content,
                .rbc-day-slot,
                .rbc-time-column {
                    touch-action: pan-y !important;
                }
                .rbc-toolbar {
                    flex-wrap: wrap !important;
                }
                .rbc-toolbar button {
                    min-height: 38px !important;
                }
            }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("week");
    const [esMobile, setEsMobile] = useState(false);

    const searchParams = useSearchParams();

    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const nombre = searchParams.get("nombre");
        if (nombre) setNombrePaciente(nombre);
        const apellido = searchParams.get("apellido");
        if (apellido) setApellidoPaciente(apellido);
        const rutParam = searchParams.get("rut");
        if (rutParam) setRut(rutParam);
        const tel = searchParams.get("telefono");
        if (tel) setTelefono(tel);
        const correo = searchParams.get("email");
        if (correo) setEmail(correo);
    }, []);

    const [fechaInicio, setfechaInicio] = useState("");
    const [fechaFinalizacion, setfechaFinalizacion] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFinalizacion, setHoraFinalizacion] = useState("");
    const [estadoReserva, setEstadoReserva] = useState("");
    const [id_reserva, setid_reserva] = useState(0);
    const [dataAgenda, setDataAgenda] = useState([]);
    const [dataBloqueos, setDataBloqueos] = useState([]);
    const [listaProfesionales, setListaProfesionales] = useState([]);
    const [id_profesional, setId_profesional] = useState("");
    const [backgroundCalendarEvents, setBackgroundCalendarEvents] = useState([]);
    const [mostrarListaBloqueos, setMostrarListaBloqueos] = useState(true);
    const [mostrarFormularioAgenda, setMostrarFormularioAgenda] = useState(false);
    const [selectionPreview, setSelectionPreview] = useState(null);
    const [selectionDraft, setSelectionDraft] = useState(null);
    const [floatingDraft, setFloatingDraft] = useState(null);
    const [popupMode, setPopupMode] = useState("create");
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});
    const [draggingPopup, setDraggingPopup] = useState(false);
    const [popupForm, setPopupForm] = useState({
        nombrePaciente: "",
        apellidoPaciente: "",
        rut: "",
        telefono: "",
        email: "",
        motivoBloqueo: "",
    });

    useEffect(() => {
        function actualizarModoMobile() {
            const mobile = window.innerWidth < 768;
            setEsMobile(mobile);
            setCurrentView((prev) => {
                if (mobile && prev !== "day") return "day";
                return prev;
            });
        }
        actualizarModoMobile();
        window.addEventListener("resize", actualizarModoMobile);
        return () => window.removeEventListener("resize", actualizarModoMobile);
    }, []);

    async function seleccionarTodosProfesionalesCalendario() {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            });
            if (!res.ok) {
                return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
            } else {
                const respustaBackend = await res.json();
                if (respustaBackend && respustaBackend.length > 0) {
                    setListaProfesionales(respustaBackend);
                    setId_profesional(normalizarIdProfesional(respustaBackend[0].id_profesional));
                } else {
                    return toast.error('No hay profesionales o servicios ingresados en el sistema');
                }
            }
        } catch (error) {
            return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
        }
    }

    useEffect(() => { seleccionarTodosProfesionalesCalendario(); }, []);

    function formatearFechaLocal(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    }

    function manejarCambioFechaMobile(valorFecha) {
        if (!valorFecha) return;
        const [year, month, day] = valorFecha.split("-").map(Number);
        if ([year, month, day].some(Number.isNaN)) return;
        const siguienteFecha = new Date(currentDate);
        siguienteFecha.setFullYear(year, month - 1, day);
        siguienteFecha.setHours(0, 0, 0, 0);
        setCurrentDate(siguienteFecha);
        setCurrentView("day");
    }

    function convertirAFechaCalendario(fechaISO, hora) {
        const soloFecha = fechaISO.slice(0, 10);
        return new Date(`${soloFecha}T${hora}`);
    }

    function estaDentroHorarioAgenda(start, end) {
        if (!(start instanceof Date) || Number.isNaN(start.getTime())) return false;
        if (!(end instanceof Date) || Number.isNaN(end.getTime())) return false;
        const minutosInicio = start.getHours() * 60 + start.getMinutes();
        const minutosFin = end.getHours() * 60 + end.getMinutes();
        const minimo = HORA_MINIMA_AGENDA * 60;
        const maximo = HORA_MAXIMA_AGENDA * 60;
        return minutosInicio >= minimo && minutosFin <= maximo && end > start;
    }

    function esMovimientoHaciaHorarioPasado(start) {
        if (!(start instanceof Date) || Number.isNaN(start.getTime())) return false;
        return start < new Date();
    }

    function normalizarRut(valor = "") {
        return String(valor).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    }

    function obtenerTipoSolapamiento(start, end, ignoredReservaId = null) {
        if (dataAgenda && dataAgenda.length > 0) {
            for (const cita of dataAgenda) {
                if (ignoredReservaId && cita.id_reserva === ignoredReservaId) continue;
                const evStart = convertirAFechaCalendario((cita.fechaInicio ?? "").slice(0, 10), (cita.horaInicio ?? "00:00:00"));
                const evEnd = convertirAFechaCalendario((cita.fechaFinalizacion ?? "").slice(0, 10), (cita.horaFinalizacion ?? "00:00:00"));
                if (start < evEnd && end > evStart) return "reserva";
            }
        }
        if (dataBloqueos && dataBloqueos.length > 0) {
            for (const bloqueo of dataBloqueos) {
                const horaIni = bloqueo.horaInicio ?? "00:00:00";
                const horaFin = bloqueo.horaFinalizacion ?? "23:59:00";
                const fechaIniStr = (bloqueo.fechaInicio ?? "").slice(0, 10);
                const fechaFinStr = (bloqueo.fechaFinalizacion ?? "").slice(0, 10);
                const primerDia = new Date(fechaIniStr + "T00:00:00");
                const ultimoDia = new Date(fechaFinStr + "T00:00:00");
                if (isNaN(primerDia.getTime()) || isNaN(ultimoDia.getTime())) continue;
                let cursor = new Date(primerDia);
                while (cursor <= ultimoDia) {
                    const y = cursor.getFullYear();
                    const m = String(cursor.getMonth() + 1).padStart(2, "0");
                    const d = String(cursor.getDate()).padStart(2, "0");
                    const fechaDia = `${y}-${m}-${d}`;
                    const bStart = new Date(`${fechaDia}T${horaIni}`);
                    const bEnd = new Date(`${fechaDia}T${horaFin}`);
                    if (start < bEnd && end > bStart) return "bloqueo";
                    cursor = new Date(y, cursor.getMonth(), cursor.getDate() + 1, 0, 0, 0);
                }
            }
        }
        return null;
    }

    function isOverlapping(start, end, ignoredReservaId = null) {
        return obtenerTipoSolapamiento(start, end, ignoredReservaId) !== null;
    }

    function formatHoraCorta(date) { return format(date, "HH:mm", {locale: es}); }
    function formatFechaLarga(date) { return format(date, "EEEE d 'de' MMMM", {locale: es}); }

    function obtenerTituloReserva(cita) {
        const nombre = (cita?.nombrePaciente ?? "").trim();
        const apellido = (cita?.apellidoPaciente ?? "").trim();
        const inicialApellido = apellido ? `${apellido.charAt(0).toUpperCase()}.` : "";
        return [nombre, inicialApellido].filter(Boolean).join(" ");
    }

    function obtenerTooltipEvento(event) {
        if (event?.tipo === "bloqueo") return event.title || "Bloqueo";
        if (event?.tipo === "reserva") {
            const nombre = (event.resource?.nombrePaciente ?? "").trim();
            const apellido = (event.resource?.apellidoPaciente ?? "").trim();
            const horario = event.start && event.end ? `${formatHoraCorta(event.start)} - ${formatHoraCorta(event.end)}` : "";
            return [nombre, apellido, horario].filter(Boolean).join(" | ");
        }
        return event?.title || "";
    }

    function obtenerNombreProfesionalSeleccionado() {
        const profesionalSeleccionado = normalizarIdProfesional(id_profesional);
        return listaProfesionales.find((p) => normalizarIdProfesional(p.id_profesional) === profesionalSeleccionado)?.nombreProfesional ?? "Sin profesional";
    }

    function limpiarSeleccionTemporal() {
        setSelectionPreview(null);
        setSelectionDraft(null);
        setFloatingDraft(null);
        setPopupMode("create");
        setPopupForm({nombrePaciente: "", apellidoPaciente: "", rut: "", telefono: "", email: "", motivoBloqueo: ""});
    }

    function abrirPopupSeleccion(slotInfo) {
        const start = slotInfo.start ?? slotInfo;
        const end = slotInfo.end ?? slotInfo;
        setPopupMode("create");
        setfechaInicio(formatearFechaLocal(start));
        setHoraInicio(start.toTimeString().slice(0, 8));
        setfechaFinalizacion(formatearFechaLocal(end));
        setHoraFinalizacion(end.toTimeString().slice(0, 8));
        const nextDraft = {start, end, profesional: obtenerNombreProfesionalSeleccionado(), estadoReserva: "reservada", id_reserva: null};
        setSelectionDraft(nextDraft);
        setPopupForm({nombrePaciente, apellidoPaciente, rut, telefono, email, motivoBloqueo: ""});
        setFloatingDraft({id: "draft-selection", title: "Nuevo agendamiento", start, end, tipo: "seleccion"});
        const bounds = slotInfo?.bounds;
        const centerX = typeof window !== "undefined" ? window.innerWidth / 2 - 140 : 320;
        const centerY = typeof window !== "undefined" ? Math.max(24, window.innerHeight / 2 - 300) : 140;
        setPopupPosition({
            x: bounds ? Math.min(bounds.left + 24, window.innerWidth - 320) : centerX,
            y: bounds ? Math.max(bounds.top - 120, 24) : centerY,
        });
    }

    function abrirPopupReservaExistente(eventoReserva) {
        const reserva = eventoReserva?.resource;
        const start = eventoReserva?.start;
        const end = eventoReserva?.end;
        if (!reserva || !start || !end) { toast.error("No se pudo cargar la reserva seleccionada."); return; }
        setPopupMode("edit");
        setid_reserva(reserva.id_reserva);
        setNombrePaciente(reserva.nombrePaciente ?? "");
        setApellidoPaciente(reserva.apellidoPaciente ?? "");
        setRut(reserva.rut ?? "");
        setTelefono(reserva.telefono ?? "");
        setEmail(reserva.email ?? "");
        setEstadoReserva(reserva.estadoReserva ?? "reservada");
        setfechaInicio(formatearFechaLocal(start));
        setHoraInicio(start.toTimeString().slice(0, 8));
        setfechaFinalizacion(formatearFechaLocal(end));
        setHoraFinalizacion(end.toTimeString().slice(0, 8));
        setSelectionDraft({start, end, profesional: obtenerNombreProfesionalSeleccionado(), estadoReserva: reserva.estadoReserva ?? "reservada", id_reserva: reserva.id_reserva});
        setPopupForm({nombrePaciente: reserva.nombrePaciente ?? "", apellidoPaciente: reserva.apellidoPaciente ?? "", rut: reserva.rut ?? "", telefono: reserva.telefono ?? "", email: reserva.email ?? "", motivoBloqueo: ""});
        setFloatingDraft(null);
        setPopupPosition({
            x: typeof window !== "undefined" ? Math.max(16, window.innerWidth / 2 - 210) : 320,
            y: typeof window !== "undefined" ? Math.max(24, window.innerHeight / 2 - 300) : 140,
        });
    }

    function actualizarBorradorSeleccion(start, end) {
        const nextDraft = {start, end, profesional: obtenerNombreProfesionalSeleccionado(), estadoReserva: selectionDraft?.estadoReserva ?? "reservada", id_reserva: selectionDraft?.id_reserva ?? null};
        setSelectionDraft(nextDraft);
        if (popupMode === "create") setFloatingDraft({id: "draft-selection", title: "Nuevo agendamiento", start, end, tipo: "seleccion"});
        setfechaInicio(formatearFechaLocal(start));
        setHoraInicio(start.toTimeString().slice(0, 8));
        setfechaFinalizacion(formatearFechaLocal(end));
        setHoraFinalizacion(end.toTimeString().slice(0, 8));
    }

    function actualizarHoraSeleccionDraft(campo, valorHora) {
        if (!selectionDraft || !valorHora) return;
        const [horas, minutos] = valorHora.split(":").map(Number);
        if (Number.isNaN(horas) || Number.isNaN(minutos)) return;
        const nuevoInicio = new Date(selectionDraft.start);
        const nuevoFin = new Date(selectionDraft.end);
        if (campo === "start") nuevoInicio.setHours(horas, minutos, 0, 0);
        else nuevoFin.setHours(horas, minutos, 0, 0);
        if (!estaDentroHorarioAgenda(nuevoInicio, nuevoFin)) { toast.error("Solo puedes agendar entre 09:00 y 20:00 horas, con un rango valido."); return; }
        if (isOverlapping(nuevoInicio, nuevoFin, selectionDraft?.id_reserva ?? null)) { toast.error("Esta hora tiene un bloqueo u hora preexistente."); return; }
        actualizarBorradorSeleccion(nuevoInicio, nuevoFin);
    }

    function actualizarFechaSeleccionDraft(valorFecha) {
        if (!selectionDraft || !valorFecha) return;
        const [year, month, day] = valorFecha.split("-").map(Number);
        if ([year, month, day].some(Number.isNaN)) return;
        const nuevoInicio = new Date(selectionDraft.start);
        const nuevoFin = new Date(selectionDraft.end);
        nuevoInicio.setFullYear(year, month - 1, day);
        nuevoFin.setFullYear(year, month - 1, day);
        if (!estaDentroHorarioAgenda(nuevoInicio, nuevoFin)) { toast.error("Solo puedes agendar entre 09:00 y 20:00 horas, con un rango valido."); return; }
        if (isOverlapping(nuevoInicio, nuevoFin, selectionDraft?.id_reserva ?? null)) { toast.error("Esta hora tiene un bloqueo u hora preexistente."); return; }
        actualizarBorradorSeleccion(nuevoInicio, nuevoFin);
    }

    function validarSeleccionPrevia(start, end, ignoredReservaId = null) {
        if (!id_profesional) {
            if (!selectionGuardRef.current.missingProfessional) {
                selectionGuardRef.current.missingProfessional = true;
                toast.error("Primero debes seleccionar un profesional.");
                setTimeout(() => { selectionGuardRef.current.missingProfessional = false; }, 1200);
            }
            setSelectionPreview(null); return false;
        }
        if (esMovimientoHaciaHorarioPasado(start)) {
            if (!selectionGuardRef.current.past) {
                selectionGuardRef.current.past = true;
                toast.error("No puedes mover ni agendar citas en horarios pasados.");
                setTimeout(() => { selectionGuardRef.current.past = false; }, 1200);
            }
            setSelectionPreview(null); return false;
        }
        if (!estaDentroHorarioAgenda(start, end)) {
            if (!selectionGuardRef.current.outOfHours) {
                selectionGuardRef.current.outOfHours = true;
                toast.error("Solo puedes agendar entre 09:00 y 20:00 horas.");
                setTimeout(() => { selectionGuardRef.current.outOfHours = false; }, 1200);
            }
            setSelectionPreview(null); return false;
        }
        const tipoSolapamiento = obtenerTipoSolapamiento(start, end, ignoredReservaId);
        if (tipoSolapamiento) {
            if (!selectionGuardRef.current.overlap) {
                selectionGuardRef.current.overlap = true;
                toast.error("Esta hora tiene un bloqueo u hora preexistente.");
                setTimeout(() => { selectionGuardRef.current.overlap = false; }, 1200);
            }
            setSelectionPreview(null); return false;
        }
        return true;
    }

    async function cargarDataPorProfesional(idProf) {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarPorProfesional`, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json"}, mode: "cors", body: JSON.stringify({id_profesional: idProf})});
            if (!res.ok) return toast.error('No fue posible cargar las agendas del profesional');
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (err) { return toast.error(err.message); }
    }

    async function cargarBloqueosPorProfesional(id_profesional) {
        try {
            const res = await fetch(`${API}/bloqueoAgenda/seleccionarBloqueosPorProfesional`, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json"}, mode: "cors", body: JSON.stringify({id_profesional})});
            if (!res.ok) return [];
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (err) { console.log(err); return []; }
    }

    async function refrescarCalendario() {
        if (id_profesional) {
            const [agenda, bloqueos] = await Promise.all([cargarDataPorProfesional(id_profesional), cargarBloqueosPorProfesional(id_profesional)]);
            setDataAgenda(Array.isArray(agenda) ? agenda : []);
            setDataBloqueos(Array.isArray(bloqueos) ? bloqueos : []);
        }
    }

    useEffect(() => {
        if (!id_profesional) return;
        let activo = true;
        setDataAgenda([]); setDataBloqueos([]);
        async function cargarAgendaProfesional() {
            const [agenda, bloqueos] = await Promise.all([cargarDataPorProfesional(id_profesional), cargarBloqueosPorProfesional(id_profesional)]);
            if (!activo) return;
            setDataAgenda(Array.isArray(agenda) ? agenda : []);
            setDataBloqueos(Array.isArray(bloqueos) ? bloqueos : []);
        }
        cargarAgendaProfesional();
        return () => { activo = false; };
    }, [id_profesional]);

    useEffect(() => {
        if (!draggingPopup) return;
        function actualizarPosicion(clientX, clientY) {
            const popupWidth = popupRef.current?.offsetWidth ?? 420;
            const popupHeight = popupRef.current?.offsetHeight ?? 520;
            const nextX = clientX - popupDragStateRef.current.offsetX;
            const nextY = clientY - popupDragStateRef.current.offsetY;
            setPopupPosition({x: Math.max(8, Math.min(nextX, window.innerWidth - popupWidth - 8)), y: Math.max(8, Math.min(nextY, window.innerHeight - popupHeight - 8))});
        }
        function handleMove(event) { if (!popupDragStateRef.current.dragging) return; actualizarPosicion(event.clientX, event.clientY); }
        function handleTouchMove(event) { if (!popupDragStateRef.current.dragging) return; const touch = event.touches?.[0]; if (!touch) return; event.preventDefault(); actualizarPosicion(touch.clientX, touch.clientY); }
        function handleUp() { popupDragStateRef.current.dragging = false; setDraggingPopup(false); document.body.style.userSelect = ""; document.body.style.touchAction = ""; }
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        window.addEventListener("touchmove", handleTouchMove, {passive: false});
        window.addEventListener("touchend", handleUp);
        return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); window.removeEventListener("touchmove", handleTouchMove); window.removeEventListener("touchend", handleUp); };
    }, [draggingPopup]);

    async function insertarNuevaReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, id_profesional) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !fechaInicio || !horaInicio || !horaFinalizacion || !id_profesional) { toast.error('Debe llenar todos los campos'); return false; }
            const correoNormalizado = normalizarCorreoOpcional(email);
            const ahora = new Date();
            const inicio = new Date(`${fechaInicio}T${horaInicio}`);
            const final = new Date(`${fechaFinalizacion}T${horaFinalizacion}`);
            if (inicio < ahora) { toast.error("No es posible agendar en fechas NO vigentes"); return false; }
            if (!estaDentroHorarioAgenda(inicio, final)) { toast.error("Solo puedes agendar entre 09:00 y 20:00 horas."); return false; }
            if (final < inicio) { toast.error("No es posible en fechas irreales"); return false; }
            if (isOverlapping(inicio, final)) { toast.error('Esta hora tiene un bloqueo u hora preexistente.'); return false; }
            if (fechaInicio === fechaFinalizacion) {
                const res = await fetch(`${API}/reservaPacientes/insertarReservaPacienteFicha`, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json"}, mode: "cors", body: JSON.stringify({nombrePaciente, apellidoPaciente, rut, telefono, email: correoNormalizado, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva: "reservada", id_profesional})});
                const respuestaBackend = await res.json();
                if (!res.ok && respuestaBackend.message === "conflicto") { toast.error("No puede agendar una hora que ya está ocupada."); return false; }
                if (respuestaBackend.message === true) {
                    setNombrePaciente(""); setApellidoPaciente(""); setTelefono(""); setRut(""); setEmail("");
                    await refrescarCalendario();
                    toast.success("Se ha ingresado correctamente el agendamiento");
                    return true;
                } else if (respuestaBackend.message === "conflicto" || String(respuestaBackend.message || "").includes("conflicto")) {
                    toast.error("No puede agendar una hora que ya esta ocupada"); return false;
                } else if (respuestaBackend.message === false) { toast.error('Asegure que no esta ocupada la Hora'); return false; }
            } else { toast.error("Solo se permite agendar si es en el mismo dia"); return false; }
        } catch (error) { console.log(error); toast.error('Sin respuesta del servidor contacte a soporte.'); return false; }
        return false;
    }

    async function ingresarPacienteDesdeAgenda() {
        try {
            const nombre = (nombrePaciente ?? "").trim();
            const apellido = (apellidoPaciente ?? "").trim();
            const rutLimpio = (rut ?? "").trim();
            const telefonoLimpio = (telefono ?? "").trim();
            const correo = normalizarCorreoOpcional(email);
            if (!nombre || !apellido || !rutLimpio || !telefonoLimpio) return toast.error("Debe completar nombre, apellido, RUT y teléfono para ingresar el paciente.");
            const rutNormalizado = normalizarRut(rutLimpio);
            const resBusqueda = await fetch(`${API}/pacientes/contieneRut`, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json"}, mode: "cors", body: JSON.stringify({rut: rutNormalizado})});
            if (resBusqueda.ok) {
                const coincidencias = await resBusqueda.json();
                const yaExiste = Array.isArray(coincidencias) && coincidencias.some((paciente) => normalizarRut(paciente.rut) === rutNormalizado);
                if (yaExiste) return toast.error("Ese paciente ya existe en la lista de pacientes regulares.");
            }
            const resInsercion = await fetch(`${API}/pacientes/pacientesInsercion`, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json"}, mode: "cors", body: JSON.stringify({nombre, apellido, rut: rutLimpio, nacimiento: "1900-01-01", sexo: "No especifica", prevision_id: 1, telefono: telefonoLimpio, correo, direccion: "Por completar", pais: "Chile", observacion1: "Creado desde agenda", observacion2: "NO ESPECIFICADO", observacion3: "NO ESPECIFICADO", apoderado: "NO ESPECIFICADO", apoderado_rut: "NO ESPECIFICADO", medicamentosUsados: "NO ESPECIFICADO", habitos: "NO ESPECIFICADO", comentariosAdicionales: "Paciente ingresado manualmente desde agenda"})});
            if (!resInsercion.ok) { const detalle = await resInsercion.json().catch(() => null); console.log("Error al ingresar paciente desde agenda:", detalle); return toast.error("No se pudo ingresar el paciente desde la agenda."); }
            const respuestaBackend = await resInsercion.json();
            if (respuestaBackend.message === "duplicado") return toast.success("El paciente ya se encuentra ingresado en el sistema.");
            else if (respuestaBackend.message === true) return toast.success("Paciente ingresado correctamente. Quedó creado con datos base para completar después.");
            else return toast.error("No se pudo ingresar el paciente desde la agenda.");
        } catch (error) { console.log(error); return toast.error("Ocurrió un problema al ingresar el paciente desde la agenda."); }
    }

    async function actualizarReservaDesdeCalendario(reservaOriginal, start, end) {
        if (!reservaOriginal?.id_reserva) return toast.error("No fue posible identificar la reserva a mover.");
        if (!validarSeleccionPrevia(start, end, reservaOriginal.id_reserva)) return;
        await actualizarInformacionReserva(reservaOriginal.nombrePaciente, reservaOriginal.apellidoPaciente, reservaOriginal.rut, reservaOriginal.telefono, reservaOriginal.email, formatearFechaLocal(start), start.toTimeString().slice(0, 8), formatearFechaLocal(end), end.toTimeString().slice(0, 8), reservaOriginal.estadoReserva, reservaOriginal.id_profesional, reservaOriginal.id_reserva);
    }

    async function insertarBloqueoHorario(idProf, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, motivo) {
        try {
            if (!idProf) return toast.error("Debe seleccionar un profesional para bloquear un horario.");
            if (!fechaInicio || !horaInicio || !fechaFinalizacion || !horaFinalizacion || !motivo.trim()) return toast.error("Debe indicar el rango y el motivo del bloqueo.");
            const inicio = new Date(`${fechaInicio}T${horaInicio}`);
            const final = new Date(`${fechaFinalizacion}T${horaFinalizacion}`);
            if (!estaDentroHorarioAgenda(inicio, final)) return toast.error("Solo puedes bloquear horarios entre 09:00 y 20:00 horas.");
            const res = await fetch(`${API}/bloqueoAgenda/InsertarBloqueo`, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json"}, mode: "cors", body: JSON.stringify({id_profesional: idProf, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, motivo: motivo.trim()})});
            if (!res.ok) return toast.error("Verifique que no haya una hora o bloqueo previo.");
            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) { await refrescarCalendario(); limpiarSeleccionTemporal(); return toast.success("Se bloqueó el horario correctamente."); }
            if (respuestaBackend.message === "sindisponibilidad") return toast.error("Verifique que no haya una hora o bloqueo previo.");
            return toast.error("Verifique que no haya una hora o bloqueo previo.");
        } catch (error) { console.log(error); return toast.error("Verifique que no haya una hora o bloqueo previo."); }
    }

    async function eliminarBloqueo(id_bloqueo) {
        try {
            if (!id_bloqueo) return toast.error("Debe seleccionar el bloqueo que desea eliminar.");
            const res = await fetch(`${API}/bloqueoAgenda/eliminarBloqueo`, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json"}, body: JSON.stringify({id_bloqueo}), mode: "cors"});
            if (!res.ok) return toast.error("No se ha podido eliminar el bloqueo. Intente más tarde.");
            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) { await refrescarCalendario(); return toast.success("Se ha eliminado el bloqueo correctamente."); }
            return toast.error("No se ha podido eliminar el bloqueo. Intente más tarde.");
        } catch (error) { console.log(error); return toast.error("No se ha podido eliminar el bloqueo. Contacte a soporte."); }
    }

    const messages = useMemo(() => ({next: "Siguiente", previous: "Anterior", today: "Hoy", month: "Mes", week: "Semana", day: "Día", agenda: "Agenda", noEventsInRange: "No hay eventos"}), []);
    const vistasDisponibles = esMobile ? ["day"] : ["month", "week", "day", "agenda"];
    const vistaActiva = esMobile ? "day" : currentView;

    function expandirBloqueosPorDia(bloqueos) {
        const resultado = [];
        for (const bloqueo of bloqueos) {
            const horaIni = bloqueo.horaInicio ?? "00:00:00";
            const horaFin = bloqueo.horaFinalizacion ?? "23:59:00";
            const fechaIniStr = (bloqueo.fechaInicio ?? "").slice(0, 10);
            const fechaFinStr = (bloqueo.fechaFinalizacion ?? "").slice(0, 10);
            const primerDia = new Date(fechaIniStr + "T00:00:00");
            const ultimoDia = new Date(fechaFinStr + "T00:00:00");
            if (isNaN(primerDia.getTime()) || isNaN(ultimoDia.getTime())) continue;
            let cursor = new Date(primerDia);
            while (cursor <= ultimoDia) {
                const y = cursor.getFullYear();
                const m = String(cursor.getMonth() + 1).padStart(2, "0");
                const d = String(cursor.getDate()).padStart(2, "0");
                const fechaDia = `${y}-${m}-${d}`;
                resultado.push({id_bloqueo: bloqueo.id_bloqueo, title: bloqueo.motivo || "Sin motivo", start: new Date(`${fechaDia}T${horaIni}`), end: new Date(`${fechaDia}T${horaFin}`), allDay: false, tipo: "bloqueo", resource: bloqueo});
                cursor = new Date(y, cursor.getMonth(), cursor.getDate() + 1, 0, 0, 0);
            }
        }
        return resultado;
    }

    useEffect(() => {
        const eventosReservas = (dataAgenda || []).map((cita) => ({id_reserva: cita.id_reserva, title: obtenerTituloReserva(cita), start: convertirAFechaCalendario(cita.fechaInicio, cita.horaInicio), end: convertirAFechaCalendario(cita.fechaFinalizacion, cita.horaFinalizacion), allDay: false, tipo: "reserva", resource: cita}));
        const eventosBloqueos = expandirBloqueosPorDia(dataBloqueos || []).map((bloqueo) => ({...bloqueo, allDay: false}));
        if (currentView === "month") { setEvents([...eventosReservas, ...eventosBloqueos]); setBackgroundCalendarEvents([]); return; }
        setEvents(eventosReservas);
        setBackgroundCalendarEvents(eventosBloqueos);
    }, [dataAgenda, dataBloqueos, currentView]);

    function obtenerPaletaEstadoReserva(estadoReserva = "") {
        const estadoNormalizado = estadoReserva.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (estadoNormalizado === "reservada" || estadoNormalizado === "reservado") return {backgroundColor: "rgba(180, 132, 108, 0.24)", color: "#6b4f3f", accentColor: "#8b5e3c", borderColor: "rgba(139, 94, 60, 0.30)"};
        if (estadoNormalizado === "asiste") return {backgroundColor: "rgba(34, 211, 238, 0.20)", color: "#0f766e", accentColor: "#0891b2", borderColor: "rgba(6, 182, 212, 0.30)"};
        if (estadoNormalizado === "no asiste" || estadoNormalizado === "no asistio" || estadoNormalizado === "no asistste") return {backgroundColor: "rgba(251, 146, 60, 0.18)", color: "#9a3412", accentColor: "#ea580c", borderColor: "rgba(249, 115, 22, 0.28)"};
        if (estadoNormalizado === "finalizado") return {backgroundColor: "rgba(37, 99, 235, 0.22)", color: "#1d4ed8", accentColor: "#1e40af", borderColor: "rgba(37, 99, 235, 0.32)"};
        if (estadoNormalizado === "confirmada" || estadoNormalizado === "confirmado") return {backgroundColor: "rgba(34, 197, 94, 0.22)", color: "#14532d", accentColor: "#166534", borderColor: "rgba(34, 197, 94, 0.30)"};
        if (estadoNormalizado === "anulada" || estadoNormalizado === "anulado") return {backgroundColor: "rgba(220, 38, 38, 0.20)", color: "#991b1b", accentColor: "#b91c1c", borderColor: "rgba(220, 38, 38, 0.30)"};
        return {backgroundColor: "rgba(124, 58, 237, 0.20)", color: "#5b21b6", accentColor: "#5b21b6", borderColor: "rgba(124, 58, 237, 0.28)"};
    }

    function obtenerEstiloBotonEstado(estadoReserva = "") {
        const paleta = obtenerPaletaEstadoReserva(estadoReserva);
        return {backgroundColor: paleta.backgroundColor, color: paleta.color, border: `1px solid ${paleta.borderColor}`, borderLeft: `4px solid ${paleta.accentColor}`, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)"};
    }

    const accionesRapidasEstado = [{valor: "reservada", etiqueta: "Reservada"}, {valor: "confirmada", etiqueta: "Confirmada"}, {valor: "anulada", etiqueta: "Anulada"}, {valor: "asiste", etiqueta: "Asiste"}, {valor: "no asiste", etiqueta: "No asiste"}, {valor: "finalizado", etiqueta: "Finalizado"}];
    const leyendaEstados = [{valor: "reservada", etiqueta: "Reservada"}, {valor: "confirmada", etiqueta: "Confirmada"}, {valor: "anulada", etiqueta: "Anulada"}, {valor: "asiste", etiqueta: "Asiste"}, {valor: "no asiste", etiqueta: "No asiste"}, {valor: "finalizado", etiqueta: "Finalizado"}];

    const eventStyleGetter = (event) => {
        const esBloqueo = event.tipo === "bloqueo";
        const esSeleccion = event.tipo === "seleccion";
        const esVistaMes = currentView === "month";
        const paletteReserva = obtenerPaletaEstadoReserva(event.resource?.estadoReserva);
        if (esBloqueo) {
            return {style: {display: 'flex', flexDirection: esVistaMes ? 'row' : 'column', alignItems: esVistaMes ? 'center' : 'flex-start', justifyContent: 'flex-start', height: esVistaMes ? '20px' : '100%', overflow: 'hidden', padding: esVistaMes ? '0 5px' : '4px 8px', fontSize: esVistaMes ? '0.72rem' : '0.78rem', boxSizing: 'border-box', borderRadius: esVistaMes ? '4px' : '6px', backgroundColor: 'rgba(107, 114, 128, 0.22)', color: '#334155', fontWeight: '600', border: '1px solid rgba(107, 114, 128, 0.32)', borderLeft: '3px solid rgba(71, 85, 105, 0.90)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'}};
        }
        return {style: {display: 'flex', flexDirection: esVistaMes ? 'row' : 'column', alignItems: esVistaMes ? 'center' : 'flex-start', justifyContent: 'flex-start', height: esVistaMes ? '20px' : '100%', overflow: 'hidden', padding: esVistaMes ? '0 5px' : '4px 8px', fontSize: esVistaMes ? '0.72rem' : '0.78rem', boxSizing: 'border-box', borderRadius: esVistaMes ? '4px' : '6px', backgroundColor: esSeleccion ? 'rgba(124, 58, 237, 0.18)' : paletteReserva.backgroundColor, color: esSeleccion ? '#5b21b6' : paletteReserva.color, fontWeight: '600', border: esSeleccion ? '1px solid rgba(124, 58, 237, 0.40)' : `1px solid ${paletteReserva.borderColor}`, borderLeft: esSeleccion ? '3px solid rgba(91, 33, 182, 0.90)' : `3px solid ${paletteReserva.accentColor}`, boxShadow: esSeleccion ? 'inset 0 0 0 1px rgba(255,255,255,0.16)' : 'inset 0 0 0 1px rgba(255,255,255,0.12)'}};
    };

    const backgroundEventStyleGetter = (event) => {
        if (event.tipo === "bloqueo") return {className: "bloqueo-calendario-bg", style: {backgroundColor: "rgba(107, 114, 128, 0.28)", border: "1px solid rgba(107, 114, 128, 0.38)", borderLeft: "4px solid rgba(71, 85, 105, 0.95)", borderRadius: "0px", boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.18)"}};
        if (event.tipo === "seleccion") return {style: {backgroundColor: "rgba(124, 58, 237, 0.22)", border: "1px solid rgba(124, 58, 237, 0.42)", borderLeft: "4px solid rgba(91, 33, 182, 0.95)", borderRadius: "0px", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)"}};
        return {style: {}};
    };

    const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" style={{width: '10px', height: '10px', flexShrink: 0}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>);

    const WeekDayEventComponent = ({event}) => {
        const isBloqueo = event.tipo === "bloqueo";
        const timeStr = event.start && event.end ? `${formatHoraCorta(event.start)} – ${formatHoraCorta(event.end)}` : "";
        return (
            <div title={obtenerTooltipEvento(event)} style={{height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '1px'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '3px', overflow: 'hidden'}}>
                    {isBloqueo && <span style={{marginTop: '1px', flexShrink: 0}}><LockIcon /></span>}
                    <span style={{fontWeight: 700, fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.2'}}>{event.title}</span>
                </div>
                {timeStr && <div style={{fontSize: '0.68rem', opacity: 0.75, whiteSpace: 'nowrap', overflow: 'hidden', lineHeight: '1.2'}}>{timeStr}</div>}
            </div>
        );
    };

    const AgendaEventComponent = ({event}) => {
        const isBloqueo = event.tipo === "bloqueo";
        const estado = event.resource?.estadoReserva;
        const palette = !isBloqueo && estado ? obtenerPaletaEstadoReserva(estado) : null;
        return (
            <div title={obtenerTooltipEvento(event)} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                {isBloqueo && <LockIcon />}
                <span style={{fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{event.title}</span>
                {palette && estado && (<span style={{fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '999px', whiteSpace: 'nowrap', flexShrink: 0, backgroundColor: palette.backgroundColor, color: palette.color, border: `1px solid ${palette.borderColor}`}}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</span>)}
            </div>
        );
    };

    const MonthEventComponent = ({event}) => (
        <div title={obtenerTooltipEvento(event)} style={{display: 'flex', alignItems: 'center', gap: '3px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '0.72rem', fontWeight: 600, lineHeight: '20px', width: '100%'}}>
            {event.tipo === "bloqueo" && (<svg xmlns="http://www.w3.org/2000/svg" style={{width: '9px', height: '9px', flexShrink: 0}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>)}
            <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{event.title}</span>
        </div>
    );

    async function actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_profesional, id_reserva) {
        try {
            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFinalizacion || !estadoReserva || !id_profesional || !id_reserva) { toast.error("Debe llenar todos los campos para poder actualizar la reserva"); return false; }
            const correoNormalizado = normalizarCorreoOpcional(email);
            const res = await fetch(`${API}/reservaPacientes/actualizarReservacion`, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json"}, mode: "cors", body: JSON.stringify({nombrePaciente, apellidoPaciente, rut, telefono, email: correoNormalizado, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_profesional, id_reserva})});
            const respuestaBackend = await res.json();
            if (!res.ok && respuestaBackend.message === "conflicto") { toast.error("No puede mover la reserva a un horario ocupado."); return false; }
            if (!res.ok) { toast.error("El servidor no responde"); return false; }
            if (respuestaBackend.message === true) { setNombrePaciente(""); setApellidoPaciente(""); setTelefono(""); setRut(""); setEmail(""); await refrescarCalendario(); toast.success("Se ha actualizado la reserva correctamente"); return true; }
            return false;
        } catch (error) { console.log(error); toast.error(error.message); return false; }
    }

    async function seleccionarReservaEspecifica(id_reserva) {
        try {
            if (!id_reserva) return toast.error("Debe seleccionar una Reserva");
            const res = await fetch(`${API}/reservaPacientes/seleccionarEspecifica`, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json"}, mode: "cors", body: JSON.stringify({id_reserva})});
            if (!res.ok) return toast.error("El servidor no responde");
            const data = await res.json();
            let reserva = Array.isArray(data) ? data[0] : data;
            if (!reserva) return toast.error("Sin Data");
            setNombrePaciente(reserva.nombrePaciente ?? ""); setApellidoPaciente(reserva.apellidoPaciente ?? ""); setRut(reserva.rut ?? ""); setEmail(reserva.email ?? ""); setTelefono(reserva.telefono ?? "");
            setfechaInicio((reserva.fechaInicio ?? "").slice(0, 10)); setHoraInicio(reserva.horaInicio ?? ""); setfechaFinalizacion((reserva.fechaFinalizacion ?? "").slice(0, 10)); setHoraFinalizacion(reserva.horaFinalizacion ?? ""); setEstadoReserva(reserva.estadoReserva ?? ""); setId_profesional(normalizarIdProfesional(reserva.id_profesional));
        } catch (error) { console.log(error); return toast.error("El servidor no responde"); }
    }

    useEffect(() => { if (id_reserva) seleccionarReservaEspecifica(id_reserva); }, [id_reserva]);

    function limpiarData() { setNombrePaciente(""); setApellidoPaciente(""); setTelefono(""); setRut(""); setEmail(""); }

    async function cambiarEstadoRapido(estadoNuevo) {
        const nombreCompleto = `${nombrePaciente ?? ""} ${apellidoPaciente ?? ""}`.trim();
        if (!id_reserva || !nombreCompleto) return toast.error("Debe seleccionar un paciente para cambiar su estado");
        const actualizado = await actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoNuevo, id_profesional, id_reserva);
        if (actualizado) { setEstadoReserva(estadoNuevo); limpiarSeleccionTemporal(); }
    }

    function iniciarDragPopup(event) {
        if (!popupRef.current) return;
        const rect = popupRef.current.getBoundingClientRect();
        const point = "touches" in event ? event.touches[0] : event;
        if (!point) return;
        popupDragStateRef.current = {dragging: true, offsetX: point.clientX - rect.left, offsetY: point.clientY - rect.top};
        setDraggingPopup(true);
        document.body.style.userSelect = "none";
        document.body.style.touchAction = "none";
    }

    async function confirmarAgendamientoDesdePopup() {
        if (!selectionDraft) return;
        const created = await insertarNuevaReserva(popupForm.nombrePaciente, popupForm.apellidoPaciente, popupForm.rut, popupForm.telefono, popupForm.email, formatearFechaLocal(selectionDraft.start), selectionDraft.start.toTimeString().slice(0, 8), formatearFechaLocal(selectionDraft.end), selectionDraft.end.toTimeString().slice(0, 8), id_profesional);
        if (created) { setNombrePaciente(popupForm.nombrePaciente); setApellidoPaciente(popupForm.apellidoPaciente); setRut(popupForm.rut); setTelefono(popupForm.telefono); setEmail(popupForm.email); limpiarSeleccionTemporal(); }
    }

    async function confirmarActualizacionDesdePopup() {
        if (!selectionDraft?.id_reserva) return;
        const actualizado = await actualizarInformacionReserva(popupForm.nombrePaciente, popupForm.apellidoPaciente, popupForm.rut, popupForm.telefono, popupForm.email, formatearFechaLocal(selectionDraft.start), selectionDraft.start.toTimeString().slice(0, 8), formatearFechaLocal(selectionDraft.end), selectionDraft.end.toTimeString().slice(0, 8), selectionDraft.estadoReserva || estadoReserva || "reservada", id_profesional, selectionDraft.id_reserva);
        if (actualizado) { setNombrePaciente(popupForm.nombrePaciente); setApellidoPaciente(popupForm.apellidoPaciente); setRut(popupForm.rut); setTelefono(popupForm.telefono); setEmail(popupForm.email); setEstadoReserva(selectionDraft.estadoReserva || estadoReserva || "reservada"); setid_reserva(selectionDraft.id_reserva); limpiarSeleccionTemporal(); }
    }

    async function eliminadoReserva(id_reserva) {
        try {
            if (!id_reserva) return toast.error("Debe seleccionar al menos una reserva valida para realizar la eliminacion");
            const res = await fetch(`${API}/reservaPacientes/eliminarReserva`, {method: "POST", headers: {Accept: "application/json", "Content-Type": "application/json"}, body: JSON.stringify({id_reserva}), mode: "cors"});
            if (!res.ok) return toast.error("No hay conexion con el servidor por favor contacte a Soporte");
            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) {
                await refrescarCalendario(); limpiarSeleccionTemporal(); setid_reserva(0); setNombrePaciente(""); setApellidoPaciente(""); setRut(""); setTelefono(""); setEmail(""); setfechaInicio(""); setHoraInicio(""); setfechaFinalizacion(""); setHoraFinalizacion(""); setEstadoReserva("");
                return toast.success("Se ha eliminado con exito la reserva");
            } else if (respuestaBackend.message === false) { return toast.success("No se ha podido eliminar la reserva. Intente mas tarde."); }
            else return toast.error("No hay conexion con el servidor por favor contacte a Soporte");
        } catch (error) { console.log(error); return toast.error("No hay conexion con el servidor por favor contacte a Soporte"); }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            <ToasterClient/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-1">Planificación</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Módulo de Agenda</h1>
                        <p className="text-sm text-slate-500 mt-1">Gestiona reservas, revisa disponibilidad y actualiza datos en un solo lugar</p>
                    </div>
                    <InfoButton informacion={"En este apartado, usted puede ingresar pacientes de manera manual directamente en la agenda o sistema de citas. Además, es posible editar los datos de los pacientes ya registrados, permitiéndole mantener la información siempre actualizada y correcta.\n\nAsimismo, este módulo le permite bloquear períodos específicos de la agenda cuando no se encuentre disponible para atender.\nPara bloquear un período, solo debe seleccionar el rango horario que desea bloquear dentro del mismo día y luego presionar el botón \"Bloquear\". El sistema marcará automáticamente ese período como no disponible para nuevas citas.\n\nEsta funcionalidad le entrega un control total sobre la agenda, facilitando la organización de horarios, la gestión de pacientes y la administración de tiempos no disponibles."}/>
                </div>

                <div className="mb-8 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
                    <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(49,46,129,0.95)_100%)] px-4 py-3.5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                </span>
                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-100">Formulario de Agenda</h2>
                                    <p className="mt-0.5 text-xs text-slate-300">Datos del paciente, fechas y acciones en un solo bloque horizontal.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100">Agenda</span>
                                <button type="button" onClick={() => setMostrarFormularioAgenda((prev) => !prev)} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/15">
                                    {mostrarFormularioAgenda ? "Ocultar formulario" : "Mostrar formulario"}
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-200 ${mostrarFormularioAgenda ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.16),transparent_52%),linear-gradient(180deg,rgba(248,250,252,0.98),rgba(255,255,255,0.98))] px-4 py-4">
                        <div className="mx-auto w-full max-w-[400px]">
                            <label className="mb-3 block text-center text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Selecciona una Agenda</label>
                            <div className="relative rounded-[24px] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(245,243,255,0.96))] p-1.5 shadow-[0_18px_36px_rgba(79,70,229,0.09)] ring-1 ring-violet-100/80">
                                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-violet-600">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    </span>
                                </div>
                                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-4 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                <SelectDinamic value={id_profesional} onChange={(e) => setId_profesional(e.target.value)} options={listaProfesionales.map((profesional) => ({value: normalizarIdProfesional(profesional.id_profesional), label: profesional.nombreProfesional}))} placeholder="Selecciona una agenda" className="h-14 rounded-[20px] border-violet-200/90 bg-white pl-14 pr-11 text-[15px] font-bold tracking-[0.02em] text-slate-800 shadow-none transition-all duration-200 hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-200/40"/>
                            </div>
                        </div>
                    </div>

                    {mostrarFormularioAgenda && (
                        <div className="space-y-4 p-4 md:p-5">
                            <section className="rounded-[20px] border border-slate-200 bg-white p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div><h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">Formulario</h3><p className="mt-0.5 text-xs text-slate-500">Información principal del paciente y profesional.</p></div>
                                    <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700">{id_reserva ? "Editando" : "Nueva"}</span>
                                </div>
                                <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 px-3 py-2.5"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Paciente</p><p className="mt-1 truncate text-sm font-semibold text-slate-900">{`${nombrePaciente || "Sin"} ${apellidoPaciente || "asignar"}`}</p></div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Profesional</p><p className="mt-1 truncate text-sm font-semibold text-slate-900">{obtenerNombreProfesionalSeleccionado()}</p></div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Estado</p><p className="mt-1 text-sm font-semibold text-slate-900">{id_reserva ? "Editando reserva" : "Nueva reserva"}</p></div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    <div><label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label><ShadcnInput value={nombrePaciente ?? ""} onChange={(e) => setNombrePaciente(e.target.value)} className="h-11 rounded-xl border-slate-200 bg-white"/></div>
                                    <div><label className="mb-1 block text-sm font-medium text-slate-700">Apellido</label><ShadcnInput value={apellidoPaciente ?? ""} onChange={(e) => setApellidoPaciente(e.target.value)} className="h-11 rounded-xl border-slate-200 bg-white"/></div>
                                    <div><label className="mb-1 block text-sm font-medium text-slate-700">RUT</label><ShadcnInput value={rut} onChange={(e) => { const value = e.target.value.replace(/[^a-zA-Z0-9]/g, ""); setRut(value); }} placeholder="12345678K" className="h-11 w-full rounded-xl border-slate-200 bg-white"/></div>
                                    <div><label className="mb-1 block text-sm font-medium text-slate-700">Correo opcional</label><ShadcnInput value={email ?? ""} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl border-slate-200 bg-white"/></div>
                                    <div><label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label><ShadcnInput value={telefono ?? ""} onChange={(e) => setTelefono(e.target.value)} className="h-11 rounded-xl border-slate-200 bg-white"/></div>
                                </div>
                            </section>

                            <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50/70 p-3.5">
                                <div className="mb-2.5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                                    <div><h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-700">Acciones</h3><p className="mt-0.5 text-[11px] text-slate-500">Crear, editar, limpiar o eliminar la reserva activa.</p></div>
                                </div>
                                <div className="mb-3 flex flex-wrap gap-1.5">
                                    {accionesRapidasEstado.map((accion) => (
                                        <button key={accion.valor} type="button" onClick={() => cambiarEstadoRapido(accion.valor)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 hover:brightness-[0.97]" style={obtenerEstiloBotonEstado(accion.valor)}>{accion.etiqueta}</button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-[1.25fr_0.9fr_0.95fr_0.85fr_1.3fr]">
                                    <button onClick={ingresarPacienteDesdeAgenda} className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(14,165,233,0.18)] transition-all duration-150 hover:from-cyan-600 hover:to-sky-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v6m3-3h-6m-6 7a4 4 0 100-8 4 4 0 000 8zm0 0H6a2 2 0 01-2-2v-1a6 6 0 016-6h2" /></svg>Ingresar Paciente</button>
                                    <button onClick={() => insertarNuevaReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, id_profesional)} className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(14,165,233,0.18)] transition-all duration-150 hover:from-sky-700 hover:to-cyan-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>Agregar</button>
                                    <button onClick={() => actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_profesional, id_reserva)} className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.22)] transition-all duration-150 hover:from-violet-700 hover:to-indigo-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>Actualizar</button>
                                    <button onClick={() => limpiarData()} className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>Limpiar</button>
                                    <button onClick={() => eliminadoReserva(id_reserva)} className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition-all duration-150 hover:from-slate-900 hover:to-slate-800"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>Eliminar Reservacion</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Calendario de Reservas</h2>
                            {id_profesional && (<span className="text-xs text-violet-600 font-medium ml-2">— Agenda de: {listaProfesionales.find(p => normalizarIdProfesional(p.id_profesional) === normalizarIdProfesional(id_profesional))?.nombreProfesional ?? ""}</span>)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            {esMobile && (
                                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Día</span>
                                    <input type="date" value={formatearFechaLocal(currentDate)} onChange={(e) => manejarCambioFechaMobile(e.target.value)} className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-700 outline-none focus:border-violet-300"/>
                                </label>
                            )}
                            {leyendaEstados.map((estado) => { const paleta = obtenerPaletaEstadoReserva(estado.valor); return (<div key={estado.valor} className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded" style={{backgroundColor: paleta.accentColor}}></span><span className="text-xs text-slate-500">{estado.etiqueta}</span></div>); })}
                            <div className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded border border-slate-500/60 bg-slate-500/50"></span><span className="text-xs text-slate-500">Bloqueado</span></div>
                            <div className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded bg-violet-200 border border-violet-400"></span><span className="text-xs text-slate-500">Selección</span></div>
                            <span className="text-xs text-slate-400">Vista: <span className="font-medium text-slate-600 capitalize">{vistaActiva}</span></span>
                        </div>
                    </div>
                    <div className="relative p-4 md:p-6 h-[700px]">
                        {selectionPreview && (
                            <div className="pointer-events-none absolute right-6 top-6 z-20 rounded-2xl border border-violet-200 bg-white/95 px-4 py-3 text-xs shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur">
                                <div className="font-semibold text-violet-700">Seleccionando horario</div>
                                <div className="mt-1 text-slate-600">{formatFechaLarga(selectionPreview.start)}</div>
                                <div className="mt-1 font-medium text-slate-800">{formatHoraCorta(selectionPreview.start)} - {formatHoraCorta(selectionPreview.end)}</div>
                            </div>
                        )}
                        <DnDCalendar
                            localizer={localizer}
                            events={events}
                            backgroundEvents={floatingDraft ? [...backgroundCalendarEvents, floatingDraft] : backgroundCalendarEvents}
                            eventPropGetter={eventStyleGetter}
                            backgroundEventPropGetter={backgroundEventStyleGetter}
                            components={{event: WeekDayEventComponent, month: {event: MonthEventComponent}, week: {event: WeekDayEventComponent}, day: {event: WeekDayEventComponent}, agenda: {event: AgendaEventComponent}}}
                            startAccessor="start" endAccessor="end" messages={messages} culture="es"
                            date={currentDate} onNavigate={(nextDate) => setCurrentDate(nextDate)}
                            view={vistaActiva} onView={(nextView) => setCurrentView(esMobile ? "day" : nextView)}
                            defaultView={esMobile ? "day" : "week"} views={vistasDisponibles}
                            style={{height: "100%"}} selectable resizable popup
                            min={crearHoraLimite(HORA_MINIMA_AGENDA)} max={crearHoraLimite(HORA_MAXIMA_AGENDA)}
                            scrollToTime={crearHoraLimite(HORA_MINIMA_AGENDA)} step={15} timeslots={1}
                            draggableAccessor={(event) => event.tipo === "reserva"}
                            resizableAccessor={(event) => event.tipo === "reserva"}
                            longPressThreshold={esMobile ? 300 : 10}
                            onSelecting={(slot) => { const start = slot.start ?? slot; const end = slot.end ?? slot; setSelectionPreview({start, end}); if (!validarSeleccionPrevia(start, end)) return false; return true; }}
                            onSelectEvent={(event) => { limpiarSeleccionTemporal(); if (!event?.id_reserva) { toast.error("No se encontró el ID de la reserva"); return; } setid_reserva(event.id_reserva); seleccionarReservaEspecifica(event.id_reserva); abrirPopupReservaExistente(event); }}
                            onSelectSlot={(slotInfo) => { const start = slotInfo.start ?? slotInfo; const end = slotInfo.end ?? slotInfo; if (!validarSeleccionPrevia(start, end)) { limpiarSeleccionTemporal(); return; } abrirPopupSeleccion(slotInfo); setSelectionPreview(null); }}
                            onEventDrop={async ({event, start, end}) => { if (event.tipo === "bloqueo") { toast("Los bloqueos aun no soportan movimiento desde la grilla.", {icon: "🔒"}); return; } await actualizarReservaDesdeCalendario(event.resource, start, end); }}
                            onEventResize={async ({event, start, end}) => { if (event.tipo === "bloqueo") { toast("Los bloqueos aun no soportan redimensionamiento desde la grilla.", {icon: "🔒"}); return; } await actualizarReservaDesdeCalendario(event.resource, start, end); }}
                        />
                    </div>
                </div>

                <div className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            <div><h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Bloqueos del profesional</h2><p className="mt-0.5 text-xs text-slate-500">{obtenerNombreProfesionalSeleccionado()}</p></div>
                            {dataBloqueos.length > 0 && (<span className="ml-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{dataBloqueos.length}</span>)}
                        </div>
                        <button type="button" onClick={() => setMostrarListaBloqueos((prev) => !prev)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform ${mostrarListaBloqueos ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            {mostrarListaBloqueos ? "Ocultar bloqueos" : "Mostrar todos los bloqueos"}
                        </button>
                    </div>
                    {mostrarListaBloqueos && (
                        <div className="p-4 md:p-5">
                            {dataBloqueos.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-6">No hay bloqueos registrados para este profesional.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="border-b border-slate-200 text-left"><th className="pb-2 pr-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Motivo</th><th className="pb-2 pr-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Fecha inicio</th><th className="pb-2 pr-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Hora inicio</th><th className="pb-2 pr-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Fecha fin</th><th className="pb-2 pr-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Hora fin</th><th className="pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Acción</th></tr></thead>
                                        <tbody>
                                            {dataBloqueos.map((bloqueo) => (
                                                <tr key={bloqueo.id_bloqueo} className="border-b border-slate-100 last:border-b-0">
                                                    <td className="py-2.5 pr-4 font-medium text-slate-800">{bloqueo.motivo || "Sin motivo"}</td>
                                                    <td className="py-2.5 pr-4 text-slate-600">{(bloqueo.fechaInicio ?? "").slice(0, 10)}</td>
                                                    <td className="py-2.5 pr-4 text-slate-600">{bloqueo.horaInicio ?? "--"}</td>
                                                    <td className="py-2.5 pr-4 text-slate-600">{(bloqueo.fechaFinalizacion ?? "").slice(0, 10)}</td>
                                                    <td className="py-2.5 pr-4 text-slate-600">{bloqueo.horaFinalizacion ?? "--"}</td>
                                                    <td className="py-2.5"><button type="button" onClick={() => eliminarBloqueo(bloqueo.id_bloqueo)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>Eliminar</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {selectionDraft && (
                <div className="fixed inset-0 z-[80] bg-transparent" onMouseDown={(e) => e.preventDefault()}>
                    <div ref={popupRef} className="absolute w-[calc(100vw-32px)] max-w-[420px] rounded-[24px] border border-violet-200 bg-white/95 shadow-[0_28px_80px_rgba(76,29,149,0.18)] backdrop-blur-xl md:rounded-3xl" style={{left: popupPosition.x, top: popupPosition.y}} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                        <div className="flex cursor-move touch-none items-center justify-between rounded-t-[24px] border-b border-violet-100 bg-[linear-gradient(135deg,rgba(245,243,255,0.98),rgba(237,233,254,0.98))] px-3 py-2.5 md:rounded-t-3xl md:px-4 md:py-3" onMouseDown={iniciarDragPopup} onTouchStart={iniciarDragPopup}>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700">{popupMode === "edit" ? "Editar agendamiento" : "Nuevo agendamiento"}</p>
                                <p className="mt-1 text-xs font-semibold text-slate-800 md:text-sm">{popupMode === "edit" ? "Actualiza los datos de la reserva seleccionada" : "Confirma el rango seleccionado"}</p>
                            </div>
                            <button type="button" onClick={limpiarSeleccionTemporal} className="rounded-full border border-violet-100 bg-white px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 md:px-2.5 md:text-xs">Cerrar</button>
                        </div>
                        <div className="max-h-[62vh] space-y-3 overflow-y-auto px-3 py-3 text-xs text-slate-600 md:max-h-[58vh] md:px-4 md:py-4 md:text-sm">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Fecha</div>
                                    <div className="mt-1 truncate font-semibold capitalize text-slate-800">{formatFechaLarga(selectionDraft.start)}</div>
                                    <input type="date" value={formatearFechaLocal(selectionDraft.start)} onChange={(e) => actualizarFechaSeleccionDraft(e.target.value)} className="mt-2 h-9 w-full rounded-xl border border-violet-200 bg-white px-3 text-[12px] font-medium text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100"/>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Inicio</div>
                                    <div className="mt-1 font-semibold text-violet-700">{formatHoraCorta(selectionDraft.start)}</div>
                                    <input type="time" step="900" value={format(selectionDraft.start, "HH:mm")} onChange={(e) => actualizarHoraSeleccionDraft("start", e.target.value)} className="mt-2 h-9 w-full rounded-xl border border-violet-200 bg-white px-3 text-[12px] font-medium text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100"/>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Termino</div>
                                    <div className="mt-1 font-semibold text-violet-700">{formatHoraCorta(selectionDraft.end)}</div>
                                    <input type="time" step="900" value={format(selectionDraft.end, "HH:mm")} onChange={(e) => actualizarHoraSeleccionDraft("end", e.target.value)} className="mt-2 h-9 w-full rounded-xl border border-violet-200 bg-white px-3 text-[12px] font-medium text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100"/>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5"><div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Profesional</div><div className="mt-1 font-semibold text-slate-800">{selectionDraft.profesional}</div></div>
                            <div className="rounded-2xl border border-violet-100 bg-[linear-gradient(180deg,rgba(250,245,255,0.9),rgba(255,255,255,0.96))] px-3 py-3">
                                <div className="mb-3"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">Paciente</p><p className="mt-1 text-xs text-slate-500">{popupMode === "edit" ? "Modifica los datos del paciente o el horario de la reserva." : "Completa los datos para crear el agendamiento."}</p></div>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div className="space-y-1"><label className="text-[11px] text-slate-500">Nombre</label><input value={popupForm.nombrePaciente} onChange={(e) => setPopupForm((prev) => ({...prev, nombrePaciente: e.target.value}))} className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100" placeholder="Nombre"/></div>
                                    <div className="space-y-1"><label className="text-[11px] text-slate-500">Apellido</label><input value={popupForm.apellidoPaciente} onChange={(e) => setPopupForm((prev) => ({...prev, apellidoPaciente: e.target.value}))} className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100" placeholder="Apellido"/></div>
                                    <div className="space-y-1"><label className="text-[11px] text-slate-500">RUT</label><input value={popupForm.rut} onChange={(e) => setPopupForm((prev) => ({...prev, rut: e.target.value.replace(/[^a-zA-Z0-9]/g, "")}))} className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100" placeholder="12345678K"/></div>
                                    <div className="space-y-1"><label className="text-[11px] text-slate-500">Teléfono</label><input value={popupForm.telefono} onChange={(e) => setPopupForm((prev) => ({...prev, telefono: e.target.value}))} className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100" placeholder="+56..."/></div>
                                    <div className="space-y-1 sm:col-span-2"><label className="text-[11px] text-slate-500">Correo opcional</label><input type="email" value={popupForm.email} onChange={(e) => setPopupForm((prev) => ({...prev, email: e.target.value}))} className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-violet-300 focus:ring-4 focus:ring-violet-100" placeholder="No indicado"/></div>
                                </div>
                            </div>
                            {popupMode === "edit" && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                                    <div className="mb-3"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">Estado rápido</p><p className="mt-1 text-xs text-slate-500">Actualiza el estado de la reserva sin salir del popup.</p></div>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">{accionesRapidasEstado.map((accion) => (<button key={accion.valor} type="button" onClick={() => cambiarEstadoRapido(accion.valor)} className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 hover:brightness-[0.97]" style={obtenerEstiloBotonEstado(accion.valor)}>{accion.etiqueta}</button>))}</div>
                                </div>
                            )}
                            {popupMode === "create" && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                                    <div className="mb-3"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">Bloqueo rápido</p></div>
                                    <div className="space-y-1"><label className="text-[11px] text-slate-500">Motivo del bloqueo</label><input value={popupForm.motivoBloqueo} onChange={(e) => setPopupForm((prev) => ({...prev, motivoBloqueo: e.target.value}))} className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12px] text-slate-800 outline-none transition-all focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70" placeholder="Vacaciones, reunión, pausa, etc."/></div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 border-t border-slate-200 px-3 py-3 md:flex-row md:items-center md:justify-end md:px-4 md:py-4">
                            <button type="button" onClick={limpiarSeleccionTemporal} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 md:w-auto">Cancelar</button>
                            {popupMode === "create" && (<button type="button" onClick={() => insertarBloqueoHorario(id_profesional, formatearFechaLocal(selectionDraft.start), selectionDraft.start.toTimeString().slice(0, 8), formatearFechaLocal(selectionDraft.end), selectionDraft.end.toTimeString().slice(0, 8), popupForm.motivoBloqueo)} className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 md:w-auto">Bloquear horario</button>)}
                            {popupMode === "edit" && (<button type="button" onClick={() => eliminadoReserva(selectionDraft.id_reserva)} className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 md:w-auto">Eliminar reserva</button>)}
                            <button type="button" onClick={popupMode === "edit" ? confirmarActualizacionDesdePopup : confirmarAgendamientoDesdePopup} className="w-full rounded-xl bg-gradient-to-r from-violet-700 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(124,58,237,0.24)] transition-all hover:from-violet-600 hover:to-purple-500 md:w-auto">{popupMode === "edit" ? "Actualizar reserva" : "Agendar"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
