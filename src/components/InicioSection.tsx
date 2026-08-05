'use client';

import { motion } from 'framer-motion';

const InicioSection = () => {
  return (
    <section className="relative py-24 px-6 lg:px-8 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#bec5a4]/20 to-transparent" />

      <div className="relative container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center justify-center space-x-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300" />
            <span className="text-sm tracking-[0.3em] font-light text-gray-500 uppercase">
              Bienvenido(a) a SanaTú
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 leading-tight">
            Un espacio de orientación psicológica <br />
            <span className="text-[#bec5a4]">humano, cercano y respetuoso</span>
          </h2>

          <div className="space-y-6 text-lg lg:text-xl text-gray-600 font-light leading-relaxed">
            <p>
              Aquí encontrarás un lugar donde podrás expresar lo que estás viviendo, 
              resolver inquietudes relacionadas con tu bienestar emocional y adquirir 
              herramientas prácticas para afrontar los desafíos de la vida cotidiana.
            </p>
            <p>
              Mi propósito no es decirte cómo vivir tu vida, sino acompañarte para que 
              comprendas mejor tus emociones, fortalezcas tus recursos personales y tomes 
              decisiones con mayor claridad.
            </p>
            <p>
              Creo que todas las personas merecen ser escuchadas con respeto y sin prejuicios. 
              Por eso, cada orientación está basada en la empatía, la ética profesional y el 
              compromiso de ofrecerte un acompañamiento responsable.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InicioSection;
