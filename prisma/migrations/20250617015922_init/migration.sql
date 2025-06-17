-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" SERIAL NOT NULL,
    "recordNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "identificationType" TEXT NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "age" INTEGER,
    "educationLevel" TEXT,
    "occupation" TEXT,
    "birthPlace" TEXT,
    "nationality" TEXT,
    "religion" TEXT,
    "address" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "admissionDate" TIMESTAMP(3),
    "phone" TEXT,
    "cellPhone" TEXT,
    "email" TEXT,
    "eps" TEXT,
    "isBeneficiary" BOOLEAN,
    "referredBy" TEXT,
    "guardian1Name" TEXT,
    "guardian1Relationship" TEXT,
    "guardian1Phone" TEXT,
    "guardian1Occupation" TEXT,
    "guardian2Name" TEXT,
    "guardian2Relationship" TEXT,
    "guardian2Phone" TEXT,
    "guardian2Occupation" TEXT,
    "attendedBy" TEXT,
    "licenseNumber" TEXT,
    "personalPathological" TEXT,
    "personalSurgical" TEXT,
    "personalPsychopathological" TEXT,
    "traumaHistory" TEXT,
    "sleepStatus" TEXT,
    "substanceUse" TEXT,
    "personalOther" TEXT,
    "familyPathological" TEXT,
    "familySurgical" TEXT,
    "familyPsychopathological" TEXT,
    "familyTraumatic" TEXT,
    "familySubstanceUse" TEXT,
    "familyOther" TEXT,
    "pregnancyInfo" TEXT,
    "deliveryInfo" TEXT,
    "psychomotorDevelopment" TEXT,
    "familyDynamics" TEXT,
    "consultationReason" TEXT,
    "problemHistory" TEXT,
    "therapyExpectations" TEXT,
    "mentalExam" TEXT,
    "psychologicalAssessment" TEXT,
    "diagnosis" TEXT,
    "therapeuticGoals" TEXT,
    "treatmentPlan" TEXT,
    "referralInfo" TEXT,
    "recommendations" TEXT,
    "evolution" TEXT,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_correo_key" ON "User"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_recordNumber_key" ON "MedicalRecord"("recordNumber");

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
