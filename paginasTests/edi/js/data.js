/* ============================================================
   DATOS EDITABLES — Adopta un Border Collie
   Cambia aquí el WhatsApp, los perros, historias y preguntas.
   ============================================================ */

/* Fotos de ejemplo de Wikimedia Commons (reemplazar por las fotos reales del cliente en el campo photo) */
function commons(f, w) { return "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(f) + "?width=" + (w || 800); }
window.BREED_PHOTO = commons("Border collie en position de travail.jpg", 1100);

window.SITE = {
  name: "Adopta un Border Collie",
  // Número en formato internacional, sin "+" ni espacios (Ecuador = 593, sin el 0 inicial)
  whatsapp: "593999999999",
  whatsappDisplay: "+593 99 999 9999",
  email: "hola@adoptaunbordercollie.ec",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  tiktok: "https://tiktok.com/",
  sectors: ["Quito norte (La Carolina, Iñaquito, Carcelén)", "Quito centro-sur", "Cumbayá", "Tumbaco", "Valle de Los Chillos", "Sangolquí", "Otro sector"]
};

/* coat: negro | merle | tricolor | chocolate  (define el color del marcador de foto)
   photo: ruta de la foto real, ej. "img/luna.jpg". Si está vacío se muestra un marcador.
   status: "Disponible" | "Reservado"; energy: 1 a 5; ageGroup: cachorro | joven | adulto */
window.DOGS = [
  { id: "luna", name: "Luna", sex: "Hembra", ageLabel: "3 meses", ageGroup: "cachorro", color: "Tricolor", coat: "tricolor", traits: ["Curiosa", "Cariñosa"], energy: 4, fee: 200, status: "Disponible", photo: commons("Border-Collie-tri-colour-face-1.jpg"),
    story: "Luna llegó con sus cuatro hermanos a los pocos días de nacer. Es la primera en acercarse a las visitas y ya aprendió a sentarse por una caricia. Busca una familia con tiempo para enseñarle y sacarla a caminar todos los días.",
    health: ["Primera y segunda vacuna al día", "Desparasitada", "Microchip colocado", "Revisión veterinaria completa"] },
  { id: "thor", name: "Thor", sex: "Macho", ageLabel: "2 años", ageGroup: "joven", color: "Negro y blanco", coat: "negro", traits: ["Atlético", "Juguetón"], energy: 5, fee: 120, status: "Disponible", photo: commons("Male Border Collie Standing.jpg"),
    story: "Thor ama la pelota más que cualquier cosa. Corre en La Carolina como si el parque fuera suyo y vuelve siempre a ti. Ideal para quien sale a trotar o a caminar por el cerro los fines de semana.",
    health: ["Vacunas completas", "Esterilizado", "Microchip colocado", "Revisión veterinaria completa"] },
  { id: "nieve", name: "Nieve", sex: "Hembra", ageLabel: "4 años", ageGroup: "adulto", color: "Blue merle", coat: "merle", traits: ["Tranquila", "Obediente"], energy: 3, fee: 90, status: "Disponible", photo: commons("Border collie blue merle.jpg"),
    story: "Nieve vivió en una finca en Tumbaco y ya conoce la correa, el carro y los niños. Es serena en casa y activa en el paseo. Una compañera ideal para una familia con hijos.",
    health: ["Vacunas completas", "Esterilizada", "Microchip colocado", "Revisión veterinaria completa"] },
  { id: "cacao", name: "Cacao", sex: "Macho", ageLabel: "5 meses", ageGroup: "cachorro", color: "Chocolate y blanco", coat: "chocolate", traits: ["Travieso", "Sociable"], energy: 4, fee: 180, status: "Reservado", photo: commons("Brown border collie on the beach.jpg"),
    story: "Cacao tiene ojos color miel y mucha energía. Ya tiene una familia en Cumbayá que lo conocerá este fin de semana. Escríbenos si quieres que te avisemos de la próxima camada.",
    health: ["Vacunas al día", "Desparasitado", "Microchip colocado", "Revisión veterinaria completa"] },
  { id: "bruno", name: "Bruno", sex: "Macho", ageLabel: "7 años", ageGroup: "adulto", color: "Negro y blanco", coat: "negro", traits: ["Sereno", "Leal"], energy: 2, fee: 60, status: "Disponible", photo: commons("Argentine border collie.jpg"),
    story: "Bruno acompañó a un adulto mayor durante años. Ahora busca un hogar calmado, con paseos suaves y mucha compañía. Es perfecto para un departamento si lo sacan dos veces al día.",
    health: ["Vacunas completas", "Esterilizado", "Microchip colocado", "Control de articulaciones al día"] },
  { id: "mora", name: "Mora", sex: "Hembra", ageLabel: "1 año", ageGroup: "joven", color: "Tricolor", coat: "tricolor", traits: ["Lista", "Enérgica"], energy: 5, fee: 130, status: "Disponible", photo: commons("Border collie open mouth.jpg"),
    story: "Mora aprende un truco nuevo en minutos y se aburre si no tiene qué hacer. Necesita una persona que disfrute entrenar, jugar y salir al aire libre. Con rutina y juegos de olfato es una compañera brillante.",
    health: ["Vacunas completas", "Esterilizada", "Microchip colocado", "Revisión veterinaria completa"] },
  { id: "ceniza", name: "Ceniza", sex: "Hembra", ageLabel: "2 meses", ageGroup: "cachorro", color: "Blue merle", coat: "merle", traits: ["Dulce", "Tímida"], energy: 3, fee: 200, status: "Disponible", photo: commons("Blue merle border collie.jpg"),
    story: "Ceniza es la más callada de la camada y se gana el corazón de a poco. Necesita una familia paciente que le dé confianza. Sus ojos claros son únicos, como el merle de su mamá.",
    health: ["Primera vacuna aplicada", "Desparasitada", "Microchip colocado", "Revisión veterinaria completa"] },
  { id: "simon", name: "Simón", sex: "Macho", ageLabel: "3 años", ageGroup: "joven", color: "Chocolate y blanco", coat: "chocolate", traits: ["Cariñoso", "Aventurero"], energy: 4, fee: 110, status: "Disponible", photo: commons("Brown Border Collie.jpg"),
    story: "Simón sube al Pasochoa sin cansarse y duerme a tus pies después. Se lleva bien con otros perros y con gente nueva. Busca una familia activa que lo incluya en sus planes.",
    health: ["Vacunas completas", "Esterilizado", "Microchip colocado", "Revisión veterinaria completa"] }
];

/* Historias de familias: agregar solo testimonios reales, con permiso de cada familia. */

window.FAQ = [
  { q: "¿Cuánto cuesta adoptar?", a: "La donación de adopción va de $60 a $200 según la edad del perro. Incluye vacunas al día, microchip y revisión veterinaria. Los cachorros tienen el valor más alto porque aún necesitan sus siguientes dosis." },
  { q: "¿Puedo adoptar si vivo en un departamento?", a: "Sí, siempre que puedas sacarlo a pasear y jugar todos los días. Un border collie en departamento necesita al menos dos horas de actividad. Te ayudamos a elegir un perro con energía acorde a tu espacio." },
  { q: "¿Entregan fuera de Quito?", a: "Entregamos en Cumbayá, Tumbaco, Los Chillos y Sangolquí sin costo adicional. Para otras ciudades coordinamos por WhatsApp; el transporte corre por cuenta del adoptante." },
  { q: "¿Cómo es el proceso?", a: "Eliges un perro, nos cuentas de ti, lo conoces en el Parque La Carolina o en tu casa, y si todo va bien lo llevas a casa con su contrato. Normalmente toma entre 3 y 7 días." },
  { q: "¿Qué pasa si no se adapta? (15 días)", a: "Tienes 15 días de adaptación. Si el perro y tu familia no logran entenderse, lo devuelves y buscamos juntos otra opción. Preferimos una devolución a tiempo antes que un perro infeliz." },
  { q: "¿Entregan recibo? ¿Cómo se paga?", a: "Sí, entregamos recibo por la donación. Puedes pagar por transferencia (Banco Pichincha o Produbanco) o en efectivo al momento de la entrega. Te enviamos los datos por WhatsApp una vez aprobada tu solicitud." }
];
