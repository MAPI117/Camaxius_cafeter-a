
"use strict";

// =============================================
// CATÁLOGO DE PRODUCTOS
// =============================================
// Aquí puedes cambiar los nombres, precios
// y descripciones de los productos.

const PRODUCTOS = [
    {
        id: 1,
        nombre: "Chicharrón en salsa verde",
        detalle: "Plato grande con arroz rojo",
        precio: 40
    },
    {
        id: 2,
        nombre: "Sopa fría con picadillo",
        detalle: "Comida completa del día",
        precio: 40
    },
    {
        id: 3,
        nombre: "Pechuga rellena",
        detalle: "Con espagueti blanco",
        precio: 50
    },
    {
        id: 4,
        nombre: "Guiso de res",
        detalle: "Con salsa de mora y ensalada rusa",
        precio: 50
    },
    {
        id: 5,
        nombre: "Combo de Maruchan",
        detalle: "2 Maruchans y 2 refrescos",
        precio: 100
    },
    {
        id: 6,
        nombre: "Agua natural",
        detalle: "Botella de agua",
        precio: 15
    },
    {
        id: 7,
        nombre: "Refresco de cola",
        detalle: "Botella individual",
        precio: 20
    },
    {
        id: 8,
        nombre: "Refresco de naranja",
        detalle: "Botella individual",
        precio: 20
    },
    {
        id: 9,
        nombre: "Jugo de mango",
        detalle: "Jugo en envase individual",
        precio: 18
    },
    {
        id: 10,
        nombre: "Jugo de manzana",
        detalle: "Jugo en envase individual",
        precio: 18
    },
    {
        id: 11,
        nombre: "Galletas de chocolate",
        detalle: "Paquete de galletas",
        precio: 16
    },
    {
        id: 12,
        nombre: "Galletas de vainilla",
        detalle: "Paquete de galletas",
        precio: 15
    },
    {
        id: 13,
        nombre: "Paleta de caramelo",
        detalle: "Dulce individual",
        precio: 8
    },
    {
        id: 14,
        nombre: "Gomitas",
        detalle: "Bolsa de gomitas",
        precio: 15
    },
    {
        id: 15,
        nombre: "Chocolate",
        detalle: "Barra de chocolate",
        precio: 18
    },
    {
        id: 16,
        nombre: "Papas fritas",
        detalle: "Bolsa individual",
        precio: 18
    },
    {
        id: 17,
        nombre: "Cacahuates",
        detalle: "Bolsa individual",
        precio: 15
    }
];

// =============================================
// ALMACENAMIENTO DEL CARRITO Y USUARIO
// =============================================

const CLAVE_CARRITO = "141legends_carrito_v1";
const CLAVE_USUARIO = "141legends_usuario_v1";

// Convierte los precios a pesos mexicanos.
const dinero = n => new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
}).format(n);

// =============================================
// FUNCIONES DEL CARRITO
// =============================================

// Obtiene los productos guardados en el carrito.
function obtenerCarrito() {
    try {
        let a = JSON.parse(
            localStorage.getItem(CLAVE_CARRITO) || "[]"
        );

        return Array.isArray(a)
            ? a.filter(x =>
                PRODUCTOS.some(p => p.id === x.id) &&
                Number.isInteger(x.cantidad) &&
                x.cantidad > 0 &&
                x.cantidad <= 999
            )
            : [];

    } catch {
        return [];
    }
}

// Guarda el carrito en el navegador.
function guardarCarrito(items) {
    localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(items)
    );

    actualizarContadores();
}

// Actualiza la cantidad de productos del carrito.
function actualizarContadores() {
    const n = obtenerCarrito().reduce(
        (s, p) => s + p.cantidad,
        0
    );

    document.querySelectorAll("[data-contador]")
        .forEach(el => {
            el.textContent = n;
        });
}

// =============================================
// AGREGAR PRODUCTOS AL CARRITO
// =============================================

function agregar(id) {
    const p = PRODUCTOS.find(p => p.id === id);

    if (!p) return;

    const items = obtenerCarrito();
    const item = items.find(i => i.id === id);

    if (item) {
        if (item.cantidad < 999) {
            item.cantidad++;
        }
    } else {
        items.push({
            id,
            cantidad: 1
        });
    }

    guardarCarrito(items);

    // Muestra una notificación cuando se agrega.
    const toast = document.getElementById("toast");

    if (toast) {
        toast.textContent =
            `${p.nombre} agregado al carrito ✔`;

        toast.hidden = false;

        clearTimeout(window.avisoTimer);

        window.avisoTimer = setTimeout(() => {
            toast.hidden = true;
        }, 2300);
    }
}

// =============================================
// CREACIÓN DE ELEMENTOS HTML
// =============================================

// Crea elementos HTML mediante JavaScript.
function nodo(etiqueta, clase, texto) {
    const e = document.createElement(etiqueta);

    if (clase) {
        e.className = clase;
    }

    if (texto !== undefined) {
        e.textContent = texto;
    }

    return e;
}

// Crea botones con sus eventos de clic.
function boton(texto, clase, accion) {
    const e = nodo("button", clase, texto);

    e.type = "button";
    e.addEventListener("click", accion);

    return e;
}

// =============================================
// MOSTRAR PRODUCTOS DEL CARRITO
// =============================================

function renderCarrito() {
    const area = document.getElementById("contenido-carrito");

    if (!area) return;

    area.replaceChildren();

    const items = obtenerCarrito();

    // Muestra un mensaje si el carrito está vacío.
    if (!items.length) {
        const e = nodo("div", "vacio");

        e.append(
            nodo("h3", "", "Tu carrito está vacío"),
            nodo(
                "p",
                "",
                "Visita productos y agrega algo rico a tu pedido."
            )
        );

        const a = nodo("a", "btn", "Ir a comprar");
        a.href = "compras.html";

        e.append(a);
        area.append(e);

        return;
    }

    // Construcción de la tabla del carrito.
    const sc = nodo("div", "tabla-scroll");
    const t = nodo("table", "carrito-tabla");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    [
        "Producto",
        "Precio",
        "Cantidad",
        "Subtotal",
        "Acción"
    ].forEach(h => {
        tr.append(nodo("th", "", h));
    });

    thead.append(tr);
    t.append(thead);

    const tb = document.createElement("tbody");

    let total = 0;

    items.forEach(i => {
        const p = PRODUCTOS.find(p => p.id === i.id);

        if (!p) return;

        total += p.precio * i.cantidad;

        const fila = document.createElement("tr");

        fila.append(
            nodo("td", "", p.nombre),
            nodo("td", "", dinero(p.precio))
        );

        const c = nodo("td", "");
        const control = nodo("div", "cantidad");

        control.append(
            boton("−", "", () => cambiar(i.id, -1)),
            nodo("span", "", String(i.cantidad)),
            boton("+", "", () => cambiar(i.id, 1))
        );

        c.append(control);

        fila.append(
            c,
            nodo("td", "", dinero(p.precio * i.cantidad))
        );

        const act = nodo("td", "");

        act.append(
            boton(
                "Eliminar",
                "btn-eliminar",
                () => eliminar(i.id)
            )
        );

        fila.append(act);
        tb.append(fila);
    });

    t.append(tb);
    sc.append(t);
    area.append(sc);

    // Muestra el total del pedido.
    const resumen = nodo("div", "resumen");
    const cuadro = nodo("div", "");

    cuadro.append(
        nodo("p", "", "Total de tu pedido:"),
        nodo("strong", "", dinero(total))
    );

    resumen.append(cuadro);
    area.append(resumen);

    // Botones de acciones del carrito.
    const acciones = nodo("div", "acciones");

    const volver = nodo(
        "a",
        "btn btn-claro",
        "← Seguir comprando"
    );

    volver.href = "compras.html";

    acciones.append(
        volver,

        boton(
            "Vaciar carrito",
            "btn btn-peligro",
            () => {
                if (confirm("¿Vaciar todos los productos del carrito?")) {
                    guardarCarrito([]);
                    renderCarrito();
                }
            }
        ),

        boton(
            "Finalizar pedido ✓",
            "btn btn-dorado",
            () => {
                if (confirm(
                    `Pedido de ${dinero(total)}. ¿Confirmar pedido de demostración?`
                )) {
                    guardarCarrito([]);
                    renderCarrito();

                    alert(
                        "¡Pedido de demostración confirmado! No se realizó ningún cobro ni se envió una orden real."
                    );
                }
            }
        )
    );

    area.append(acciones);
}

// =============================================
// MODIFICAR PRODUCTOS DEL CARRITO
// =============================================

// Aumenta o disminuye las cantidades.
function cambiar(id, dif) {
    const a = obtenerCarrito();
    const i = a.find(x => x.id === id);

    if (!i) return;

    i.cantidad = Math.min(
        999,
        Math.max(0, i.cantidad + dif)
    );

    guardarCarrito(
        a.filter(x => x.cantidad > 0)
    );

    renderCarrito();
}

// Elimina un producto del carrito.
function eliminar(id) {
    guardarCarrito(
        obtenerCarrito().filter(x => x.id !== id)
    );

    renderCarrito();
}

// =============================================
// MENÚ SEMANAL DE LUNES A VIERNES
// =============================================

// Los ID se relacionan con los primeros cinco
// productos que aparecen en PRODUCTOS.

const ESPECIALES = [
    {
        dia: "Lunes",
        id: 1,
        emoji: "🍽️"
    },
    {
        dia: "Martes",
        id: 2,
        emoji: "🥗"
    },
    {
        dia: "Miércoles",
        id: 3,
        emoji: "🍝"
    },
    {
        dia: "Jueves",
        id: 4,
        emoji: "🥘"
    },
    {
        dia: "Viernes",
        id: 5,
        emoji: "🍜"
    }
];

// =============================================
// CATEGORÍAS Y PRESENTACIÓN DEL CATÁLOGO
// =============================================

const CATALOGO_VISUAL = [
    {
        id: 6,
        categoria: "bebidas",
        emoji: "💧",
        color: "#d7f0ff"
    },
    {
        id: 7,
        categoria: "bebidas",
        emoji: "🥤",
        color: "#fbe0dd"
    },
    {
        id: 8,
        categoria: "bebidas",
        emoji: "🍊",
        color: "#ffe7c9"
    },
    {
        id: 9,
        categoria: "bebidas",
        emoji: "🧃",
        color: "#ffe9b4"
    },
    {
        id: 10,
        categoria: "bebidas",
        emoji: "🍎",
        color: "#fce1db"
    },
    {
        id: 11,
        categoria: "galletas",
        emoji: "🍪",
        color: "#f4dfc6"
    },
    {
        id: 12,
        categoria: "galletas",
        emoji: "🍪",
        color: "#f5e8cb"
    },
    {
        id: 13,
        categoria: "dulces",
        emoji: "🍭",
        color: "#fce0ea"
    },
    {
        id: 14,
        categoria: "dulces",
        emoji: "🍬",
        color: "#e5dbff"
    },
    {
        id: 15,
        categoria: "dulces",
        emoji: "🍫",
        color: "#e9d7cb"
    },
    {
        id: 16,
        categoria: "botanas",
        emoji: "🥔",
        color: "#fff0c5"
    },
    {
        id: 17,
        categoria: "botanas",
        emoji: "🥜",
        color: "#eee2c9"
    }
];

// =============================================
// IMÁGENES DE LOS PRODUCTOS
// =============================================
// Los nombres de estos archivos corresponden
// a las imágenes almacenadas en assets.

const IMAGENES_PRODUCTOS = {
    "Agua natural": "agua_natural.png",
    "Refresco de cola": "refresco_de_cola.png",
    "Refresco de naranja": "refresco_de_naranja.png",
    "Jugo de mango": "jugo_de_mango.png",
    "Jugo de manzana": "jugo_de_manzana.png",
    "Galletas de chocolate": "galletas_de_chocolate.png",
    "Galletas de vainilla": "galletas_de_vainilla.png",
    "Paleta de caramelo": "paleta_de_caramelo.png",
    "Gomitas": "gomitas.png",
    "Chocolate": "chocolate.png",
    "Papas fritas": "papas_fritas.png",
    "Cacahuates": "cacahuates.png"
};

// =============================================
// MOSTRAR EL CATÁLOGO Y FILTRAR PRODUCTOS
// =============================================

function iniciarCatalogo() {
    const rejilla = document.getElementById(
        "rejilla-productos"
    );

    if (!rejilla) return;

    // Dibuja los productos según el filtro elegido.
    function pintar(filtro = "todos") {
        rejilla.replaceChildren();

        CATALOGO_VISUAL
            .filter(x =>
                filtro === "todos" ||
                x.categoria === filtro
            )
            .forEach(v => {

                const p = PRODUCTOS.find(
                    item => item.id === v.id
                );

                if (!p) return;

                const tarjeta = nodo(
                    "article",
                    "producto-card"
                );

                const figura = nodo(
                    "div",
                    "producto-figura"
                );

                // Busca el archivo de imagen del producto.
                const archivoImagen = IMAGENES_PRODUCTOS[p.nombre];

                if (archivoImagen) {

                    const imagen = document.createElement("img");

                    // Ruta relativa a compras.html.
                    imagen.src = `assets/${archivoImagen}`;
                    imagen.alt = p.nombre;
                    imagen.loading = "lazy";

                    // Si falla la carga, muestra el emoji.
                    imagen.onerror = () => {
                        figura.replaceChildren(
                            document.createTextNode(v.emoji)
                        );

                        figura.style.background = v.color;
                    };

                    figura.append(imagen);

                } else {
                    figura.textContent = v.emoji;
                    figura.style.background = v.color;
                }

                // Información de cada producto.
                const info = nodo(
                    "div",
                    "producto-info"
                );

                const tipo = nodo(
                    "span",
                    "producto-tipo",
                    v.categoria
                );

                const nombre = nodo(
                    "h4",
                    "",
                    p.nombre
                );

                const detalle = nodo(
                    "p",
                    "",
                    p.detalle
                );

                const pie = nodo(
                    "div",
                    "producto-pie"
                );

                const precio = nodo(
                    "strong",
                    "",
                    dinero(p.precio)
                );

                // Botón para agregar al carrito.
                pie.append(
                    precio,
                    boton(
                        "+ Agregar",
                        "btn btn-agregar",
                        () => agregar(p.id)
                    )
                );

                info.append(
                    tipo,
                    nombre,
                    detalle,
                    pie
                );

                tarjeta.append(figura, info);
                rejilla.append(tarjeta);
            });
    }

    // =========================================
    // BOTONES DE FILTROS
    // =========================================

    document.querySelectorAll("[data-filtro]")
        .forEach(b => {

            b.addEventListener("click", () => {

                document.querySelectorAll("[data-filtro]")
                    .forEach(a => {
                        a.classList.remove("activo");

                        a.setAttribute(
                            "aria-pressed",
                            "false"
                        );
                    });

                b.classList.add("activo");

                b.setAttribute(
                    "aria-pressed",
                    "true"
                );

                pintar(b.dataset.filtro);
            });
        });

    // Muestra todos los productos al cargar.
    pintar();

    // Inicializa el calendario de comidas.
    iniciarCalendario();
}

// =============================================
// CALENDARIO SEMANAL DE COMIDAS
// =============================================

function iniciarCalendario() {
    const contenedor = document.getElementById(
        "tarjetas-menu-semanal"
    );

    if (!contenedor) return;

    const etiquetas = [
        "Especial del día",
        "Menú fresco",
        "Platillo casero",
        "Recomendado",
        "Combo de cierre"
    ];

    const iconos = [
        "🍽️", "🥗", "🍝", "🥘", "🍜"
    ];

    const nombresCortos = [
        "Chicharrón",
        "Sopa fría",
        "Pechuga",
        "Guiso",
        "Maruchan"
    ];

    ESPECIALES.forEach((especial, i) => {
        const p = PRODUCTOS.find(
            producto => producto.id === especial.id
        );

        if (!p) return;

        // Contenedor principal de cada día.
        const tarjeta = nodo(
            "article",
            "menu-dia-card"
        );

        const cabecera = nodo(
            "div",
            "menu-dia-cabecera"
        );

        cabecera.append(
            nodo("strong", "", especial.dia),
            nodo("span", "", etiquetas[i])
        );

        const contenido = nodo(
            "div",
            "menu-dia-contenido"
        );

        const resumen = nodo(
            "div",
            "menu-dia-resumen"
        );

        const figura = nodo(
            "div",
            "menu-dia-figura"
        );

        figura.setAttribute(
            "aria-hidden",
            "true"
        );

        figura.append(
            nodo("span", "menu-dia-emoji", iconos[i]),
            nodo("small", "", nombresCortos[i])
        );

        // Nombre, descripción y precio.
        const informacion = nodo(
            "div",
            "menu-dia-informacion"
        );

        informacion.append(
            nodo("h4", "", p.nombre),
            nodo("p", "", p.detalle + "."),
            nodo(
                "strong",
                "menu-dia-precio",
                dinero(p.precio)
            )
        );

        resumen.append(
            figura,
            informacion
        );

        // Agrega el platillo seleccionado al carrito.
        contenido.append(
            resumen,
            boton(
                "+ Agregar al carrito",
                "menu-dia-boton",
                () => agregar(p.id)
            )
        );

        tarjeta.append(
            cabecera,
            contenido
        );

        contenedor.append(tarjeta);
    });
}

// =============================================
// INICIALIZACIÓN DE LA PÁGINA
// =============================================
// Este evento se ejecuta cuando el HTML ha sido
// cargado completamente en el navegador.

document.addEventListener("DOMContentLoaded", () => {

    // Actualiza el contador de productos.
    actualizarContadores();

    // Identifica la página actual.
    const pagina = document.body.dataset.pagina;

    // =========================================
    // INICIO DE SESIÓN
    // =========================================

    if (pagina === "login") {

        const f = document.getElementById(
            "form-login"
        );

        f.addEventListener("submit", e => {

            e.preventDefault();

            if (!f.reportValidity()) return;

            const usuario = document.getElementById(
                "usuario"
            ).value.trim();

            const password = document.getElementById(
                "password"
            ).value;

            // Validación de los datos ingresados.
            if (
                usuario.length < 2 ||
                password.length < 4
            ) {
                document.getElementById(
                    "login-error"
                ).textContent =
                    "Introduce un nombre y una contraseña de al menos 4 caracteres.";

                return;
            }

            // Guarda temporalmente el usuario.
            sessionStorage.setItem(
                CLAVE_USUARIO,
                usuario
            );

            // Redirige al catálogo.
            window.location.href = "compras.html";
        });

    } else {

        // =====================================
        // VERIFICACIÓN DE SESIÓN
        // =====================================

        const usuario = sessionStorage.getItem(
            CLAVE_USUARIO
        );

        if (!usuario) {
            window.location.replace("index.html");
            return;
        }

        // Saludo personalizado.
        const saludo = document.getElementById(
            "saludo"
        );

        if (saludo) {
            saludo.textContent =
                `¡Hola, ${usuario}! ¿Qué se te antoja hoy?`;
        }

        // Activa botones que agregan productos.
        document.querySelectorAll("[data-agregar]")
            .forEach(b => {

                b.addEventListener("click", () => {
                    agregar(Number(b.dataset.agregar));
                });
            });

        // Muestra el carrito si corresponde.
        if (pagina === "carrito") {
            renderCarrito();
        }

        // Muestra el catálogo y calendario.
        if (pagina === "compras") {
            iniciarCatalogo();
        }
    }
});
