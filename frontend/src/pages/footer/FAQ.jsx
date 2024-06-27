const FAQ = () => {
  return (
    <div className="bg-gray-100 text-gray-800 p-8">
      <header>
        <meta name="description" content="Respuestas a las preguntas más frecuentes sobre VioQUIZ, la plataforma de trivia que te permite crear o unirte a salas y responder preguntas de todos los niveles." />
        <title>Preguntas Frecuentes - VioQUIZ</title>
      </header>
      <main className="container mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
          <p className="text-lg">
            Aquí encontrarás respuestas a las preguntas más comunes sobre <strong>VioQUIZ</strong>. Si no encuentras la respuesta que buscas, no dudes en <a href="/contact-us" className="underline">contactarnos</a>.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">¿Cómo puedo crear una sala de trivia en VioQUIZ?</h2>
          <p className="text-lg">
            Para crear tu propia sala de trivia en VioQUIZ, sigue estos pasos:
          </p>
          <ol className="list-decimal list-inside text-lg">
            <li>Accede a tu cuenta de VioQUIZ o regístrate si aún no tienes una.</li>
            <li>Navega hasta la sección de "Crear Sala" en tu panel de usuario.</li>
            <li>Personaliza los detalles de tu sala, como el nombre, las categorías de preguntas y el número de preguntas.</li>
            <li>¡Listo! Invita a tus amigos, familiares o colegas para que se unan a tu sala y comienza a jugar.</li>
          </ol>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">¿Cómo puedo unirme a una sala de trivia existente?</h2>
          <p className="text-lg">
            Para unirte a una sala de trivia existente en VioQUIZ, sigue estos sencillos pasos:
          </p>
          <ol className="list-decimal list-inside text-lg">
            <li>Inicia sesión en tu cuenta de VioQUIZ.</li>
            <li>Explora las salas disponibles en la sección de "Salas abiertas".</li>
            <li>Selecciona la sala que más te interese según las categorías.</li>
            <li>¡Únete a la diversión! Responde las preguntas y demuestra tu conocimiento.</li>
          </ol>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">¿Qué tipos de preguntas están disponibles en VioQUIZ?</h2>
          <p className="text-lg">
            En VioQUIZ ofrecemos una amplia variedad de preguntas de trivia que abarcan diferentes categorías y niveles de dificultad. Algunas de nuestras categorías populares incluyen:
          </p>
          <ul className="list-disc list-inside text-lg">
            <li>Ciencia y Naturaleza</li>
            <li>Historia</li>
            <li>Deportes y Pasatiempos</li>
            <li>Entretenimiento</li>
            <li>Arte y Literatura</li>
            <li>Geografía</li>
          </ul>
          <p className="text-lg">
            Nuestro objetivo es proporcionar desafíos intelectuales emocionantes para jugadores de todos los niveles.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">¿Cómo puedo contactar al equipo de soporte de VioQUIZ?</h2>
          <p className="text-lg">
            Si tienes alguna pregunta adicional o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte. Puedes utilizar nuestro formulario de contacto en <a href="/contact-us" className="underline">esta página</a>.
          </p>
        </section>
        <footer className="text-center text-sm mt-8">
          <p>
            Para más información, visita nuestra página de <a href="/about-us" className="underline">Sobre Nosotros</a> o síguenos en nuestras redes sociales para estar al día con las últimas novedades y eventos.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default FAQ;
