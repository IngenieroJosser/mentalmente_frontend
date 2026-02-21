import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#2c3e50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#bec5a4',
    paddingBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Times-Roman',
    color: '#2c3e50',
    marginBottom: 4,
  },
  companyLine: {
    fontSize: 9,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    color: '#2c3e50',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  summary: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '30%',
    fontSize: 9,
    color: '#7f8c8d',
    textTransform: 'uppercase',
  },
  value: {
    width: '70%',
    fontSize: 10,
    color: '#2c3e50',
    fontWeight: 500,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
    color: '#2c3e50',
    borderBottomWidth: 1,
    borderBottomColor: '#bec5a4',
    paddingBottom: 4,
    marginBottom: 10,
  },
  documentContent: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#2c3e50',
    textAlign: 'justify',
  },
  signature: {
    marginTop: 30,
    alignItems: 'center',
  },
  signatureImage: {
    maxWidth: 200,
    maxHeight: 60,
    marginBottom: 10,
  },
  signatureLine: {
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9,
    color: '#7f8c8d',
    textAlign: 'center',
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
});

interface Props {
  consent: any;
  baseUrl: string;
}

const ConsentPDF: React.FC<Props> = ({ consent, baseUrl }) => {
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm');
  };

  // Limpiar HTML y convertirlo a texto plano con saltos de línea
  const cleanHtml = (html: string) => {
    let text = html.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<[^>]*>/g, '');
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&amp;/g, '&');
    return text;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado con logo */}
        <View style={styles.header}>
          <Image style={styles.logo} src={`${baseUrl}/logo-sana-tu.png`} cache={false} />
          <View style={styles.headerRight}>
            <Text style={styles.companyName}>SANATÚ SAS</Text>
            <Text style={styles.companyLine}>NIT 902010331-8</Text>
            <Text style={styles.companyLine}>Tel: 3113266223</Text>
            <Text style={styles.companyLine}>Quibdó, Chocó</Text>
          </View>
        </View>

        <Text style={styles.title}>Consentimiento Informado</Text>

        {/* Resumen del paciente */}
        <View style={styles.summary}>
          <View style={styles.row}>
            <Text style={styles.label}>Paciente:</Text>
            <Text style={styles.value}>{consent.medicalRecord.patientName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Identificación:</Text>
            <Text style={styles.value}>{consent.medicalRecord.identificationNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Firmado por:</Text>
            <Text style={styles.value}>{consent.signedByName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Documento:</Text>
            <Text style={styles.value}>{consent.signedByDocument}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{formatDate(consent.signedAt)}</Text>
          </View>
        </View>

        {/* Contenido del consentimiento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documento Firmado</Text>
          <Text style={styles.documentContent}>{cleanHtml(consent.documentSnapshot)}</Text>
        </View>

        {/* Firma del paciente */}
        {consent.signatureBase64 && (
          <View style={styles.signature}>
            <Image style={styles.signatureImage} src={consent.signatureBase64} cache={false} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Firma del paciente</Text>
          </View>
        )}

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text style={styles.footerName}>Liyiveth Quintero García</Text>
          <Text style={styles.footerText}>Psicóloga - TP No. 229742</Text>
          <Text style={styles.footerText}>SanaTú SAS</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ConsentPDF;