'use client';

import { motion } from 'framer-motion';
import { Ear, Brain, Lightbulb, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Escucho',
    icon: <Ear className="w-5 h-5" />,
    description: 'Primero conoceré tu situación y aquello que deseas abordar durante el encuentro.',
  },
  {
    number: '2',
    title: 'Comprendo',
    icon: <Brain className="w-5 h-5" />,
    description: 'Analizaremos juntos lo que está ocurriendo para identificar los aspectos más importantes.',
  },
  {
    number: '3',
    title: 'Oriento',
    icon: <Lightbulb className="w-5 h-5" />,
    description: 'Te brindaré información, herramientas y estrategias que puedan ayudarte a afrontar la situación.',
  },
  {
    number: '4',
    title: 'Continúas tu proceso',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Al finalizar tendrás mayor claridad sobre tu situación y, si es necesario, recibirás recomendaciones sobre los pasos a seguir.',
  },
];

const MethodologySection = () => {
  return (
    <section className="relative py-24 px-6 lg:px-8 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#bec5a4]/20 to-transparent" />

      <div className="relative container mx-auto max-w-5xl">
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
              Mi forma de trabajar
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
            ¿Cómo es una orientación psicológica?
          </h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Muchas personas sienten dudas antes de solicitar orientación. Por eso quiero contarte cómo trabajo. Cada orientación se desarrolla en cuatro momentos:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#bec5a4]/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#bec5a4] text-white font-medium shadow-md group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                <h4 className="text-lg font-medium text-gray-900">{step.title}</h4>
              </div>
              <p className="text-gray-600 font-light text-sm leading-relaxed pl-1">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
