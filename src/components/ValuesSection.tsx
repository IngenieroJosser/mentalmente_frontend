'use client';

import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, UserCheck, Heart, Target } from 'lucide-react';

const values = [
  {
    title: 'Empatía',
    icon: <HeartHandshake className="w-6 h-6" />,
    description: 'Escucho sin juzgar y procuro comprender cada situación desde el respeto.',
  },
  {
    title: 'Ética',
    icon: <ShieldCheck className="w-6 h-6" />,
    description: 'Actúo con responsabilidad, confidencialidad y compromiso profesional.',
  },
  {
    title: 'Respeto',
    icon: <UserCheck className="w-6 h-6" />,
    description: 'Reconozco la historia, las decisiones y el ritmo de cada persona.',
  },
  {
    title: 'Humanidad',
    icon: <Heart className="w-6 h-6" />,
    description: 'Creo que toda persona merece ser tratada con dignidad y sensibilidad.',
  },
  {
    title: 'Compromiso',
    icon: <Target className="w-6 h-6" />,
    description: 'Me esfuerzo por brindar una orientación útil, clara y basada en el conocimiento profesional.',
  },
];

const ValuesSection = () => {
  return (
    <section className="relative py-24 px-6 lg:px-8 bg-gray-50 overflow-hidden">
      <div className="relative container mx-auto max-w-6xl">
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
              Mis Valores
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
            Principios que orientan mi trabajo
          </h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            Mi trabajo se fundamenta en principios que orientan cada encuentro con las personas que depositan su confianza en mí.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {values.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="absolute -inset-2 rounded-2xl bg-[#bec5a4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-8 rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm
                            group-hover:border-[#bec5a4]/30 transition-all duration-500 h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6
                              bg-gradient-to-br from-[#bec5a4]/15 to-[#bec5a4]/5 border border-[#bec5a4]/20">
                  <div className="text-[#bec5a4]">{item.icon}</div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
