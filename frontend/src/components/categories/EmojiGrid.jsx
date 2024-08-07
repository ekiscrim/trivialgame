import { useEffect, useRef, useState } from "react";

const EmojiGrid = ({ simplifyDesign, categories }) => {
  const figureRef = useRef(null);
  const emojiSize = simplifyDesign ? "text-1xl" :"text-4xl"; // Tamaño de los emojis (ajusta según sea necesario)
  const toolTip = simplifyDesign ? "participant" : "";
  const margin = "3"; // Margen entre emojis
  let row = 3; // Inicializamos el contador de fila
  let column = 3; // Inicializamos el contador de columna



  useEffect(() => {
    const figure = figureRef.current;

    // Limpiar cualquier emoji existente dentro de la figura
    figure.innerHTML = "";

    categories.slice(0, 6).forEach((category, index) => {
      // Extraer el emoji de la categoría
      const emoji = category.match(/([\p{Emoji}])/gu)[0];

      // Crear el elemento span para el emoji y establecer sus clases de Tailwind
      const emojiSpan = document.createElement("div");
      emojiSpan.className = `${toolTip} ${emojiSize} ${margin} row-${row} col-${column}"`;
      emojiSpan.title = category; // Añadir el nombre de la categoría como título
      // Establecer el emoji como contenido del span
      emojiSpan.innerText = emoji;

      // Agregar el emoji al contenedor (figura)
      figure.appendChild(emojiSpan);

      // Incrementar el contador de columna
      column++;

      // Si la columna alcanza 4, reiniciamos la columna y avanzamos a la siguiente fila
      if (column > 6) {
        column = 1;
        row++;
      }
    });

  }, [categories, emojiSize, margin]);

  return (
    simplifyDesign ? (
      <div className="relative">
        <div ref={figureRef} className=" ml-5 mt-2 grid grid-cols-6 drop-shadow-[0_3px_5px_rgba(0,0,0,1)]">
          {/* Aquí se agregarán los emojis */}
        </div>
      </div>
    ) : (
      <div className="relative">
        <div ref={figureRef} className="ml-3 mt-5 grid grid-cols-3 gap-2 drop-shadow-[0_5px_5px_rgba(100,100,100,1)]">
          {/* Aquí se agregarán los emojis */}
        </div>
      </div>
    )
  );
};

export default EmojiGrid;
