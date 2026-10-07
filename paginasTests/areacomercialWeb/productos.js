// =============================================================
// CATÁLOGO WEB — conecta Firestore (nombre_publico, descripcion,
// imagen_url) con Realtime Database (precio, stock, tipo_producto)
// usando el mismo código de producto como llave en ambas bases.
// =============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// -------------------------------------------------------------
// 1. CONFIGURACIÓN DE FIREBASE
// Pégala tal cual la encuentras en:
// Firebase Console → ⚙️ Configuración del proyecto → General →
// "Tus apps" → app Web → "Config" (Firebase SDK snippet).
// Esta clave NO es secreta: lo que protege tus datos son las
// Security Rules, no ocultar este objeto.
// -------------------------------------------------------------

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8flFyjCWB85iYHu_qkFJRuqX-2xZZEBQ",
  authDomain: "areacomercialwebdb.firebaseapp.com",
  databaseURL: "https://areacomercialwebdb-default-rtdb.firebaseio.com",
  projectId: "areacomercialwebdb",
  storageBucket: "areacomercialwebdb.firebasestorage.app",
  messagingSenderId: "590800569892",
  appId: "1:590800569892:web:662f7766d3f9fa2cb33ab1"
};

// Nombres de colección/nodo — ajústalos aquí si en tu proyecto se llaman distinto.
const FIRESTORE_COLLECTION = "productos_web";
const RTDB_ROOT_NODE = "productos";

const CONFIG_ES_VALIDA = !Object.values(firebaseConfig).some((valor) =>
  String(valor).startsWith("PEGA_AQUI")
);

// -------------------------------------------------------------
// 2. ELEMENTOS DEL DOM
// -------------------------------------------------------------
const grid = document.getElementById("catalogGrid");
const status = document.getElementById("catalogStatus");
const searchInput = document.getElementById("catalogSearch");
const chipsContainer = document.getElementById("catalogChips");

let catalogoCompleto = []; // productos ya fusionados (Firestore + RTDB)
let categoriaActiva = "__todas";
let terminoBusqueda = "";

// -------------------------------------------------------------
// 3. ARRANQUE
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (!CONFIG_ES_VALIDA) {
    mostrarEstado(
      "⚠️ Falta configurar Firebase. Abre productos.js y pega tu firebaseConfig " +
        "(Firebase Console → Configuración del proyecto → Tus apps → Web)."
    );
    return;
  }
  iniciarCatalogo();
});

async function iniciarCatalogo() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const rtdb = getDatabase(app);

    mostrarEstado("Cargando catálogo...");

    // 1) Traemos de Firestore solo los productos marcados para la web
    const productosWebSnap = await getDocs(
      query(
        collection(db, FIRESTORE_COLLECTION),
        where("registradoParaWeb", "==", true)
      )
    );

    if (productosWebSnap.empty) {
      mostrarEstado(
        "Todavía no hay productos publicados. Publica alguno desde la app " +
          "móvil (marca registradoParaWeb = true) y recarga esta página."
      );
      return;
    }

    // 2) Por cada producto, cruzamos el mismo código contra la RTDB
    const productos = await Promise.all(
      productosWebSnap.docs.map(async (docSnap) => {
        const codigo = docSnap.id;
        const datosWeb = docSnap.data();

        let datosErp = {};
        try {
          const erpSnap = await get(ref(rtdb, `${RTDB_ROOT_NODE}/${codigo}`));
          datosErp = erpSnap.exists() ? erpSnap.val() : {};
        } catch (errRtdb) {
          console.warn(`No se pudo leer RTDB para ${codigo}:`, errRtdb);
        }

        return {
          codigo,
          nombre: datosWeb.nombre_publico || "Producto sin nombre",
          descripcion: datosWeb.descripcion || "",
          imagenUrl: datosWeb.imagen_url || "",
          precio: typeof datosErp.precio === "number" ? datosErp.precio : null,
          stock: typeof datosErp.stock === "number" ? datosErp.stock : null,
          categoria: datosErp.tipo_producto || "Sin categoría",
        };
      })
    );

    catalogoCompleto = productos;
    construirChipsDeCategoria(productos);
    ocultarEstado();
    renderizarGrid();

    // 3) Filtros interactivos
    searchInput.addEventListener("input", (e) => {
      terminoBusqueda = e.target.value.trim().toLowerCase();
      renderizarGrid();
    });
  } catch (error) {
    console.error("Error cargando el catálogo:", error);
    if (String(error).includes("permission")) {
      mostrarEstado(
        "⚠️ Firebase rechazó la lectura por permisos. Revisa las Security Rules " +
          "de Firestore y RTDB para permitir lectura pública de productos publicados."
      );
    } else {
      mostrarEstado("⚠️ No se pudo cargar el catálogo: " + error.message);
    }
  }
}

// -------------------------------------------------------------
// 4. FILTRO POR CATEGORÍA (chips dinámicos)
// -------------------------------------------------------------
function construirChipsDeCategoria(productos) {
  const categorias = Array.from(
    new Set(productos.map((p) => p.categoria).filter(Boolean))
  ).sort();

  categorias.forEach((categoria) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.dataset.categoria = categoria;
    chip.textContent = categoria;
    chipsContainer.appendChild(chip);
  });

  chipsContainer.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;

    chipsContainer
      .querySelectorAll(".chip")
      .forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    categoriaActiva = chip.dataset.categoria;
    renderizarGrid();
  });
}

// -------------------------------------------------------------
// 5. RENDER
// -------------------------------------------------------------
function renderizarGrid() {
  const productosFiltrados = catalogoCompleto.filter((p) => {
    const coincideCategoria =
      categoriaActiva === "__todas" || p.categoria === categoriaActiva;
    const coincideBusqueda =
      terminoBusqueda === "" || p.nombre.toLowerCase().includes(terminoBusqueda);
    return coincideCategoria && coincideBusqueda;
  });

  grid.innerHTML = "";

  if (productosFiltrados.length === 0) {
    mostrarEstado("No se encontraron productos con ese filtro.");
    return;
  }

  ocultarEstado();

  productosFiltrados.forEach((p) => {
    grid.appendChild(crearTarjetaProducto(p));
  });
}

function crearTarjetaProducto(p) {
  const card = document.createElement("div");
  card.className = "product-card";

  const sinStock = p.stock !== null && p.stock <= 0;
  if (sinStock) {
    const tag = document.createElement("span");
    tag.className = "product-tag product-tag-agotado";
    tag.textContent = "Agotado";
    card.appendChild(tag);
  }

  const thumb = document.createElement("div");
  thumb.className = "product-thumb";
  if (p.imagenUrl) {
    const img = document.createElement("img");
    img.src = p.imagenUrl;
    img.alt = p.nombre;
    img.loading = "lazy";
    img.className = "product-thumb-img";
    thumb.appendChild(img);
  } else {
    thumb.textContent = "🖼️";
  }
  card.appendChild(thumb);

  const info = document.createElement("div");
  info.className = "product-info";

  const nombre = document.createElement("p");
  nombre.className = "product-name";
  nombre.textContent = p.nombre;
  info.appendChild(nombre);

  if (p.descripcion) {
    const desc = document.createElement("p");
    desc.className = "product-desc";
    desc.textContent = p.descripcion;
    info.appendChild(desc);
  }

  const precio = document.createElement("p");
  precio.className = "product-price";
  precio.textContent =
    p.precio !== null ? `$${p.precio.toFixed(2)}` : "Precio no disponible";
  info.appendChild(precio);

  if (p.stock !== null && !sinStock) {
    const stock = document.createElement("p");
    stock.className = "product-stock";
    stock.textContent =
      p.stock > 5 ? "Disponible" : `¡Últimas ${p.stock} unidades!`;
    info.appendChild(stock);
  }

  card.appendChild(info);
  return card;
}

// -------------------------------------------------------------
// 6. ESTADOS (carga / error / vacío)
// -------------------------------------------------------------
function mostrarEstado(mensaje) {
  status.textContent = mensaje;
  status.style.display = "block";
  grid.innerHTML = "";
}

function ocultarEstado() {
  status.style.display = "none";
}