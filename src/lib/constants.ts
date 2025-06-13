// import { User, Calendar, FileText, Activity } from "lucide-react";

export const elementTypes = [
  { name: 'brain', color: '#19334c', size: 40 },
  { name: 'heart', color: '#c77914', size: 35 },
  { name: 'scale', color: '#2a4b6c', size: 45 },
  { name: 'leaf', color: '#a56611', size: 30 },
  { name: 'star', color: '#c77914', size: 25 }
];

// Datos de ejemplo
export const patients = [
  { id: 1, name: 'María Rodríguez', lastVisit: 'Hace 2 días', status: 'Activo', nextAppointment: '15 Jun' },
  { id: 2, name: 'Carlos Pérez', lastVisit: 'Hace 1 semana', status: 'Inactivo', nextAppointment: '-' },
  { id: 3, name: 'Ana Martínez', lastVisit: 'Ayer', status: 'Activo', nextAppointment: '18 Jun' },
  { id: 4, name: 'Luis García', lastVisit: 'Hace 3 días', status: 'Activo', nextAppointment: '20 Jun' },
  { id: 5, name: 'Sofía López', lastVisit: 'Hace 2 semanas', status: 'Inactivo', nextAppointment: '-' },
];

export const appointments = [
  { id: 1, patient: 'María Rodríguez', time: '10:00 AM', type: 'Seguimiento' },
  { id: 2, patient: 'Ana Martínez', time: '11:30 AM', type: 'Evaluación' },
  { id: 3, patient: 'Luis García', time: '2:00 PM', type: 'Terapia' },
];

// export const stats = [
//   { title: 'Pacientes totales', value: '124', icon: <User size={20} />, change: '+12%' },
//   { title: 'Citas hoy', value: '8', icon: <Calendar size={20} />, change: '+2' },
//   { title: 'Historias completadas', value: '94', icon: <FileText size={20} />, change: '+15%' },
//   { title: 'Tiempo promedio', value: '45 min', icon: <Activity size={20} />, change: '-5 min' }
// ];