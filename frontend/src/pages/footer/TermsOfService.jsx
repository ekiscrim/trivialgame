const TermsOfService = () => {
  return (
    <div className="bg-gray-100 text-gray-800 p-8">
      <header>
        <meta name="description" content="Términos de Servicio de VioQUIZ, donde se establecen las reglas y condiciones de uso de nuestra plataforma de trivia en línea." />
        <title>Términos de Servicio - VioQUIZ</title>
      </header>
      <main className="container mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Términos de Servicio</h1>
          <p className="text-lg">
            Estos términos de servicio regulan el uso de la plataforma VioQUIZ y los servicios relacionados. Al acceder y utilizar nuestros servicios, aceptas cumplir con estos términos y condiciones.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Uso de Nuestros Servicios</h2>
          <p className="text-lg">
            Al utilizar VioQUIZ, aceptas lo siguiente:
          </p>
          <ul className="list-disc list-inside text-lg">
            <li>Utilizar nuestros servicios solo para propósitos legales y de acuerdo con estos términos y condiciones.</li>
            <li>No interferir ni intentar interferir con la seguridad o el funcionamiento adecuado de nuestros servicios.</li>
            <li>No utilizar nuestros servicios de manera que pueda dañar, sobrecargar o afectar negativamente la disponibilidad o accesibilidad de nuestros servicios para otros usuarios.</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Cuentas de Usuario</h2>
          <p className="text-lg">
            Para acceder a ciertas funcionalidades de VioQUIZ, puedes necesitar crear una cuenta de usuario. Al crear una cuenta, aceptas:
          </p>
          <ul className="list-disc list-inside text-lg">
            <li>Proporcionar información precisa y actualizada.</li>
            <li>Mantener la seguridad de tu cuenta y no compartir tu contraseña con terceros.</li>
            <li>Notificarnos de inmediato sobre cualquier uso no autorizado de tu cuenta o cualquier otra violación de seguridad.</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Modificaciones de los Términos</h2>
          <p className="text-lg">
            Nos reservamos el derecho de modificar estos términos de servicio en cualquier momento. Las modificaciones entrarán en vigencia inmediatamente después de su publicación en esta página. Te recomendamos revisar periódicamente estos términos para estar informado sobre cualquier cambio.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Limitación de Responsabilidad</h2>
          <p className="text-lg">
            En la medida máxima permitida por la ley, VioQUIZ no será responsable por ningún daño directo, indirecto, incidental, especial, consecuente o ejemplar que surja del uso de nuestros servicios o la imposibilidad de usarlos.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Ley Aplicable</h2>
          <p className="text-lg">
            Estos términos de servicio se regirán e interpretarán de acuerdo con las leyes de España, excluyendo cualquier principio de conflicto de leyes que pueda llevar a la aplicación de otras jurisdicciones.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Contacto</h2>
          <p className="text-lg">
            Si tienes alguna pregunta sobre nuestros términos de servicio, por favor contáctanos a través de nuestro formulario de contacto en <a href="/contact-us" className="underline">esta página</a>.
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

export default TermsOfService;
