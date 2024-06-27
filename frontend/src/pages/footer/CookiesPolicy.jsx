const CookiesPolicy = () => {
  return (
    <div className="bg-gray-100 text-gray-800 p-8">
      <header>
        <meta name="description" content="Política de Cookies de VioQUIZ, donde se explica cómo utilizamos cookies como JWT y Cloudinary en nuestra plataforma de trivia en línea." />
        <title>Política de Cookies - VioQUIZ</title>
      </header>
      <main className="container mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Política de Cookies</h1>
          <p className="text-lg">
            Esta política de cookies explica qué son las cookies y cómo las utilizamos en VioQUIZ. Al acceder y utilizar nuestros servicios, aceptas el uso de cookies de acuerdo con esta política.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">¿Qué son las Cookies?</h2>
          <p className="text-lg">
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, teléfono móvil, o cualquier otro dispositivo con acceso a Internet) cuando visitas un sitio web. Las cookies se utilizan para recordar tus preferencias, mejorar la experiencia de usuario y proporcionar información analítica sobre cómo se utiliza el sitio.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Cookies que Utilizamos</h2>
          <p className="text-lg">
            En VioQUIZ utilizamos las siguientes cookies:
          </p>
          <ul className="list-disc list-inside text-lg">
            <li><strong>JWT Cookie:</strong> Esta cookie se utiliza para gestionar la autenticación de los usuarios en nuestra plataforma.</li>
            <li><strong>Cloudinary Cookies:</strong> Utilizamos cookies de Cloudinary para gestionar el almacenamiento y la entrega de contenido multimedia en nuestro sitio web.</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Finalidad de las Cookies</h2>
          <p className="text-lg">
            Cada tipo de cookie que utilizamos tiene una finalidad específica, que puede incluir:
          </p>
          <ul className="list-disc list-inside text-lg">
            <li>Facilitar la navegación y la experiencia de usuario en nuestro sitio.</li>
            <li>Recopilar información estadística sobre el uso del sitio para mejorar nuestros servicios.</li>
            <li>Personalizar contenido y anuncios basados en tus intereses y comportamiento de navegación.</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Gestión de Cookies</h2>
          <p className="text-lg">
            Puedes gestionar tus preferencias de cookies en cualquier momento modificando la configuración de tu navegador para aceptar, rechazar o eliminar cookies. Sin embargo, ten en cuenta que deshabilitar cookies puede afectar la funcionalidad y la experiencia de navegación en nuestro sitio web.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Consentimiento</h2>
          <p className="text-lg">
            Al acceder a VioQUIZ y aceptar nuestros términos de servicio, consientes el uso de cookies de acuerdo con esta política. Siempre puedes retirar tu consentimiento eliminando las cookies de tu navegador y ajustando la configuración de cookies como se indica anteriormente.
          </p>
        </section>
        <footer className="text-center text-sm mt-8">
          <p>
            Para más información, consulta nuestra <a href="/privacy-policy" className="underline">Política de Privacidad</a> o síguenos en nuestras redes sociales para estar al día con las últimas novedades y eventos.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default CookiesPolicy;
