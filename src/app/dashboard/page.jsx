"use client"
import {useState, useEffect} from "react";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ToasterClient from "@/Componentes/ToasterClient";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Calendar28} from "@/Componentes/shadcnCalendarSelector";
import {InfoButton} from "@/Componentes/InfoButton";
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import * as React from "react"
import {Select,SelectContent,SelectGroup,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"

const STORAGE_KEYS = {
    nombrePaciente: "dashboard_reservas_nombre_paciente",
    rut: "dashboard_reservas_rut",
    profesional: "dashboard_reservas_profesional",
    fechaInicio: "dashboard_reservas_fecha_inicio",
    fechaFinalizacion: "dashboard_reservas_fecha_finalizacion",
    estado: "dashboard_reservas_estado",
};
const SELECT_ALL_VALUE = "__todos__";

export default function AgendaCitas() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [dataLista, setdataLista] = useState([]);
    const [dataListaBase, setDataListaBase] = useState([]);
    const [nombrePaciente, setnombrePaciente] = useState("");
    const [rut, setrut] = useState("");
    const [fechaInicio, setfechaInicio] = useState(null);
    const [fechaFinalizacion, setfechaFinalizacion] = useState(null);
    const [estadoReserva, setestadoReserva] = useState("");
    const [listaProfesionales, setListaProfesionales] = useState([]);
    const [id_profesional, setId_profesional] = useState("");
    const [actualizandoReservaId, setActualizandoReservaId] = useState(null);
    const [abriendoFichaReservaId, setAbriendoFichaReservaId] = useState(null);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [menuEstadoAbiertoId, setMenuEstadoAbiertoId] = useState(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const profesionalGuardado = window.localStorage.getItem(STORAGE_KEYS.profesional);
        const nombrePacienteGuardado = window.localStorage.getItem(STORAGE_KEYS.nombrePaciente);
        const rutGuardado = window.localStorage.getItem(STORAGE_KEYS.rut);
        const fechaInicioGuardada = window.localStorage.getItem(STORAGE_KEYS.fechaInicio);
        const fechaFinalGuardada = window.localStorage.getItem(STORAGE_KEYS.fechaFinalizacion);
        const estadoGuardado = window.localStorage.getItem(STORAGE_KEYS.estado);
        if (nombrePacienteGuardado) setnombrePaciente(nombrePacienteGuardado);
        if (rutGuardado) setrut(rutGuardado);
        if (profesionalGuardado) setId_profesional(profesionalGuardado);
        if (fechaInicioGuardada) setfechaInicio(fechaInicioGuardada);
        if (fechaFinalGuardada) setfechaFinalizacion(fechaFinalGuardada);
        if (estadoGuardado) setestadoReserva(estadoGuardado);
    }, []);

    useEffect(() => { if (typeof window === "undefined") return; if (nombrePaciente.trim()) { window.localStorage.setItem(STORAGE_KEYS.nombrePaciente, nombrePaciente.trim()); } else { window.localStorage.removeItem(STORAGE_KEYS.nombrePaciente); } }, [nombrePaciente]);
    useEffect(() => { if (typeof window === "undefined") return; if (rut.trim()) { window.localStorage.setItem(STORAGE_KEYS.rut, rut.trim()); } else { window.localStorage.removeItem(STORAGE_KEYS.rut); } }, [rut]);
    useEffect(() => { if (typeof window === "undefined") return; if (id_profesional) { window.localStorage.setItem(STORAGE_KEYS.profesional, id_profesional); } else { window.localStorage.removeItem(STORAGE_KEYS.profesional); } }, [id_profesional]);
    useEffect(() => { if (typeof window === "undefined") return; if (fechaInicio) { window.localStorage.setItem(STORAGE_KEYS.fechaInicio, fechaInicio); } else { window.localStorage.removeItem(STORAGE_KEYS.fechaInicio); } }, [fechaInicio]);
    useEffect(() => { if (typeof window === "undefined") return; if (fechaFinalizacion) { window.localStorage.setItem(STORAGE_KEYS.fechaFinalizacion, fechaFinalizacion); } else { window.localStorage.removeItem(STORAGE_KEYS.fechaFinalizacion); } }, [fechaFinalizacion]);
    useEffect(() => { if (typeof window === "undefined") return; if (estadoReserva) { window.localStorage.setItem(STORAGE_KEYS.estado, estadoReserva); } else { window.localStorage.removeItem(STORAGE_KEYS.estado); } }, [estadoReserva]);

    function formatearFechaDashboard(fecha) {
        if (!fecha) return "";
        const date = new Date(fecha);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    function formatearHoraDashboard(hora) { if (!hora) return ""; return String(hora).slice(0, 5); }
    function obtenerNombreProfesionalReserva(reserva) {
        if (reserva?.nombreProfesional) return reserva.nombreProfesional;
        const profesional = listaProfesionales.find((item) => String(item.id_profesional) === String(reserva?.id_profesional));
        return profesional?.nombreProfesional ?? "Sin profesional";
    }
    function normalizarRut(rutValor) { return String(rutValor || "").replace(/[^0-9kK]/g, "").toUpperCase(); }
    function normalizarTextoBusqueda(valor) { return String(valor || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    function formatearRutBusqueda(rutValor) {
        const rutNormalizado = normalizarRut(rutValor);
        if (rutNormalizado.length < 2) return "";
        const dv = rutNormalizado.slice(-1);
        let cuerpo = rutNormalizado.slice(0, -1);
        let rutFormateado = "";
        while (cuerpo.length > 3) { rutFormateado = `.${cuerpo.slice(-3)}${rutFormateado}`; cuerpo = cuerpo.slice(0, -3); }
        rutFormateado = `${cuerpo}${rutFormateado}-${dv}`;
        return rutFormateado;
    }
    async function buscarPacientePorRut(rutPaciente) {
        const rutOriginal = String(rutPaciente || "").trim();
        const rutFormateado = formatearRutBusqueda(rutOriginal);
        const rutNormalizado = normalizarRut(rutOriginal);
        const variantes = [...new Set([rutOriginal, rutFormateado, rutNormalizado].filter(Boolean))];
        for (const rutBusqueda of variantes) {
            const resPaciente = await fetch(`${API}/pacientes/contieneRut`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({rut: rutBusqueda}), mode: "cors" });
            if (!resPaciente.ok) continue;
            const pacientes = await resPaciente.json();
            if (!Array.isArray(pacientes) || pacientes.length === 0) continue;
            const pacienteExacto = pacientes.find((paciente) => normalizarRut(paciente.rut) === rutNormalizado);
            if (pacienteExacto?.id_paciente) return pacienteExacto;
            if (pacientes[0]?.id_paciente) return pacientes[0];
        }
        return null;
    }
    async function crearPacienteDesdeReserva(reserva) {
        const rutNormalizado = normalizarRut(reserva?.rut);
        const telefonoNormalizado = String(reserva?.telefono || "").trim() || "NO INDICADO";
        const correoNormalizado = String(reserva?.email || "").trim() || null;
        if (!rutNormalizado) throw new Error("No se pudo normalizar el RUT del paciente");
        const resInsercion = await fetch(`${API}/pacientes/pacientesInsercion`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, mode: "cors", body: JSON.stringify({ nombre: reserva?.nombrePaciente || "NO INDICADO", apellido: reserva?.apellidoPaciente || "NO INDICADO", rut: rutNormalizado, nacimiento: "1900-01-01", sexo: "No especifica", prevision_id: 4, telefono: telefonoNormalizado, correo: correoNormalizado, direccion: "NO INDICADO", pais: "Chile", observacion1: "Paciente creado desde reservaciones", observacion2: "NO INDICADO", observacion3: "NO INDICADO", apoderado: "NO INDICADO", apoderado_rut: "NO INDICADO", medicamentosUsados: "NO INDICADO", habitos: "NO INDICADO", comentariosAdicionales: "Creado desde agenda con los datos disponibles de la reservacion" }) });
        if (!resInsercion.ok) throw new Error("No se pudo crear el paciente desde la reservacion");
        const respuestaBackend = await resInsercion.json();
        if (respuestaBackend.message !== true && respuestaBackend.message !== "duplicado") throw new Error("La creacion del paciente no fue aceptada por el servidor");
        const pacienteCreado = await buscarPacientePorRut(rutNormalizado);
        if (!pacienteCreado?.id_paciente) throw new Error("No se pudo recuperar el paciente recien creado");
        return pacienteCreado;
    }
    function coincideConRangoFechas(reserva) {
        if (!fechaInicio || !fechaFinalizacion) return true;
        const fechaReserva = String(reserva?.fechaInicio || "").slice(0, 10);
        if (!fechaReserva) return false;
        return fechaReserva >= fechaInicio && fechaReserva <= fechaFinalizacion;
    }
    function aplicarFiltrosCombinados(reservas = [], filtros = {}) {
        const nombreFiltro = normalizarTextoBusqueda(filtros.nombrePaciente ?? nombrePaciente);
        const rutFiltro = normalizarRut(filtros.rut ?? rut);
        const profesionalFiltro = filtros.id_profesional ?? id_profesional;
        const estadoFiltro = filtros.estadoReserva ?? estadoReserva;
        return reservas.filter((reserva) => {
            const nombreCompleto = normalizarTextoBusqueda(`${reserva?.nombrePaciente || ""} ${reserva?.apellidoPaciente || ""}`);
            const rutReserva = normalizarRut(reserva?.rut);
            const coincideNombre = !nombreFiltro || nombreCompleto.includes(nombreFiltro);
            const coincideRut = !rutFiltro || rutReserva.includes(rutFiltro);
            const coincideProfesional = !profesionalFiltro || String(reserva?.id_profesional) === String(profesionalFiltro);
            const coincideEstado = !estadoFiltro || normalizarEstadoReserva(reserva?.estadoReserva) === normalizarEstadoReserva(estadoFiltro);
            const coincideFecha = coincideConRangoFechas(reserva);
            return coincideNombre && coincideRut && coincideProfesional && coincideEstado && coincideFecha;
        });
    }
    function limpiarFiltrosPersistidos() { setnombrePaciente(""); setrut(""); setId_profesional(""); setestadoReserva(""); setfechaInicio(null); setfechaFinalizacion(null); }
    async function seleccionarTodosProfesionalesAgendaLista() {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, { method: 'GET', headers: {Accept: 'application/json'}, mode: 'cors' });
            if (!res.ok) return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
            const respustaBackend = await res.json();
            if (respustaBackend) setListaProfesionales(respustaBackend);
            else return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
        } catch (error) { return toast.error('Error al cargar los profesionales, por favor intente nuevamente.'); }
    }
    useEffect(() => { seleccionarTodosProfesionalesAgendaLista(); }, []);
    async function verFichaClinicaPaciente(reserva) {
        try {
            if (!reserva?.rut) return toast.error("No se ha podido identificar al paciente de esta reserva");
            setAbriendoFichaReservaId(reserva.id_reserva);
            const pacienteEncontrado = await buscarPacientePorRut(reserva.rut);
            if (pacienteEncontrado?.id_paciente) { router.push(`/dashboard/FichasPacientes/${pacienteEncontrado.id_paciente}`); return; }
            const confirmarCreacion = window.confirm("No existe una ficha para este paciente. ¿Desea crearla ahora con los datos disponibles de la reservación?");
            if (!confirmarCreacion) return;
            const nuevoPaciente = await crearPacienteDesdeReserva(reserva);
            toast.success("Paciente creado correctamente. Complete ahora la ficha clínica.");
            router.push(`/dashboard/NuevaFicha/${nuevoPaciente.id_paciente}`);
        } catch (error) { console.log(error); return toast.error("No se ha podido abrir o crear la ficha clinica de este paciente"); }
        finally { setAbriendoFichaReservaId(null); }
    }
    async function buscarEntreFechas(fechaInicio, fechaFinalizacion, opciones = {}) {
        const {silencioso = false} = opciones;
        try {
            if (!fechaInicio || !fechaFinalizacion) return toast.error("Debe seleccionar un rango de fechas para filtrar");
            const start = new Date(fechaInicio); const end = new Date(fechaFinalizacion);
            if (start > end) return toast.error("La fecha de inicio no puede ser posterior a la fecha de término.");
            const reservasFiltradas = aplicarFiltrosCombinados(dataListaBase);
            setdataLista(reservasFiltradas);
            if (!silencioso) { if (reservasFiltradas.length > 0) return toast.success(`Se encontraron ${reservasFiltradas.length} citas en el período seleccionado.`); return toast.success("No se encontraron citas en el período seleccionado."); }
            return true;
        } catch (error) { console.log(error); return toast.error("Error inesperado al buscar citas. Por favor, contacte a soporte técnico."); }
    }
    function buscarPorRut(rut) {
        try {
            const rutBusqueda = String(rut || "").trim();
            if (!rutBusqueda) return toast.error("Debe ingresar datos para filtrar.");
            const reservasFiltradas = aplicarFiltrosCombinados(dataListaBase, {rut: rutBusqueda});
            setdataLista(reservasFiltradas);
            if (reservasFiltradas.length > 0) return toast.success(`Se encontraron ${reservasFiltradas.length} reservas para el RUT ingresado.`);
            return toast.error("No se han encontrado similitudes");
        } catch (error) { console.log(error); return toast.error("No ha sido posible buscar, contacte a soporte Tecnico de Medify"); }
    }
    function buscarPorNombres(nombrePaciente) {
        try {
            const nombreBusqueda = String(nombrePaciente || "").trim();
            if (!nombreBusqueda) return toast.error("Debe ingresar datos para filtrar.");
            const reservasFiltradas = aplicarFiltrosCombinados(dataListaBase, {nombrePaciente: nombreBusqueda});
            setdataLista(reservasFiltradas);
            if (reservasFiltradas.length > 0) return toast.success(`Se encontraron ${reservasFiltradas.length} reservas para el nombre ingresado.`);
            return toast.error("No se han encontrado similitudes de nombres");
        } catch (error) { console.log(error); return toast.error("No ha sido posible buscar, contacte a soporte Tecnico de Medify"); }
    }
    async function listarTablaCitas() {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarReservados`, { method: "GET", headers: {Accept: "application/json"}, mode: "cors" });
            const respuestaBackend = await res.json();
            if (respuestaBackend) { setDataListaBase(respuestaBackend); setdataLista(respuestaBackend); }
        } catch (err) { console.log(err); return toast.error(err.message); }
    }
    useEffect(() => { listarTablaCitas(); }, []);
    useEffect(() => {
        if (!Array.isArray(dataListaBase) || dataListaBase.length === 0) { setdataLista(dataListaBase); return; }
        setdataLista(aplicarFiltrosCombinados(dataListaBase));
    }, [dataListaBase, nombrePaciente, rut, id_profesional, fechaInicio, fechaFinalizacion, estadoReserva]);
    function normalizarEstadoReserva(estado = "") { return String(estado).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    function obtenerPaletaEstadoReserva(estadoReserva = "") {
        const estadoNormalizado = normalizarEstadoReserva(estadoReserva);
        if (estadoNormalizado === "reservada" || estadoNormalizado === "reservado") return { backgroundColor: "rgba(180, 132, 108, 0.24)", color: "#6b4f3f", accentColor: "#8b5e3c", borderColor: "rgba(139, 94, 60, 0.30)" };
        if (estadoNormalizado === "asiste") return { backgroundColor: "rgba(34, 211, 238, 0.20)", color: "#0f766e", accentColor: "#0891b2", borderColor: "rgba(6, 182, 212, 0.30)" };
        if (estadoNormalizado === "no asiste" || estadoNormalizado === "no asistio" || estadoNormalizado === "no asistste") return { backgroundColor: "rgba(251, 146, 60, 0.18)", color: "#9a3412", accentColor: "#ea580c", borderColor: "rgba(249, 115, 22, 0.28)" };
        if (estadoNormalizado === "finalizado") return { backgroundColor: "rgba(37, 99, 235, 0.22)", color: "#1d4ed8", accentColor: "#1e40af", borderColor: "rgba(37, 99, 235, 0.32)" };
        if (estadoNormalizado === "confirmada" || estadoNormalizado === "confirmado") return { backgroundColor: "rgba(34, 197, 94, 0.22)", color: "#14532d", accentColor: "#166534", borderColor: "rgba(34, 197, 94, 0.30)" };
        if (estadoNormalizado === "anulada" || estadoNormalizado === "anulado") return { backgroundColor: "rgba(220, 38, 38, 0.20)", color: "#991b1b", accentColor: "#b91c1c", borderColor: "rgba(220, 38, 38, 0.30)" };
        return { backgroundColor: "rgba(124, 58, 237, 0.20)", color: "#5b21b6", accentColor: "#5b21b6", borderColor: "rgba(124, 58, 237, 0.28)" };
    }
    function obtenerEstiloBadgeEstado(estadoReserva = "") { const paleta = obtenerPaletaEstadoReserva(estadoReserva); return { backgroundColor: paleta.backgroundColor, color: paleta.color, border: `1px solid ${paleta.borderColor}` }; }
    function obtenerEstiloBotonEstado(estadoReserva = "") { const paleta = obtenerPaletaEstadoReserva(estadoReserva); return { backgroundColor: paleta.backgroundColor, color: paleta.color, border: `1px solid ${paleta.borderColor}`, borderLeft: `4px solid ${paleta.accentColor}`, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)" }; }
    const accionesRapidasEstado = [
        { valor: "reservada", etiqueta: "Reservada", icono: (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>) },
        { valor: "confirmada", etiqueta: "Confirmada", icono: (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>) },
        { valor: "anulada", etiqueta: "Anulada", icono: (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728"/></svg>) },
        { valor: "asiste", etiqueta: "Asiste", icono: (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-5-5m5 5l5-5"/></svg>) },
        { valor: "no asiste", etiqueta: "No Asiste", icono: (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>) },
        { valor: "finalizado", etiqueta: "Finalizado", icono: (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-1 9V21h9.28a2 2 0 001.97-1.66l1.38-9A2 2 0 0020.66 8H14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 11H4a2 2 0 00-2 2v6a2 2 0 002 2h3" /></svg>) },
    ];
    async function actualizarEstadoReservaRapido(id_reserva, nuevoEstado) {
        try {
            if (!id_reserva || !nuevoEstado) return toast.error("No se pudo identificar la reserva o el nuevo estado.");
            setActualizandoReservaId(id_reserva);
            const res = await fetch(`${API}/reservaPacientes/actualizarEstado`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({estadoReserva: nuevoEstado, id_reserva}), mode: "cors" });
            if (!res.ok) return toast.error("No se ha podido enviar la informacion para actualizar el estado.");
            const respuestaBackend = await res.json();
            if (respuestaBackend.message === true) {
                setDataListaBase((prev) => { const nuevaBase = prev.map((item) => (item.id_reserva === id_reserva ? {...item, estadoReserva: nuevoEstado} : item)); setdataLista(aplicarFiltrosCombinados(nuevaBase)); return nuevaBase; });
                setMenuEstadoAbiertoId(null);
                return toast.success("Se ha actualizado el estado con exito");
            }
            return toast.error("No se ha podido actualizar. Intente más tarde.");
        } catch (error) { console.log(error); return toast.error("No hay conexion con el servidor por favor contacte a Soporte"); }
        finally { setActualizandoReservaId(null); }
    }
    const resumenEstados = dataLista.reduce((acc, item) => {
        const estado = normalizarEstadoReserva(item?.estadoReserva);
        if (estado === "confirmada" || estado === "confirmado") acc.confirmadas += 1;
        if (estado === "anulada" || estado === "anulado") acc.anuladas += 1;
        if (estado === "asiste") acc.asiste += 1;
        if (estado === "finalizado") acc.finalizadas += 1;
        return acc;
    }, {confirmadas: 0, anuladas: 0, asiste: 0, finalizadas: 0});

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.28),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#ffffff_48%,#f8fafc_100%)]">
            <ToasterClient/>
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 md:py-10 2xl:max-w-none">
                <div className="mb-6 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                    <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(49,46,129,0.96)_58%,rgba(8,145,178,0.92)_100%)] px-5 py-5 sm:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200/90">Agenda</p>
                                <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Reservaciones</h1>
                            </div>
                            <InfoButton informacion={'En esta sección puede revisar todas las reservaciones registradas en la agenda clínica.\n\n¿Qué puede hacer aquí?\n- Buscar reservas por nombre o RUT del paciente.\n- Filtrar por rango de fechas.\n- Filtrar por profesional o por estado.\n- Cambiar rápidamente el estado de una reservación.\n- Abrir la carpeta clínica del paciente desde el botón "Ver".\n\n¿Cómo usar esta pantalla?\n1. Abra "Filtrar búsqueda" si necesita acotar resultados.\n2. Use uno o más filtros según lo que quiera encontrar.\n3. Revise la tabla de reservaciones y seleccione la acción que necesita.\n4. Use "Ver todo" para limpiar filtros y volver a cargar el listado general.'}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 px-5 py-3 sm:px-6 md:grid-cols-5">
                        <div className="rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Total visible</p><p className="mt-1 text-xl font-semibold text-slate-800">{dataLista.length}</p></div>
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/35 px-3.5 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600/80">Confirmadas</p><p className="mt-1 text-xl font-semibold text-emerald-900">{resumenEstados.confirmadas}</p></div>
                        <div className="rounded-xl border border-cyan-100 bg-cyan-50/35 px-3.5 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600/80">Asiste</p><p className="mt-1 text-xl font-semibold text-cyan-900">{resumenEstados.asiste}</p></div>
                        <div className="rounded-xl border border-rose-100 bg-rose-50/35 px-3.5 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-600/80">Anuladas</p><p className="mt-1 text-xl font-semibold text-rose-900">{resumenEstados.anuladas}</p></div>
                        <div className="rounded-xl border border-blue-100 bg-blue-50/35 px-3.5 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600/80">Finalizadas</p><p className="mt-1 text-xl font-semibold text-blue-900">{resumenEstados.finalizadas}</p></div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/94 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
                        <button type="button" onClick={() => setMostrarFiltros((prev) => !prev)} className="flex w-full items-center justify-between gap-3 border-b border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-4 text-left transition-colors duration-150 hover:bg-slate-50 sm:px-6">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></span>
                                <div><h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-800">Filtrar búsqueda</h2><p className="mt-0.5 text-xs text-slate-500">Paciente, RUT, rango de fechas, profesional y estado.</p></div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${mostrarFiltros ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                        </button>
                        {mostrarFiltros && (
                            <div className="p-4 md:p-5">
                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_1fr]">
                                    <div className="rounded-[22px] border border-slate-200 bg-slate-50/65 p-4">
                                        <div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold text-slate-800">Búsqueda directa</h3><p className="mt-0.5 text-[11px] text-slate-500">Encuentra reservas por nombre o RUT del paciente.</p></div><span className="hidden rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:inline-flex">Paciente</span></div>
                                        <div className="space-y-3">
                                            <div><label className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre del paciente</label><div className="flex flex-col gap-2 sm:flex-row"><ShadcnInput value={nombrePaciente} placeholder="Ej: Nicolas Andres..." onChange={(e) => setnombrePaciente(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") buscarPorNombres(nombrePaciente); }} className="w-full"/><button type="button" onClick={() => buscarPorNombres(nombrePaciente)} className="inline-flex min-w-[116px] flex-shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)] px-4 py-2 text-xs font-medium text-white shadow-sm transition-all duration-150 hover:brightness-110"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>Buscar</button></div></div>
                                            <div><label className="mb-1.5 block text-xs font-semibold text-slate-700">RUT del paciente</label><div className="flex flex-col gap-2 sm:flex-row"><ShadcnInput value={rut} placeholder="12.345.678-9" onChange={(e) => setrut(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") buscarPorRut(rut); }} className="w-full"/><button type="button" onClick={() => buscarPorRut(rut)} className="inline-flex min-w-[116px] flex-shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)] px-4 py-2 text-xs font-medium text-white shadow-sm transition-all duration-150 hover:brightness-110"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>Buscar</button></div></div>
                                        </div>
                                    </div>
                                    <div className="rounded-[22px] border border-slate-200 bg-[linear-gradient(180deg,#fafafa_0%,#f8fafc_100%)] p-4 md:p-5">
                                        <div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold text-slate-800">Rango de fechas</h3><p className="mt-0.5 text-[11px] text-slate-500">Acota el listado por período.</p></div><span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Fechas</span></div>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Calendar28 nombre={"Fecha de Inicio"} value={fechaInicio} onChange={(date) => setfechaInicio(date)}/><Calendar28 nombre={"Fecha de Término"} value={fechaFinalizacion} onChange={(date) => setfechaFinalizacion(date)}/></div>
                                        <button type="button" onClick={() => buscarEntreFechas(fechaInicio, fechaFinalizacion)} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#0369a1_0%,#0f766e_100%)] px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-all duration-150 hover:brightness-110 sm:w-auto"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>Filtrar por fechas</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/94 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                        <div className="flex flex-col gap-4 border-b border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></span>
                                    <div><h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-800">Reservaciones</h2><p className="mt-0.5 text-xs text-slate-500">Vista general con acciones rápidas y acceso a ficha clínica.</p></div>
                                    <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-slate-900 px-2 text-xs font-bold text-white">{dataLista.length}</span>
                                </div>
                            </div>
                            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto">
                                <Select value={id_profesional ? String(id_profesional) : SELECT_ALL_VALUE} onValueChange={(value) => setId_profesional(value === SELECT_ALL_VALUE ? "" : value)}>
                                    <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-xs text-slate-700 shadow-sm sm:w-[190px]"><SelectValue placeholder="Filtrar profesional"/></SelectTrigger>
                                    <SelectContent className="z-50 border border-slate-200 bg-white shadow-lg"><SelectGroup><SelectItem value={SELECT_ALL_VALUE}>Todos los profesionales</SelectItem>{listaProfesionales.map((profesional) => (<SelectItem key={profesional.id_profesional} value={String(profesional.id_profesional)}>{profesional.nombreProfesional}</SelectItem>))}</SelectGroup></SelectContent>
                                </Select>
                                <Select value={estadoReserva || SELECT_ALL_VALUE} onValueChange={(value) => setestadoReserva(value === SELECT_ALL_VALUE ? "" : value)}>
                                    <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-xs text-slate-700 shadow-sm sm:w-[190px]"><SelectValue placeholder="Filtrar por estado"/></SelectTrigger>
                                    <SelectContent className="z-50 border border-slate-200 bg-white shadow-lg"><SelectGroup><SelectItem value={SELECT_ALL_VALUE}>Todos los estados</SelectItem><SelectItem value="reservada">Reservada</SelectItem><SelectItem value="anulada">Anulada</SelectItem><SelectItem value="confirmada">Confirmada</SelectItem><SelectItem value="asiste">Asiste</SelectItem><SelectItem value="no asiste">No asiste</SelectItem><SelectItem value="finalizado">Finalizado</SelectItem></SelectGroup></SelectContent>
                                </Select>
                                <button type="button" onClick={() => { limpiarFiltrosPersistidos(); listarTablaCitas(); }} className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 sm:w-[190px]"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>Ver todo</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto pb-2">
                            <Table className="min-w-[1040px] table-fixed">
                                <TableCaption className="py-4 text-xs font-medium text-slate-400">Listado de reservaciones registradas</TableCaption>
                                <TableHeader>
                                    <TableRow className="border-b border-slate-200 bg-slate-950 hover:bg-slate-950">
                                        <TableHead className="w-[130px] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">Fecha</TableHead>
                                        <TableHead className="w-[100px] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">Hora</TableHead>
                                        <TableHead className="w-[230px] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">Paciente</TableHead>
                                        <TableHead className="w-[250px] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">Profesional</TableHead>
                                        <TableHead className="w-[140px] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">RUT</TableHead>
                                        <TableHead className="w-[150px] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">Estado</TableHead>
                                        <TableHead className="w-[140px] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">Acciones</TableHead>
                                        <TableHead className="w-[110px] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">Ficha</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dataLista.length === 0 && (<TableRow className="hover:bg-transparent"><TableCell colSpan={8} className="px-4 py-14 text-center"><div className="mx-auto flex max-w-md flex-col items-center"><span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></span><p className="mt-4 text-sm font-semibold text-slate-700">No hay reservaciones para mostrar</p><p className="mt-1 text-sm text-slate-500">Ajusta los filtros o usa "Ver todo" para recargar el listado completo.</p></div></TableCell></TableRow>)}
                                    {dataLista.map((data, i) => (
                                        <TableRow key={data.id_reserva} className={"transition-colors duration-100 hover:bg-sky-50/40 " + (i % 2 === 0 ? "bg-white" : "bg-slate-50/50")}>
                                            <TableCell className="whitespace-nowrap px-3 py-3 text-center"><span className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50/80 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span className="text-sm font-semibold text-sky-700">{formatearFechaDashboard(data.fechaInicio)}</span></span></TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-3 text-center"><span className="inline-flex items-center rounded-xl border border-cyan-200 bg-cyan-50/80 px-3 py-1.5 text-sm font-semibold text-cyan-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">{formatearHoraDashboard(data.horaInicio)}</span></TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium text-slate-800"><button type="button" onClick={() => setMenuEstadoAbiertoId((prev) => prev === data.id_reserva ? null : data.id_reserva)} className="inline-flex max-w-full items-center gap-2 rounded-xl border border-transparent px-3 py-1.5 transition-colors duration-150 hover:border-sky-200 hover:bg-sky-50/70"><span className="block max-w-[150px] truncate">{data.nombrePaciente + " " + data.apellidoPaciente}</span><svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 text-sky-600 transition-transform duration-200 ${menuEstadoAbiertoId === data.id_reserva ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg></button></TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-3 text-center text-sm font-medium text-slate-700"><span className="mx-auto block max-w-[210px] truncate">{obtenerNombreProfesionalReserva(data)}</span></TableCell>
                                            <TableCell className="whitespace-nowrap px-3 py-3 text-center font-mono text-sm text-slate-500">{data.rut}</TableCell>
                                            <TableCell className="px-3 py-3 text-center"><span className="inline-flex min-w-[118px] items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold" style={obtenerEstiloBadgeEstado(data.estadoReserva)}>{data.estadoReserva}</span></TableCell>
                                            <TableCell className="overflow-visible px-3 py-3 align-top">
                                                <div className="relative mx-auto flex w-fit items-center justify-center overflow-visible">
                                                    <button type="button" onClick={() => setMenuEstadoAbiertoId((prev) => prev === data.id_reserva ? null : data.id_reserva)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition-colors duration-150 hover:border-sky-200 hover:bg-sky-50"><span>Estado</span><svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-200 ${menuEstadoAbiertoId === data.id_reserva ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
                                                    {menuEstadoAbiertoId === data.id_reserva && (
                                                        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                                                            <div className="mb-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Selecciona estado</div>
                                                            <div className="flex flex-col gap-1">{accionesRapidasEstado.map((accion) => (<button key={accion.valor} type="button" disabled={actualizandoReservaId === data.id_reserva} onClick={() => actualizarEstadoReservaRapido(data.id_reserva, accion.valor)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium transition-all duration-150 hover:brightness-[0.98] disabled:cursor-not-allowed disabled:opacity-60" style={obtenerEstiloBotonEstado(accion.valor)}>{accion.icono}<span>{accion.etiqueta}</span></button>))}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-3 py-3 text-center"><button type="button" disabled={abriendoFichaReservaId === data.id_reserva} onClick={() => verFichaClinicaPaciente(data)} className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50/80 px-3 py-1.5 text-xs font-medium text-sky-700 transition-colors duration-150 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>Ficha</button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
