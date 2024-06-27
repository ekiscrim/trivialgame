import React from 'react';

const ContactUs = () => {
  return (
    <div className="bg-gray-100 text-gray-800 p-8">
      <header>
        <meta name="description" content="Ponte en contacto con nosotros para cualquier consulta, soporte o colaboración. Descubre cómo puedes comunicarte con nuestro equipo." />
        <title>Contacto - VioQUIZ</title>
      </header>
      <main className="container mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Contacto</h1>
          <p className="text-lg">
            Bienvenido a la página de contacto de <strong>VioQUIZ</strong>. Estamos aquí para responder a tus preguntas, escuchar tus comentarios y ayudarte en lo que necesites. Utiliza los siguientes métodos para comunicarte con nosotros:
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Formulario de Contacto</h2>
          <p className="text-lg">
            Utiliza nuestro formulario de contacto para enviarnos un mensaje directamente. Completa los campos requeridos y nos pondremos en contacto contigo lo antes posible.
          </p>
          <form action="https://formspree.io/f/mjkbbdwj" className="mt-4" method="POST">
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-lg font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" id="nombre" name="name" className="border-gray-300 border rounded-lg px-4 py-2 w-full" required />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" id="email" name="email" className="border-gray-300 border rounded-lg px-4 py-2 w-full" required />
            </div>
            <div className="mb-4">
              <label htmlFor="mensaje" className="block text-lg font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea id="mensaje" name="message" rows="4" className="border-gray-300 border rounded-lg px-4 py-2 w-full" required></textarea>
            </div>
            <button type="submit" className="bg-purple-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg text-lg">Enviar Mensaje</button>
          </form>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Redes Sociales</h2>
          <p className="text-lg">
            Conéctate con nosotros en nuestras redes sociales para estar al tanto de las últimas noticias y actualizaciones:
          </p>
          <ul className="list-disc list-inside text-lg">
            <li><a href="https://www.facebook.com/people/VioQuiz/61561352139073/" className="underline" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://x.com/VioQUIZme" className="underline" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
          </ul>
        </section>
        <footer className="text-center text-sm mt-8">
          <p>
            Para más información, no dudes en contactarnos. Estamos aquí para ayudarte.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default ContactUs;
