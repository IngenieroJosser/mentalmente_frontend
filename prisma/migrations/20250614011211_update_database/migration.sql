/*
  Warnings:

  - The primary key for the `MedicalRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `antecedentes_familiares_consumo` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `antecedentes_familiares_patologicos` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `antecedentes_familiares_traumaticos` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `antecedentes_patologicos` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `antecedentes_personales` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `antecedentes_psicopatologicos` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `antecedentes_quirurgicos` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `atendido_por` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `barrio` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `beneficiario` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `celular` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `ciudad` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `consumo_sustancias` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `cotizante` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `departamento` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `derivacion_o_remision` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `desarrollo_psicomotor` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `digitado_por` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `dinamica_familiar` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `direccion_residencia` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `e_mail` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `edad` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `embarazo` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `escolaridad` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `estado_del_sueno` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `evaluacion_psicologica` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `evolucion` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `evolucion_historia_no` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `evolucion_nombre` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `examen_mental` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `expectativa_terapia` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_ingreso` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_nacimiento` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `historia_de_trauma_o_abuso` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `historia_del_problema` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `idx_o_dx` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `lugar_nacimiento` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `motivo_consulta` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `nacionalidad` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_paciente` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `numero_historia_clinica` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `objetivos_terapeuticos` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `ocupacion` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `parto` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `plan_terapeutico` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `recomendaciones` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `remitido_por` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `responsable1_celular` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `responsable1_nombre` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `responsable1_ocupacion` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `responsable1_parentesco` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `responsable2_celular` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `responsable2_nombre` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `responsable2_ocupacion` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `responsable2_parentesco` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_identificacion` on the `MedicalRecord` table. All the data in the column will be lost.
  - The `id` column on the `MedicalRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `createdAt` column on the `MedicalRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[recordNumber]` on the table `MedicalRecord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identificationNumber` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificationType` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientName` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recordNumber` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `updatedAt` on the `MedicalRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_pkey",
DROP COLUMN "antecedentes_familiares_consumo",
DROP COLUMN "antecedentes_familiares_patologicos",
DROP COLUMN "antecedentes_familiares_traumaticos",
DROP COLUMN "antecedentes_patologicos",
DROP COLUMN "antecedentes_personales",
DROP COLUMN "antecedentes_psicopatologicos",
DROP COLUMN "antecedentes_quirurgicos",
DROP COLUMN "atendido_por",
DROP COLUMN "barrio",
DROP COLUMN "beneficiario",
DROP COLUMN "celular",
DROP COLUMN "ciudad",
DROP COLUMN "consumo_sustancias",
DROP COLUMN "cotizante",
DROP COLUMN "departamento",
DROP COLUMN "derivacion_o_remision",
DROP COLUMN "desarrollo_psicomotor",
DROP COLUMN "digitado_por",
DROP COLUMN "dinamica_familiar",
DROP COLUMN "direccion_residencia",
DROP COLUMN "e_mail",
DROP COLUMN "edad",
DROP COLUMN "embarazo",
DROP COLUMN "escolaridad",
DROP COLUMN "estado_del_sueno",
DROP COLUMN "evaluacion_psicologica",
DROP COLUMN "evolucion",
DROP COLUMN "evolucion_historia_no",
DROP COLUMN "evolucion_nombre",
DROP COLUMN "examen_mental",
DROP COLUMN "expectativa_terapia",
DROP COLUMN "fecha_ingreso",
DROP COLUMN "fecha_nacimiento",
DROP COLUMN "historia_de_trauma_o_abuso",
DROP COLUMN "historia_del_problema",
DROP COLUMN "idx_o_dx",
DROP COLUMN "lugar_nacimiento",
DROP COLUMN "motivo_consulta",
DROP COLUMN "nacionalidad",
DROP COLUMN "nombre_paciente",
DROP COLUMN "numero_historia_clinica",
DROP COLUMN "objetivos_terapeuticos",
DROP COLUMN "ocupacion",
DROP COLUMN "parto",
DROP COLUMN "plan_terapeutico",
DROP COLUMN "recomendaciones",
DROP COLUMN "remitido_por",
DROP COLUMN "responsable1_celular",
DROP COLUMN "responsable1_nombre",
DROP COLUMN "responsable1_ocupacion",
DROP COLUMN "responsable1_parentesco",
DROP COLUMN "responsable2_celular",
DROP COLUMN "responsable2_nombre",
DROP COLUMN "responsable2_ocupacion",
DROP COLUMN "responsable2_parentesco",
DROP COLUMN "telefono",
DROP COLUMN "tipo_identificacion",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "admissionDate" TIMESTAMP(3),
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "attendedBy" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "birthPlace" TEXT,
ADD COLUMN     "cellPhone" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "consultationReason" TEXT,
ADD COLUMN     "deliveryInfo" TEXT,
ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "educationLevel" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "evolution" TEXT,
ADD COLUMN     "familyDynamics" TEXT,
ADD COLUMN     "familyOther" TEXT,
ADD COLUMN     "familyPathological" TEXT,
ADD COLUMN     "familyPsychopathological" TEXT,
ADD COLUMN     "familySubstanceUse" TEXT,
ADD COLUMN     "familySurgical" TEXT,
ADD COLUMN     "familyTraumatic" TEXT,
ADD COLUMN     "guardian1Name" TEXT,
ADD COLUMN     "guardian1Occupation" TEXT,
ADD COLUMN     "guardian1Phone" TEXT,
ADD COLUMN     "guardian1Relationship" TEXT,
ADD COLUMN     "guardian2Name" TEXT,
ADD COLUMN     "guardian2Occupation" TEXT,
ADD COLUMN     "guardian2Phone" TEXT,
ADD COLUMN     "guardian2Relationship" TEXT,
ADD COLUMN     "identificationNumber" TEXT NOT NULL,
ADD COLUMN     "identificationType" TEXT NOT NULL,
ADD COLUMN     "isBeneficiary" BOOLEAN,
ADD COLUMN     "licenseNumber" TEXT,
ADD COLUMN     "mentalExam" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "patientName" TEXT NOT NULL,
ADD COLUMN     "personalOther" TEXT,
ADD COLUMN     "personalPathological" TEXT,
ADD COLUMN     "personalPsychopathological" TEXT,
ADD COLUMN     "personalSurgical" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "pregnancyInfo" TEXT,
ADD COLUMN     "problemHistory" TEXT,
ADD COLUMN     "psychologicalAssessment" TEXT,
ADD COLUMN     "psychomotorDevelopment" TEXT,
ADD COLUMN     "recommendations" TEXT,
ADD COLUMN     "recordNumber" TEXT NOT NULL,
ADD COLUMN     "referralInfo" TEXT,
ADD COLUMN     "referredBy" TEXT,
ADD COLUMN     "sleepStatus" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "substanceUse" TEXT,
ADD COLUMN     "therapeuticGoals" TEXT,
ADD COLUMN     "therapyExpectations" TEXT,
ADD COLUMN     "traumaHistory" TEXT,
ADD COLUMN     "treatmentPlan" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_recordNumber_key" ON "MedicalRecord"("recordNumber");

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
