import { useEffect, useRef } from "react";

const EmojiGrid = ({ categories }) => {
  const figureRef = useRef(null);
  const emojiSize = "text-5xl"; // Tamaño de los emojis (ajusta según sea necesario)
  const margin = "m-1"; // Margen entre emojis
  let row = 1; // Inicializamos el contador de fila
  let column = 1; // Inicializamos el contador de columna

  useEffect(() => {
    const figure = figureRef.current;

    // Limpiar cualquier emoji existente dentro de la figura
    figure.innerHTML = "";

    categories.slice(0, 6).forEach((category, index) => {
      // Extraer el emoji de la categoría
      const emoji = category.match(/([\p{Emoji}])/gu)[0];

      // Crear el elemento span para el emoji y establecer sus clases de Tailwind
      const emojiSpan = document.createElement("div");
      emojiSpan.className = `${emojiSize} ${margin} row-${row} col-${column}"`;

      // Establecer el emoji como contenido del span
      emojiSpan.innerText = emoji;

      // Agregar el emoji al contenedor (figura)
      figure.appendChild(emojiSpan);

      // Incrementar el contador de columna
      column++;

      // Si la columna alcanza 4, reiniciamos la columna y avanzamos a la siguiente fila
      if (column > 3) {
        column = 1;
        row++;
      }
    });
  }, [categories]);

  return (
       
        <div ref={figureRef} className="grid grid-cols-3 gap-2 absolute left-3 top-8 drop-shadow-[0_5px_5px_rgba(100,100,100,1)]">
            {/* Aquí se agregarán los emojis */}
        </div>
       
  );
};

export default EmojiGrid;
