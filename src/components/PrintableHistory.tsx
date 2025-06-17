import React from 'react';
import { PrintableHistoryProps } from '@/lib/type'; 

const PrintableHistory: React.FC<PrintableHistoryProps> = ({ record }) => {
  const formatDate = (date: Date | null | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

  return (
    <div className="print-container font-sans w-[210mm] min-h-[297mm] p-5 mx-auto box-border">
      {/* Página 1 */}
      <div className="mb-10">
        <h1 className="text-center text-2xl font-bold uppercase mb-4">
          HISTORIA CLÍNICA PSICOLÓGICA
        </h1>
        
        <div className="mb-2">
          <strong>Historia Clínica N°</strong> {record.recordNumber}
        </div>

        <h2 className="text-xl font-semibold mb-2 border-b border-black">
          INFORMACIÓN PERSONAL
        </h2>
        
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-1 w-1/3">Nombre paciente</td>
              <td className="py-1 border-b border-gray-400">{record.patientName}</td>
            </tr>
            <tr>
              <td className="py-1">Tipo de identificación</td>
              <td className="py-1 border-b border-gray-400">
                {record.identificationType} N° {record.identificationNumber}
              </td>
            </tr>
            <tr>
              <td className="py-1">Edad</td>
              <td className="py-1 border-b border-gray-400">{record.age}</td>
            </tr>
            <tr>
              <td className="py-1">Fecha de nacimiento</td>
              <td className="py-1 border-b border-gray-400">{formatDate(record.birthDate)}</td>
            </tr>
            <tr>
              <td className="py-1">Escolaridad</td>
              <td className="py-1 border-b border-gray-400">{record.educationLevel}</td>
            </tr>
            <tr>
              <td className="py-1">Ocupación</td>
              <td className="py-1 border-b border-gray-400">{record.occupation}</td>
            </tr>
            <tr>
              <td className="py-1">Lugar de nacimiento</td>
              <td className="py-1 border-b border-gray-400">{record.birthPlace}</td>
            </tr>
            <tr>
              <td className="py-1">Nacionalidad</td>
              <td className="py-1 border-b border-gray-400">{record.nationality}</td>
            </tr>
            <tr>
              <td className="py-1">Religión</td>
              <td className="py-1 border-b border-gray-400">{record.religion}</td>
            </tr>
            <tr>
              <td className="py-1">Dirección de Residencia</td>
              <td className="py-1 border-b border-gray-400">{record.address}</td>
            </tr>
            <tr>
              <td className="py-1">Barrio</td>
              <td className="py-1 border-b border-gray-400">{record.neighborhood}</td>
            </tr>
            <tr>
              <td className="py-1">Ciudad</td>
              <td className="py-1 border-b border-gray-400">{record.city}</td>
            </tr>
            <tr>
              <td className="py-1">Departamento</td>
              <td className="py-1 border-b border-gray-400">{record.state}</td>
            </tr>
            <tr>
              <td className="py-1">Fecha ingreso</td>
              <td className="py-1 border-b border-gray-400">{formatDate(record.admissionDate)}</td>
            </tr>
            <tr>
              <td className="py-1">Celular</td>
              <td className="py-1 border-b border-gray-400">{record.cellPhone}</td>
            </tr>
            <tr>
              <td className="py-1">Teléfono</td>
              <td className="py-1 border-b border-gray-400">{record.phone}</td>
            </tr>
            <tr>
              <td className="py-1">E-mail</td>
              <td className="py-1 border-b border-gray-400">{record.email}</td>
            </tr>
            <tr>
              <td className="py-1">EPS</td>
              <td className="py-1 border-b border-gray-400">{record.eps}</td>
            </tr>
            <tr>
              <td className="py-1">Cotizante</td>
              <td className="py-1 border-b border-gray-400">{record.isBeneficiary ? 'Sí' : 'No'}</td>
            </tr>
            <tr>
              <td className="py-1">Remitido por</td>
              <td className="py-1 border-b border-gray-400">{record.referredBy}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          RESPONSABLES
        </h2>
        
        <div className="flex justify-between">
          <div className="w-1/2 pr-4">
            <p><strong>Responsable:</strong> {record.guardian1Name}</p>
            <p><strong>Parentesco:</strong> {record.guardian1Relationship}</p>
            <p><strong>Celular:</strong> {record.guardian1Phone}</p>
            <p><strong>Ocupación:</strong> {record.guardian1Occupation}</p>
          </div>
          <div className="w-1/2 pl-4">
            <p><strong>Responsable:</strong> {record.guardian2Name}</p>
            <p><strong>Parentesco:</strong> {record.guardian2Relationship}</p>
            <p><strong>Celular:</strong> {record.guardian2Phone}</p>
            <p><strong>Ocupación:</strong> {record.guardian2Occupation}</p>
          </div>
        </div>

        <p className="mt-2">
          <strong>Atendido por:</strong> {record.attendedBy} - Tarjeta profesional N° {record.licenseNumber}
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          INFORMACIÓN MÉDICO-PSICOLÓGICA
        </h2>
        
        <h3 className="font-semibold mt-4">Antecedentes personales</h3>
        <p><strong>Patológicos:</strong> {record.personalPathological}</p>
        <p><strong>Quirúrgicos:</strong> {record.personalSurgical}</p>
        <p><strong>Psicopatológicos:</strong> {record.personalPsychopathological}</p>
        <p><strong>Historia de trauma o abuso:</strong> {record.traumaHistory}</p>
        <p><strong>Estado del Sueño:</strong> {record.sleepStatus}</p>
        <p><strong>Consumo de sustancias psicoactivas:</strong> {record.substanceUse}</p>
        <p><strong>Otros:</strong> {record.personalOther}</p>

        <h3 className="font-semibold mt-4">Antecedentes Familiares</h3>
        <p><strong>Patológicos:</strong> {record.familyPathological}</p>
        <p><strong>Quirúrgicos:</strong> {record.familySurgical}</p>
        <p><strong>Psicopatológicos:</strong> {record.familyPsychopathological}</p>
        <p><strong>Traumáticos:</strong> {record.familyTraumatic}</p>
        <p><strong>Consumo de sustancias psicoactivas:</strong> {record.familySubstanceUse}</p>
        <p><strong>Otros:</strong> {record.familyOther}</p>
        
        <h3 className="font-semibold mt-4">Embarazo</h3>
        <p>{record.pregnancyInfo}</p>
        
        <h3 className="font-semibold mt-4">Parto</h3>
        <p>{record.deliveryInfo}</p>
        
        <h3 className="font-semibold mt-4">Desarrollo psicomotor (sentarse, caminar, hablar, control de esfínteres)</h3>
        <p>{record.psychomotorDevelopment}</p>
        
        <h3 className="font-semibold mt-4">Descripción de la dinámica familiar</h3>
        <p>{record.familyDynamics}</p>
      </div>

      {/* Página 2 */}
      <div className="page-break">
        <h2 className="text-xl font-semibold mb-2 border-b border-black">
          Motivo de consulta
        </h2>
        <p>{record.consultationReason}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Historia del problema (duración, evolución, frecuencia)
        </h2>
        <p>{record.problemHistory}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Expectativas del paciente respecto a la terapia
        </h2>
        <p>{record.therapyExpectations}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Examen Mental
        </h2>
        <p>{record.mentalExam}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Evaluación psicológica (estado de ánimo, niveles de ansiedad y estrés, habilidades de afrontamiento,
          funcionamiento cognitivo, emocional, conductual y social)
        </h2>
        <p>{record.psychologicalAssessment}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          IDX O DX (DSM5-CIE 10)
        </h2>
        <p>{record.diagnosis}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Objetivos terapéuticos
        </h2>
        <p>{record.therapeuticGoals}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Plan Terapéutico
        </h2>
        <p>{record.treatmentPlan}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Derivación Y/O Remisión
        </h2>
        <p>{record.referralInfo}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Recomendaciones
        </h2>
        <p>{record.recommendations}</p>
      </div>

      {/* Página 3 */}
      <div>
        <h1 className="text-center text-2xl font-bold uppercase mb-4">
          EVOLUCIÓN
        </h1>
        <div className="mb-4">
          <strong>Historia N°</strong> {record.recordNumber}
        </div>
        <div className="min-h-[600px]">
          <p>{record.evolution}</p>
        </div>
        <div className="text-center mt-8 text-sm">
          322 8565 682 @mentalmentep MentalMente
        </div>
      </div>
    </div>
  );
};

export default PrintableHistory;