const Footer = () => {
  return (
    <footer className="bg-neutral py-10 text-neutral-content w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold">VioQUIZ</h4>
            <ul className="mt-4 space-y-2">
            <li><a href="/" className="hover:underline">Inicio</a></li>
              <li><a href="/about-us" className="hover:underline">Sobre nosotros</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold">Soporte</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="/help-center" className="hover:underline">Centro de Ayuda</a></li>
              <li><a href="/contact-us" className="hover:underline">Contacto</a></li>
              <li><a href="/FAQ" className="hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="/privacy-policy" className="hover:underline">Política de privacidad</a></li>
              <li><a href="/terms-of-service" className="hover:underline">Términos de Servicio</a></li>
              <li><a href="/cookies-policy" className="hover:underline">Política de Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold">Redes Sociales</h4>
            <div className="mt-4 space-x-4">
              <a href="https://www.facebook.com/people/VioQuiz/61561352139073/" target="_blank" className="text-neutral-content hover:text-neutral-focus">Facebook</a>
              <a href="https://x.com/VioQUIZme" target="_blank" className="text-neutral-content hover:text-neutral-focus">X (Twitter)</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} VioQUIZ
        </div>
      </div>
    </footer>
  );
};

export default Footer;
