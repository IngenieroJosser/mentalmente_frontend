'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: '¿Qué es la orientación psicológica?',
    answer: 'Es un espacio de acompañamiento profesional donde podrás expresar tus inquietudes, comprender mejor una situación específica y recibir herramientas prácticas para afrontarla.',
  },
  {
    question: '¿La orientación reemplaza la psicoterapia?',
    answer: 'No. La orientación psicológica tiene un alcance diferente. Si durante el encuentro identifico que tu situación requiere un proceso clínico especializado, te brindaré la orientación necesaria para acceder al profesional o servicio más adecuado.',
  },
  {
    question: '¿La atención es confidencial?',
    answer: 'Sí. La información compartida durante la orientación será tratada con respeto y confidencialidad, de acuerdo con los principios éticos que orientan el ejercicio profesional.',
  },
  {
    question: '¿La atención puede ser virtual?',
    answer: 'Sí. Puedes acceder a la orientación psicológica de manera virtual o domiciliaria, según la modalidad disponible.',
  },
  {
    question: '¿Cuánto dura una orientación?',
    answer: 'La duración aproximada es de 30 a 40 minutos, dependiendo de las necesidades de cada persona.',
  },
  {
    question: '¿Debo estar atravesando un problema grave para solicitar orientación?',
    answer: 'No. Muchas personas buscan orientación porque desean comprender mejor una situación, fortalecer habilidades personales, mejorar sus relaciones o recibir herramientas para afrontar diferentes momentos de la vida.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 px-6 lg:px-8 bg-gray-50 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#bec5a4]/20 to-transparent" />

      <div className="relative container mx-auto max-w-4xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center space-x-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300" />
            <span className="text-sm tracking-[0.3em] font-light text-gray-500 uppercase">
              Aclarando dudas
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-light text-gray-900">
            Preguntas Frecuentes
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`border rounded-xl transition-all duration-300 ${openIndex === index ? 'border-[#bec5a4]/50 bg-white shadow-sm' : 'border-gray-200 bg-white/50 hover:border-[#bec5a4]/30'}`}
            >
              <button
                onClick={() => toggleOpen(index)}
                className="flex items-center justify-between w-full p-6 text-left"
              >
                <span className="text-gray-900 font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'transform rotate-180 text-[#bec5a4]' : ''}`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 font-light leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
