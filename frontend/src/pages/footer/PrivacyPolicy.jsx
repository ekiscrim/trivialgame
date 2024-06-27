const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-100 text-gray-800 p-8">
      <header>
        <meta name="description" content="Política de privacidad de VioQUIZ, donde explicamos cómo recopilamos, utilizamos y protegemos la información personal de nuestros usuarios." />
        <title>Política de Privacidad - VioQUIZ</title>
      </header>
      <main className="container mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
          <p className="text-lg">
            En VioQUIZ, valoramos y respetamos tu privacidad. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos la información personal que nos proporcionas.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Información Recopilada</h2>
          <p className="text-lg">
            Recopilamos la siguiente información personal cuando te registras en VioQUIZ:
          </p>
          <ul className="list-disc list-inside text-lg">
            <li>Nombre de usuario</li>
            <li>Correo electrónico</li>
            <li>Contraseña cifrada</li>
          </ul>
          <p className="text-lg">
            Esta información es necesaria para crear y gestionar tu cuenta en nuestra plataforma.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Uso de la Información</h2>
          <p className="text-lg">
            Utilizamos la información personal recopilada para los siguientes propósitos:
          </p>
          <ul className="list-disc list-inside text-lg">
            <li>Crear y gestionar tu cuenta en VioQUIZ.</li>
            <li>Proporcionarte acceso a nuestros servicios y funcionalidades.</li>
            <li>Comunicarnos contigo sobre tu cuenta, actividades en la plataforma y actualizaciones.</li>
            <li>Mejorar nuestros servicios y personalizar tu experiencia en VioQUIZ.</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Protección de Datos</h2>
          <p className="text-lg">
            Nos comprometemos a proteger la seguridad de tu información personal. Utilizamos medidas de seguridad técnicas y organizativas para proteger tus datos contra el acceso no autorizado, uso indebido o divulgación.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Divulgación de Información</h2>
          <p className="text-lg">
            No vendemos, alquilamos ni compartimos tu información personal con terceros sin tu consentimiento, excepto en los siguientes casos:
          </p>
          <ul className="list-disc list-inside text-lg">
            <li>Cuando sea necesario para cumplir con la ley, regulaciones aplicables o solicitudes legales.</li>
            <li>Para proteger los derechos, la propiedad o la seguridad de VioQUIZ, nuestros usuarios u otros.</li>
            <li>En caso de fusión, adquisición o venta de activos, donde la información del usuario pueda transferirse como parte de esos activos.</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Tus Derechos</h2>
          <p className="text-lg">
            Tienes derecho a acceder, rectificar, eliminar o limitar el uso de tu información personal. Puedes gestionar tus preferencias de privacidad en la sección de configuración de tu cuenta o contactando a nuestro equipo de soporte.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Contacto</h2>
          <p className="text-lg">
            Si tienes preguntas sobre nuestra política de privacidad o el manejo de tu información personal, no dudes en contactarnos a través de nuestro formulario de contacto en <a href="/contact-us" className="underline">esta página</a>.
          </p>
        </section>
        <footer className="text-center text-sm mt-8">
          <p>
            Para más información, consulta nuestros <a href="/faq" className="underline">Preguntas Frecuentes</a> o síguenos en nuestras redes sociales para estar al día con las últimas novedades y eventos.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
