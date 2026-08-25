import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { MedicalRecordWithUser } from '@/lib/type';
import { format } from 'date-fns';

// Registrar fuentes (opcional, para dar un toque más formal)
Font.register({
  family: 'Times-Roman',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/times-new-roman/v7/times-new-roman.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/times-new-roman/v7/times-new-roman-bold.woff2', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#2c3e50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#bec5a4',
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  professionalName: {
    fontSize: 16,
    fontFamily: 'Times-Roman',
    color: '#2c3e50',
    marginBottom: 4,
  },
  professionalLine: {
    fontSize: 9,
    color: '#7f8c8d',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
    color: '#2c3e50',
    borderTopWidth: 1,
    borderTopColor: '#bec5a4',
    paddingTop: 4,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summary: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  summaryItem: {
    width: '22%',
  },
  summaryLabel: {
    fontSize: 8,
    color: '#95a5a6',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 10,
    color: '#2c3e50',
    fontWeight: 500,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#bec5a4',
    paddingBottom: 4,
    marginBottom: 10,
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 8,
    color: '#000000',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 10,
    color: '#2c3e50',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 4,
  },
  fieldValueMultiline: {
    fontSize: 10,
    color: '#2c3e50',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
    lineHeight: 1.5,
  },
  progressChart: {
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 15,
  },
  bar: {
    width: 20,
    backgroundColor: '#bec5a4',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 8,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 2,
    borderTopColor: '#bec5a4',
    paddingTop: 10,
  },
  footerName: {
    fontSize: 11,
    fontFamily: 'Times-Roman',
    color: '#2c3e50',
  },
  footerText: {
    fontSize: 9,
    color: '#7f8c8d',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 8,
    color: '#bdc3c7',
  },
});

interface Props {
  record: MedicalRecordWithUser;
  baseUrl: string;
}

const MedicalRecordPDF: React.FC<Props> = ({ record, baseUrl }) => {
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado con logo real */}
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={styles.logo} src={`${baseUrl}/logo-sana-tu.png`} />
          <View style={styles.headerRight}>
            <Text style={styles.professionalName}>Liyiveth Quintero García</Text>
            <View style={styles.professionalLine}>
              <Text>Psicóloga | T.P. No. 229742</Text>
            </View>
            <View style={styles.professionalLine}>
              <Text>Orientación psicológica</Text>
            </View>
            <Text style={styles.title}>Historia de Orientación Psicológica</Text>
          </View>
        </View>

        {/* Resumen del paciente */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Paciente</Text>
            <Text style={styles.summaryValue}>{record.patientName}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Identificación</Text>
            <Text style={styles.summaryValue}>{record.identificationNumber}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Historia Clínica</Text>
            <Text style={styles.summaryValue}>{record.recordNumber}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Fecha creación</Text>
            <Text style={styles.summaryValue}>{formatDate(record.createdAt)}</Text>
          </View>
        </View>

        {/* Datos Personales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos Personales</Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Tipo</Text>
                <Text style={styles.fieldValue}>{record.identificationType}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Número</Text>
                <Text style={styles.fieldValue}>{record.identificationNumber}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Fecha nacimiento</Text>
                <Text style={styles.fieldValue}>{formatDate(record.birthDate)}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Edad</Text>
                <Text style={styles.fieldValue}>{record.age} años</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Escolaridad</Text>
                <Text style={styles.fieldValue}>{record.educationLevel || '—'}</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Ocupación</Text>
                <Text style={styles.fieldValue}>{record.occupation || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nacionalidad</Text>
                <Text style={styles.fieldValue}>{record.nationality || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Religión</Text>
                <Text style={styles.fieldValue}>{record.religion || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Lugar nacimiento</Text>
                <Text style={styles.fieldValue}>{record.birthPlace || '—'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Dirección</Text>
              <Text style={styles.fieldValue}>{record.address || '—'}</Text>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Barrio</Text>
              <Text style={styles.fieldValue}>{record.neighborhood || '—'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Ciudad</Text>
              <Text style={styles.fieldValue}>{record.city || '—'}</Text>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Departamento</Text>
              <Text style={styles.fieldValue}>{record.state || '—'}</Text>
            </View>
          </View>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Teléfono</Text>
              <Text style={styles.fieldValue}>{record.phone || '—'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Celular</Text>
              <Text style={styles.fieldValue}>{record.cellPhone || '—'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Email</Text>
              <Text style={styles.fieldValue}>{record.email || '—'}</Text>
            </View>
          </View>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Fecha ingreso</Text>
              <Text style={styles.fieldValue}>{formatDate(record.admissionDate)}</Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>EPS</Text>
              <Text style={styles.fieldValue}>{record.eps || '—'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Beneficiario</Text>
              <Text style={styles.fieldValue}>{record.isBeneficiary ? 'Sí' : 'No'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Remitido por</Text>
              <Text style={styles.fieldValue}>{record.referredBy || '—'}</Text>
            </View>
          </View>
        </View>

        {/* Antecedentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Antecedentes</Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { fontSize: 10, marginBottom: 4 }]}>Personales</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Patológicos</Text>
                <Text style={styles.fieldValueMultiline}>{record.personalPathological || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Quirúrgicos</Text>
                <Text style={styles.fieldValueMultiline}>{record.personalSurgical || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Psicopatológicos</Text>
                <Text style={styles.fieldValueMultiline}>{record.personalPsychopathological || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Trauma/Abuso</Text>
                <Text style={styles.fieldValueMultiline}>{record.traumaHistory || '—'}</Text>
              </View>
            </View>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { fontSize: 10, marginBottom: 4 }]}>Familiares</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Patológicos</Text>
                <Text style={styles.fieldValueMultiline}>{record.familyPathological || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Psicopatológicos</Text>
                <Text style={styles.fieldValueMultiline}>{record.familyPsychopathological || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Traumáticos</Text>
                <Text style={styles.fieldValueMultiline}>{record.familyTraumatic || '—'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Sueño</Text>
              <Text style={styles.fieldValueMultiline}>{record.sleepStatus || '—'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Consumo de sustancias</Text>
              <Text style={styles.fieldValueMultiline}>{record.substanceUse || '—'}</Text>
            </View>
          </View>
        </View>

        {/* Orientación psicológica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orientación Psicológica</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Motivo de la orientación</Text>
            <Text style={styles.fieldValueMultiline}>{record.consultationReason || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Descripción de la situación actual</Text>
            <Text style={styles.fieldValueMultiline}>{record.problemHistory || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Antecedentes relevantes</Text>
            <Text style={styles.fieldValueMultiline}>{record.personalOther || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Fortalezas y recursos personales</Text>
            <Text style={styles.fieldValueMultiline}>{record.strengthsResources || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Trastorno mental identificado</Text>
            <Text style={styles.fieldValueMultiline}>{record.diagnosis || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Valoración profesional</Text>
            <Text style={styles.fieldValueMultiline}>{record.psychologicalAssessment || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Objetivo de la orientación</Text>
            <Text style={styles.fieldValueMultiline}>{record.therapeuticGoals || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Qué se busca lograr durante la sesión</Text>
            <Text style={styles.fieldValueMultiline}>{record.sessionGoal || '—'}</Text>
          </View>
        </View>

        {/* Seguimiento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguimiento y plan de acción</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Temas abordados</Text>
            <Text style={styles.fieldValueMultiline}>{record.topicsDiscussed || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Herramientas entregadas</Text>
            <Text style={styles.fieldValueMultiline}>{record.toolsProvided || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Plan de acción</Text>
            <Text style={styles.fieldValueMultiline}>{record.actionPlan || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Recomendaciones</Text>
            <Text style={styles.fieldValueMultiline}>{record.recommendations || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Remisión</Text>
            <Text style={styles.fieldValueMultiline}>{record.referralInfo || '—'}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Seguimiento</Text>
            <Text style={styles.fieldValueMultiline}>{record.followUp || '—'}</Text>
          </View>
        </View>

        {/* Profesional responsable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profesional responsable</Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { fontSize: 10, marginBottom: 4 }]}>Responsable 1</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nombre</Text>
                <Text style={styles.fieldValue}>{record.guardian1Name || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Parentesco</Text>
                <Text style={styles.fieldValue}>{record.guardian1Relationship || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Teléfono</Text>
                <Text style={styles.fieldValue}>{record.guardian1Phone || '—'}</Text>
              </View>
            </View>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { fontSize: 10, marginBottom: 4 }]}>Responsable 2</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nombre</Text>
                <Text style={styles.fieldValue}>{record.guardian2Name || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Parentesco</Text>
                <Text style={styles.fieldValue}>{record.guardian2Relationship || '—'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Teléfono</Text>
                <Text style={styles.fieldValue}>{record.guardian2Phone || '—'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Atendido por</Text>
              <Text style={styles.fieldValue}>{record.attendedBy || '—'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Número de tarjeta profesional</Text>
              <Text style={styles.fieldValue}>{record.licenseNumber || '—'}</Text>
            </View>
          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text style={styles.footerName}>Liyiveth Quintero García</Text>
          <Text style={styles.footerText}>Psicóloga | T.P. No. 229742</Text>
          <Text style={styles.footerText}>Orientación psicológica</Text>
          <Text style={styles.footerText}>Toda la información contenida en esta historia de orientación es confidencial, bajo la Ley 1090 de 2006 y la Resolución 1995 de 1999</Text>
        </View>

        {/* Número de página */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>
    </Document>
  );
};

export default MedicalRecordPDF;