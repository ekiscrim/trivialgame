const AboutUs = () => {
  return (
    <div className="bg-gray-100 text-gray-800 p-8">
      <header>
        <meta name="description" content="Conoce más sobre VioQUIZ, la plataforma de trivia que te permite crear o unirte a salas y responder preguntas de todos los niveles." />
        <title>Sobre Nosotros - VioQUIZ</title>
      </header>
      <main className="container mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Sobre Nosotros</h1>
          <p className="text-lg">
            Bienvenidos a <strong>VioQUIZ</strong>, donde te ofrecemos una experiencia única e interactiva que permite tanto a novatos como a expertos disfrutar de juegos de preguntas de todos los niveles. Nuestro objetivo es fomentar el aprendizaje y el entretenimiento a través de desafíos intelectuales en un ambiente dinámico y divertido.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Nuestra Misión</h2>
          <p className="text-lg">
            Nos apasiona proporcionar un espacio donde la curiosidad y el conocimiento se encuentran. Creemos que aprender puede ser tanto divertido como educativo, y nos dedicamos a crear una comunidad donde las personas puedan conectarse, competir y crecer juntas.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Características Principales</h2>
          <ul className="list-disc list-inside text-lg">
            <li><strong>Crea Tu Propia Sala:</strong> Personaliza y crea tu propia sala de trivia para jugar con amigos, familiares o compañeros de trabajo. Establece tus propias reglas y selecciona las categorías que más te interesan.</li>
            <li><strong>Únete a Salas Existentes:</strong> Participa en salas de trivia creadas por otros usuarios y demuestra tu conocimiento en diversas áreas temáticas.</li>
            <li><strong>Variedad de Niveles:</strong> Ofrecemos preguntas de diferentes niveles de dificultad, asegurando que siempre haya un desafío adecuado para todos.</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Nuestro Equipo</h2>
          <p className="text-lg">
            Estamos formados por un equipo apasionado de desarrolladores, diseñadores y expertos en contenido que trabajan incansablemente para ofrecer la mejor experiencia de trivia en línea. Nuestro compromiso con la excelencia se refleja en cada aspecto de nuestra plataforma, desde la interfaz intuitiva hasta las preguntas cuidadosamente seleccionadas.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Únete a Nosotros</h2>
          <p className="text-lg">
            Te invitamos a unirte a nuestra comunidad y descubrir la emoción del trivia. Ya sea que estés buscando aprender algo nuevo, desafiar a tus amigos o simplemente pasar un buen rato, <strong>VioQUIZ</strong> es el lugar perfecto para ti.
          </p>
        </section>
        <footer className="text-center text-sm mt-8">
          <p>
            Para más información, contáctanos en <a href="/contact-us" className="underline">VioQUIZ</a> o síguenos en nuestras redes sociales para estar al día con las últimas novedades y eventos.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AboutUs;
