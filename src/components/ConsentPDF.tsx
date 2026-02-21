import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#2c3e50',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bec5a4',
    paddingBottom: 10,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 9,
    color: '#7f8c8d',
  },
  value: {
    fontSize: 11,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
  },
});

interface Props {
  consent: any;
  baseUrl: string;
}

const ConsentPDF: React.FC<Props> = ({ consent }) => {
  const formatDate = (dateStr: string) =>
    format(new Date(dateStr), 'dd/MM/yyyy HH:mm');

  const cleanHtml = (html: string) => {
    if (!html) return '';

    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>SANATÚ SAS</Text>
          <Text>NIT 902010331-8</Text>
          <Text>Quibdó, Chocó</Text>
        </View>

        <Text style={styles.title}>Consentimiento Informado</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Paciente</Text>
          <Text style={styles.value}>
            {consent.medicalRecord?.patientName}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Identificación</Text>
          <Text style={styles.value}>
            {consent.medicalRecord?.identificationNumber}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Firmado por</Text>
          <Text style={styles.value}>{consent.signedByName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Documento</Text>
          <Text style={styles.value}>{consent.signedByDocument}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Fecha</Text>
          <Text style={styles.value}>
            {formatDate(consent.signedAt)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text>{cleanHtml(consent.documentSnapshot)}</Text>
        </View>

        {consent.signatureBase64 && (
          <View style={{ marginTop: 20 }}>
            <Image
              src={consent.signatureBase64}
              style={{ width: 150, height: 50 }}
            />
            <Text>Firma del paciente</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Liyiveth Quintero García</Text>
          <Text>Psicóloga - TP No. 229742</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ConsentPDF;