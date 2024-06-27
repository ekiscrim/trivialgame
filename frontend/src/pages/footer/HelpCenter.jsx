const HelpCenter = () => {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 bg-gray-100 text-gray-800 p-8">
        <h1 className="text-4xl font-bold mb-6">Centro de Ayuda de VioQUIZ</h1>
        <p className="text-lg mb-6">
          Bienvenido al Centro de Ayuda de VioQUIZ. Aquí encontrarás respuestas a preguntas frecuentes, tutoriales y recursos para ayudarte a aprovechar al máximo nuestra plataforma.
        </p>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Preguntas Frecuentes</h2>
          <div>
            <h3 className="text-xl font-medium mb-2">¿Cómo puedo crear una sala?</h3>
            <p className="mb-4">
              Para crear una sala, primero debes iniciar sesión en tu cuenta. Luego, dirígete a la sección "Crear Sala" y sigue las instrucciones para configurar tu sala con las categorías y número de preguntas que prefieras.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">¿Cómo me uno a una sala?</h3>
            <p className="mb-4">
              Para unirte a una sala, haz clic en el enlace de invitación proporcionado por el creador de la sala o busca la sala la sección "Salas abiertas".
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">¿Cómo cambio mi foto de perfil?</h3>
            <p className="mb-4">
              Para cambiar tu foto de perfil, accede a tu perfil, haz clic en tu foto de perfil y selecciona la opción para cambiarla.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">¿Cómo cambio mi nombre de usuario?</h3>
            <p className="mb-4">
              Para cambiar tu nombre de usuario, ve a tu perfil, selecciona la opción de editar perfil y cambia el nombre de usuario según sea necesario.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">¿Cómo cambio mi contraseña?</h3>
            <p className="mb-4">
              Para cambiar tu contraseña, inicia sesión en tu cuenta y busca la opción de cambiar contraseña en la sección de configuración de cuenta.
            </p>
          </div>
        </div>
  
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
          <p className="mb-4">
            Si no encuentras la respuesta a tu pregunta en el Centro de Ayuda, puedes ponerte en contacto con nuestro equipo de soporte desde la sección de <a href="/contact-us" className="text-blue-600">Contacto</a>.
          </p>
        </div>
      </div>
    );
  }
  
  export default HelpCenter;
  