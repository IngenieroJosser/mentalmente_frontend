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
        
        <div className="mb-2 text-right">
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
            <div className="flex">
              <div className="w-1/3">Responsable:</div>
              <div className="w-2/3 border-b border-gray-400">{record.guardian1Name}</div>
            </div>
            <div className="flex">
              <div className="w-1/3">Parentesco:</div>
              <div className="w-2/3 border-b border-gray-400">{record.guardian1Relationship}</div>
            </div>
            <div className="flex">
              <div className="w-1/3">Celular:</div>
              <div className="w-2/3 border-b border-gray-400">{record.guardian1Phone}</div>
            </div>
            <div className="flex">
              <div className="w-1/3">Ocupación:</div>
              <div className="w-2/3 border-b border-gray-400">{record.guardian1Occupation}</div>
            </div>
          </div>
          <div className="w-1/2 pl-4">
            <div className="flex">
              <div className="w-1/3">Responsable:</div>
              <div className="w-2/3 border-b border-gray-400">{record.guardian2Name}</div>
            </div>
            <div className="flex">
              <div className="w-1/3">Parentesco:</div>
              <div className="w-2/3 border-b border-gray-400">{record.guardian2Relationship}</div>
            </div>
            <div className="flex">
              <div className="w-1/3">Celular:</div>
              <div className="w-2/3 border-b border-gray-400">{record.guardian2Phone}</div>
            </div>
            <div className="flex">
              <div className="w-1/3">Ocupación:</div>
              <div className="w-2/3 border-b border-gray-400">{record.guardian2Occupation}</div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex">
            <div className="w-1/3">Atendido por:</div>
            <div className="w-2/3 border-b border-gray-400">{record.attendedBy}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Tarjeta profesional N°</div>
            <div className="w-2/3 border-b border-gray-400">{record.licenseNumber}</div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          INFORMACIÓN MÉDICO-PSICOLÓGICA
        </h2>
        
        <h3 className="font-semibold mt-4">Antecedentes personales</h3>
        <div className="space-y-2">
          <div className="flex">
            <div className="w-1/3">Patológicos:</div>
            <div className="w-2/3 border-b border-gray-400">{record.personalPathological}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Quirúrgicos:</div>
            <div className="w-2/3 border-b border-gray-400">{record.personalSurgical}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Psicopatológicos:</div>
            <div className="w-2/3 border-b border-gray-400">{record.personalPsychopathological}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Historia de trauma o abuso:</div>
            <div className="w-2/3 border-b border-gray-400">{record.traumaHistory}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Estado del Sueño:</div>
            <div className="w-2/3 border-b border-gray-400">{record.sleepStatus}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Consumo de sustancias psicoactivas:</div>
            <div className="w-2/3 border-b border-gray-400">{record.substanceUse}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Otros:</div>
            <div className="w-2/3 border-b border-gray-400">{record.personalOther}</div>
          </div>
        </div>

        <h3 className="font-semibold mt-4">Antecedentes Familiares</h3>
        <div className="space-y-2">
          <div className="flex">
            <div className="w-1/3">Patológicos:</div>
            <div className="w-2/3 border-b border-gray-400">{record.familyPathological}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Quirúrgicos:</div>
            <div className="w-2/3 border-b border-gray-400">{record.familySurgical}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Psicopatológicos:</div>
            <div className="w-2/3 border-b border-gray-400">{record.familyPsychopathological}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Traumáticos:</div>
            <div className="w-2/3 border-b border-gray-400">{record.familyTraumatic}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Consumo de sustancias psicoactivas:</div>
            <div className="w-2/3 border-b border-gray-400">{record.familySubstanceUse}</div>
          </div>
          <div className="flex">
            <div className="w-1/3">Otros:</div>
            <div className="w-2/3 border-b border-gray-400">{record.familyOther}</div>
          </div>
        </div>
        
        <h3 className="font-semibold mt-4">Embarazo</h3>
        <div className="border-b border-gray-400">{record.pregnancyInfo}</div>
        
        <h3 className="font-semibold mt-4">Parto</h3>
        <div className="border-b border-gray-400">{record.deliveryInfo}</div>
        
        <h3 className="font-semibold mt-4">Desarrollo psicomotor (sentarse, caminar, hablar, control de esfínteres)</h3>
        <div className="border-b border-gray-400">{record.psychomotorDevelopment}</div>
        
        <h3 className="font-semibold mt-4">Descripción de la dinámica familiar</h3>
        <div className="border-b border-gray-400">{record.familyDynamics}</div>
      </div>

      {/* Página 2 */}
      <div className="page-break mb-10">
        <h2 className="text-xl font-semibold mb-2 border-b border-black">
          Motivo de consulta
        </h2>
        <div className="border-b border-gray-400 min-h-[1em]">{record.consultationReason}</div>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Historia del problema (duración, evolución, frecuencia)
        </h2>
        <div className="border-b border-gray-400 min-h-[1em]">{record.problemHistory}</div>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Expectativas del paciente respecto a la terapia
        </h2>
        <div className="border-b border-gray-400 min-h-[1em]">{record.therapyExpectations}</div>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Examen Mental
        </h2>
        <div className="border-b border-gray-400 min-h-[1em]">{record.mentalExam}</div>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Evaluación psicológica (estado de ánimo, niveles de ansiedad y estrés, habilidades de afrontamiento,
          funcionamiento cognitivo, emocional, conductual y social)
        </h2>
        <div className="border-b border-gray-400 min-h-[1em]">{record.psychologicalAssessment}</div>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          IDX O DX (DSM5-CIE 10)
        </h2>
        <div className="border-b border-gray-400 min-h-[1em]">{record.diagnosis}</div>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Objetivos terapéuticos
        </h2>
        <div className="border-b border-gray-400 min-h-[1em]">{record.therapeuticGoals}</div>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Plan Terapéutico
        </h2>
        <div className="border-b border-gray-400 min-h-[1em]">{record.treatmentPlan}</div>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Derivación Y/O Remisión
        </h2>
        <div className="border-b border-gray-400 min-h-[1em]">{record.referralInfo}</div>

        <h2 className="text-xl font-semibold mt-6 mb-2 border-b border-black">
          Recomendaciones
        </h2>
        <div className="border-b border-gray-400 min-h-[1em]">{record.recommendations}</div>
      </div>

      {/* Página 3 */}
      <div className="page-break">
        <h1 className="text-center text-2xl font-bold uppercase mb-4">
          EVOLUCIÓN
        </h1>
        <div className="mb-4">
          <strong>Historia N°</strong> {record.recordNumber}
        </div>
        <div className="min-h-[600px] border border-gray-300 p-4">
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