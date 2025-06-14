import {
  Clock,
  CheckCircle,
  Edit,
  Folder,
  BarChart2,
} from "lucide-react";

export const elementTypes = [
  { name: "brain", color: "#19334c", size: 40 },
  { name: "heart", color: "#c77914", size: 35 },
  { name: "scale", color: "#2a4b6c", size: 45 },
  { name: "leaf", color: "#a56611", size: 30 },
  { name: "star", color: "#c77914", size: 25 },
];

// Tipos de historias clínicas
export const clinicalHistoryTypes = [
  {
    id: "initial",
    name: "Evaluación Inicial",
    color: "bg-blue-100 text-blue-800",
  },
  { id: "follow", name: "Seguimiento", color: "bg-green-100 text-green-800" },
  { id: "therapy", name: "Terapia", color: "bg-purple-100 text-purple-800" },
  {
    id: "closure",
    name: "Cierre de Caso",
    color: "bg-amber-100 text-amber-800",
  },
];

// Estados de las historias
export const historyStatuses = [
  {
    id: "draft",
    name: "Borrador",
    icon: <Edit size={14} />,
    color: "bg-gray-100 text-gray-800",
  },
  {
    id: "in-progress",
    name: "En Progreso",
    icon: <Clock size={14} />,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "completed",
    name: "Completada",
    icon: <CheckCircle size={14} />,
    color: "bg-green-100 text-green-800",
  },
];

// Historias clínicas de ejemplo
export const clinicalHistories = [
  {
    id: 1,
    patient: "María Rodríguez",
    type: "Evaluación Inicial",
    status: "Completada",
    lastUpdate: "15 Jun 2023",
    therapist: "Dra. Laura Méndez",
    progress: 100,
    color: "bg-blue-100 text-blue-800",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    patient: "Carlos Pérez",
    type: "Seguimiento",
    status: "En Progreso",
    lastUpdate: "Hoy",
    therapist: "Dra. Laura Méndez",
    progress: 65,
    color: "bg-green-100 text-green-800",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 3,
    patient: "Ana Martínez",
    type: "Terapia",
    status: "Borrador",
    lastUpdate: "12 Jun 2023",
    therapist: "Dra. Laura Méndez",
    progress: 30,
    color: "bg-purple-100 text-purple-800",
    statusColor: "bg-gray-100 text-gray-800",
  },
  {
    id: 4,
    patient: "Luis García",
    type: "Evaluación Inicial",
    status: "Completada",
    lastUpdate: "10 Jun 2023",
    therapist: "Dr. Javier López",
    progress: 100,
    color: "bg-blue-100 text-blue-800",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 5,
    patient: "Sofía López",
    type: "Cierre de Caso",
    status: "En Progreso",
    lastUpdate: "Ayer",
    therapist: "Dra. Laura Méndez",
    progress: 85,
    color: "bg-amber-100 text-amber-800",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
];

// Plantillas de historias clínicas
export const templates = [
  { id: 1, name: "Evaluación Psicológica Inicial", category: "Evaluación" },
  { id: 2, name: "Seguimiento Terapéutico", category: "Seguimiento" },
  { id: 3, name: "Terapia Cognitivo-Conductual", category: "Terapia" },
  { id: 4, name: "Informe de Cierre de Caso", category: "Cierre" },
];

// Estadísticas de historias clínicas
export const stats = [
  {
    title: "Historias Totales",
    value: "142",
    change: "+12%",
    icon: <Folder size={20} />,
  },
  {
    title: "Completadas",
    value: "94",
    change: "+8%",
    icon: <CheckCircle size={20} />,
  },
  {
    title: "En Progreso",
    value: "28",
    change: "+5",
    icon: <Clock size={20} />,
  },
  {
    title: "Tiempo Promedio",
    value: "45 min",
    change: "-5 min",
    icon: <BarChart2 size={20} />,
  },
];

// Filtros
export const filters = [
  { id: "all", name: "Todas" },
  { id: "my", name: "Mis Historias" },
  { id: "initial", name: "Evaluaciones" },
  { id: "follow", name: "Seguimientos" },
  { id: "therapy", name: "Terapias" },
  { id: "closure", name: "Cierres" },
];
