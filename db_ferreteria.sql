-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-12-2025 a las 06:18:39
-- Versión del servidor: 10.6.23-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_ferreteria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `authtoken_token`
--

CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `authtoken_token`
--

INSERT INTO `authtoken_token` (`key`, `created`, `user_id`) VALUES
('21b2be63114fb2ff7c3d8e5b0e68c20b95d8029c', '2025-12-18 05:07:39.489895', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add producto', 7, 'add_producto'),
(26, 'Can change producto', 7, 'change_producto'),
(27, 'Can delete producto', 7, 'delete_producto'),
(28, 'Can view producto', 7, 'view_producto'),
(29, 'Can add stock', 8, 'add_stock'),
(30, 'Can change stock', 8, 'change_stock'),
(31, 'Can delete stock', 8, 'delete_stock'),
(32, 'Can view stock', 8, 'view_stock'),
(33, 'Can add cliente', 9, 'add_cliente'),
(34, 'Can change cliente', 9, 'change_cliente'),
(35, 'Can delete cliente', 9, 'delete_cliente'),
(36, 'Can view cliente', 9, 'view_cliente'),
(37, 'Can add cotizacion', 10, 'add_cotizacion'),
(38, 'Can change cotizacion', 10, 'change_cotizacion'),
(39, 'Can delete cotizacion', 10, 'delete_cotizacion'),
(40, 'Can view cotizacion', 10, 'view_cotizacion'),
(41, 'Can add pedido', 11, 'add_pedido'),
(42, 'Can change pedido', 11, 'change_pedido'),
(43, 'Can delete pedido', 11, 'delete_pedido'),
(44, 'Can view pedido', 11, 'view_pedido'),
(45, 'Can add detalle pedido', 12, 'add_detallepedido'),
(46, 'Can change detalle pedido', 12, 'change_detallepedido'),
(47, 'Can delete detalle pedido', 12, 'delete_detallepedido'),
(48, 'Can view detalle pedido', 12, 'view_detallepedido'),
(49, 'Can add proveedor', 13, 'add_proveedor'),
(50, 'Can change proveedor', 13, 'change_proveedor'),
(51, 'Can delete proveedor', 13, 'delete_proveedor'),
(52, 'Can view proveedor', 13, 'view_proveedor'),
(53, 'Can add orden compra', 14, 'add_ordencompra'),
(54, 'Can change orden compra', 14, 'change_ordencompra'),
(55, 'Can delete orden compra', 14, 'delete_ordencompra'),
(56, 'Can view orden compra', 14, 'view_ordencompra'),
(57, 'Can add Documento de Compra Internacional', 15, 'add_documentocomprainternacional'),
(58, 'Can change Documento de Compra Internacional', 15, 'change_documentocomprainternacional'),
(59, 'Can delete Documento de Compra Internacional', 15, 'delete_documentocomprainternacional'),
(60, 'Can view Documento de Compra Internacional', 15, 'view_documentocomprainternacional'),
(61, 'Can add comision', 16, 'add_comision'),
(62, 'Can change comision', 16, 'change_comision'),
(63, 'Can delete comision', 16, 'delete_comision'),
(64, 'Can view comision', 16, 'view_comision'),
(65, 'Can add factura', 17, 'add_factura'),
(66, 'Can change factura', 17, 'change_factura'),
(67, 'Can delete factura', 17, 'delete_factura'),
(68, 'Can view factura', 17, 'view_factura'),
(69, 'Can add linea factura', 18, 'add_lineafactura'),
(70, 'Can change linea factura', 18, 'change_lineafactura'),
(71, 'Can delete linea factura', 18, 'delete_lineafactura'),
(72, 'Can view linea factura', 18, 'view_lineafactura'),
(73, 'Can add empleado', 19, 'add_empleado'),
(74, 'Can change empleado', 19, 'change_empleado'),
(75, 'Can delete empleado', 19, 'delete_empleado'),
(76, 'Can view empleado', 19, 'view_empleado'),
(77, 'Can add vacaciones', 20, 'add_vacaciones'),
(78, 'Can change vacaciones', 20, 'change_vacaciones'),
(79, 'Can delete vacaciones', 20, 'delete_vacaciones'),
(80, 'Can view vacaciones', 20, 'view_vacaciones'),
(81, 'Can add ticket', 21, 'add_ticket'),
(82, 'Can change ticket', 21, 'change_ticket'),
(83, 'Can delete ticket', 21, 'delete_ticket'),
(84, 'Can view ticket', 21, 'view_ticket'),
(85, 'Can add instalacion', 22, 'add_instalacion'),
(86, 'Can change instalacion', 22, 'change_instalacion'),
(87, 'Can delete instalacion', 22, 'delete_instalacion'),
(88, 'Can view instalacion', 22, 'view_instalacion'),
(89, 'Can add solicitud recuperacion', 23, 'add_solicitudrecuperacion'),
(90, 'Can change solicitud recuperacion', 23, 'change_solicitudrecuperacion'),
(91, 'Can delete solicitud recuperacion', 23, 'delete_solicitudrecuperacion'),
(92, 'Can view solicitud recuperacion', 23, 'view_solicitudrecuperacion'),
(93, 'Can add Token', 24, 'add_token'),
(94, 'Can change Token', 24, 'change_token'),
(95, 'Can delete Token', 24, 'delete_token'),
(96, 'Can view Token', 24, 'view_token'),
(97, 'Can add Token', 25, 'add_tokenproxy'),
(98, 'Can change Token', 25, 'change_tokenproxy'),
(99, 'Can delete Token', 25, 'delete_tokenproxy'),
(100, 'Can view Token', 25, 'view_tokenproxy'),
(101, 'Can add movimiento stock', 26, 'add_movimientostock'),
(102, 'Can change movimiento stock', 26, 'change_movimientostock'),
(103, 'Can delete movimiento stock', 26, 'delete_movimientostock'),
(104, 'Can view movimiento stock', 26, 'view_movimientostock'),
(105, 'Can add imagen producto', 27, 'add_imagenproducto'),
(106, 'Can change imagen producto', 27, 'change_imagenproducto'),
(107, 'Can delete imagen producto', 27, 'delete_imagenproducto'),
(108, 'Can view imagen producto', 27, 'view_imagenproducto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(1, 'pbkdf2_sha256$1000000$1c10Q0AZW4W3le3haDr6dZ$XcI1W4xtdCxUv9RtEzk0PZtPazfwXYuKkjNAYvgFHJA=', NULL, 1, 'admin', '', '', 'admin@ferrealamaeda.cl', 1, 1, '2025-12-18 05:06:29.945927'),
(2, 'pbkdf2_sha256$1000000$28EbdkeM3qRAHSOlRl4J6f$CJatOCFlY6sg2FzFoyYJBlaErnw9GGOPiB6YY6MzgLs=', NULL, 1, 'Silvana', '', '', '', 1, 1, '2025-12-30 05:17:12.782376');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras_documentocomprainternacional`
--

CREATE TABLE `compras_documentocomprainternacional` (
  `id` bigint(20) NOT NULL,
  `tipo_documento` varchar(10) NOT NULL,
  `numero_documento` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `moneda` varchar(3) NOT NULL,
  `tipo_cambio` decimal(10,4) NOT NULL,
  `monto_neto` decimal(12,2) NOT NULL,
  `iva_porcentaje` decimal(5,2) NOT NULL,
  `monto_iva` decimal(12,2) NOT NULL,
  `monto_total` decimal(12,2) NOT NULL,
  `monto_total_local` decimal(12,2) NOT NULL,
  `descripcion` longtext NOT NULL,
  `orden_compra_id` bigint(20) DEFAULT NULL,
  `proveedor_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras_ordencompra`
--

CREATE TABLE `compras_ordencompra` (
  `id` bigint(20) NOT NULL,
  `fecha` date NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `observaciones` longtext NOT NULL,
  `proveedor_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras_proveedor`
--

CREATE TABLE `compras_proveedor` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `rut` varchar(20) NOT NULL,
  `email` varchar(254) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(24, 'authtoken', 'token'),
(25, 'authtoken', 'tokenproxy'),
(15, 'compras', 'documentocomprainternacional'),
(14, 'compras', 'ordencompra'),
(13, 'compras', 'proveedor'),
(5, 'contenttypes', 'contenttype'),
(16, 'finanzas', 'comision'),
(17, 'finanzas', 'factura'),
(18, 'finanzas', 'lineafactura'),
(27, 'inventario', 'imagenproducto'),
(26, 'inventario', 'movimientostock'),
(7, 'inventario', 'producto'),
(8, 'inventario', 'stock'),
(19, 'rrhh', 'empleado'),
(20, 'rrhh', 'vacaciones'),
(6, 'sessions', 'session'),
(22, 'soporte', 'instalacion'),
(23, 'soporte', 'solicitudrecuperacion'),
(21, 'soporte', 'ticket'),
(9, 'ventas', 'cliente'),
(10, 'ventas', 'cotizacion'),
(12, 'ventas', 'detallepedido'),
(11, 'ventas', 'pedido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-12-18 05:04:57.252686'),
(2, 'auth', '0001_initial', '2025-12-18 05:04:57.692982'),
(3, 'admin', '0001_initial', '2025-12-18 05:04:57.802192'),
(4, 'admin', '0002_logentry_remove_auto_add', '2025-12-18 05:04:57.810988'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2025-12-18 05:04:57.823989'),
(6, 'contenttypes', '0002_remove_content_type_name', '2025-12-18 05:04:57.902898'),
(7, 'auth', '0002_alter_permission_name_max_length', '2025-12-18 05:04:57.952379'),
(8, 'auth', '0003_alter_user_email_max_length', '2025-12-18 05:04:57.980552'),
(9, 'auth', '0004_alter_user_username_opts', '2025-12-18 05:04:57.992829'),
(10, 'auth', '0005_alter_user_last_login_null', '2025-12-18 05:04:58.036803'),
(11, 'auth', '0006_require_contenttypes_0002', '2025-12-18 05:04:58.039474'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2025-12-18 05:04:58.047875'),
(13, 'auth', '0008_alter_user_username_max_length', '2025-12-18 05:04:58.077652'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2025-12-18 05:04:58.104579'),
(15, 'auth', '0010_alter_group_name_max_length', '2025-12-18 05:04:58.134105'),
(16, 'auth', '0011_update_proxy_permissions', '2025-12-18 05:04:58.144013'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2025-12-18 05:04:58.176188'),
(18, 'authtoken', '0001_initial', '2025-12-18 05:04:58.242714'),
(19, 'authtoken', '0002_auto_20160226_1747', '2025-12-18 05:04:58.281884'),
(20, 'authtoken', '0003_tokenproxy', '2025-12-18 05:04:58.286032'),
(21, 'authtoken', '0004_alter_tokenproxy_options', '2025-12-18 05:04:58.309839'),
(22, 'compras', '0001_initial', '2025-12-18 05:04:58.387404'),
(23, 'compras', '0002_documentocomprainternacional', '2025-12-18 05:04:58.492923'),
(24, 'ventas', '0001_initial', '2025-12-18 05:04:58.566768'),
(25, 'ventas', '0002_cotizacion_fecha_vencimiento_cotizacion_pagada', '2025-12-18 05:04:58.632666'),
(26, 'ventas', '0003_cotizacion_afp_descuento_cotizacion_salud_descuento_and_more', '2025-12-18 05:04:58.721034'),
(27, 'rrhh', '0001_initial', '2025-12-18 05:04:58.799363'),
(28, 'rrhh', '0002_empleado_user', '2025-12-18 05:04:58.851658'),
(29, 'ventas', '0004_cotizacion_empleado_alter_cotizacion_cliente', '2025-12-18 05:04:59.641471'),
(30, 'inventario', '0001_initial', '2025-12-18 05:04:59.713679'),
(31, 'ventas', '0005_cliente_user_pedido_detallepedido', '2025-12-18 05:04:59.937411'),
(32, 'finanzas', '0001_initial', '2025-12-18 05:04:59.970020'),
(33, 'finanzas', '0002_factura_fecha_vencimiento', '2025-12-18 05:05:00.019548'),
(34, 'finanzas', '0003_remove_factura_monto_alter_factura_cliente_and_more', '2025-12-18 05:05:00.313446'),
(35, 'rrhh', '0003_vacaciones_aprobada_por_vacaciones_comentario_admin_and_more', '2025-12-18 05:05:00.482127'),
(36, 'sessions', '0001_initial', '2025-12-18 05:05:00.523782'),
(37, 'soporte', '0001_initial', '2025-12-18 05:05:00.610816'),
(38, 'soporte', '0002_ticket_cliente_ticket_creado_por_ticket_empleado', '2025-12-18 05:05:00.790215'),
(39, 'soporte', '0003_solicitudrecuperacion', '2025-12-18 05:05:00.899394'),
(40, 'soporte', '0004_remove_solicitudrecuperacion_nueva_password', '2025-12-18 05:05:00.941961'),
(41, 'inventario', '0002_movimientostock', '2025-12-21 06:48:12.223048'),
(42, 'inventario', '0003_producto_marca', '2025-12-30 03:17:27.326576'),
(43, 'inventario', '0004_alter_stock_options_stock_estado_stock_fecha_defecto_and_more', '2025-12-30 04:03:57.608484'),
(44, 'inventario', '0005_alter_movimientostock_tipo', '2025-12-30 04:25:40.772069'),
(45, 'inventario', '0006_imagenproducto', '2025-12-30 04:59:41.736082');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `finanzas_comision`
--

CREATE TABLE `finanzas_comision` (
  `id` bigint(20) NOT NULL,
  `vendedor` varchar(200) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` date NOT NULL,
  `pagada` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `finanzas_factura`
--

CREATE TABLE `finanzas_factura` (
  `id` bigint(20) NOT NULL,
  `numero` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `cliente_id` bigint(20) DEFAULT NULL,
  `pagada` tinyint(1) NOT NULL,
  `fecha_vencimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `finanzas_lineafactura`
--

CREATE TABLE `finanzas_lineafactura` (
  `id` bigint(20) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL CHECK (`cantidad` >= 0),
  `precio_unitario` decimal(12,2) NOT NULL,
  `subtotal` decimal(14,2) NOT NULL,
  `factura_id` bigint(20) NOT NULL,
  `producto_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_imagenproducto`
--

CREATE TABLE `inventario_imagenproducto` (
  `id` bigint(20) NOT NULL,
  `imagen` varchar(100) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `es_principal` tinyint(1) NOT NULL,
  `creado` datetime(6) NOT NULL,
  `producto_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_movimientostock`
--

CREATE TABLE `inventario_movimientostock` (
  `id` bigint(20) NOT NULL,
  `tipo` varchar(30) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `nota` longtext NOT NULL,
  `creado` datetime(6) NOT NULL,
  `producto_id` bigint(20) NOT NULL,
  `stock_id` bigint(20) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_movimientostock`
--

INSERT INTO `inventario_movimientostock` (`id`, `tipo`, `cantidad`, `nota`, `creado`, `producto_id`, `stock_id`, `usuario_id`) VALUES
(1, 'producto_creado', 0, 'Producto creado: M01 - Martillo', '2025-12-21 06:53:51.133208', 2, NULL, 1),
(2, 'producto_creado', 0, 'Producto creado: 780187500180 - Bolsa plastico 50x65', '2025-12-23 04:30:08.504293', 3, NULL, 1),
(3, 'agregar', 10, 'Nuevo stock creado para SKU 780187500180 con cantidad 10', '2025-12-23 04:39:18.580195', 3, 2, 1),
(4, 'restar', 1, 'Actualización de stock (antes 10 -> ahora 9)', '2025-12-23 04:39:31.316939', 3, 2, 1),
(5, 'producto_creado', 0, 'Producto creado: C02 - Caneria', '2025-12-28 22:08:18.171606', 4, NULL, 1),
(6, 'producto_creado', 0, 'Producto creado: 888833356783 - Adorno Decorativo', '2025-12-30 01:49:01.368496', 5, NULL, 1),
(7, 'agregar', 1, 'Nuevo stock creado para SKU 888833356783 con cantidad 1', '2025-12-30 01:51:01.955784', 5, NULL, 1),
(8, 'agregar', 1, 'Nuevo stock creado para SKU M01 con cantidad 1', '2025-12-30 01:55:06.733634', 2, 4, 1),
(9, 'agregar', 3, 'Carga por SKU M01 (antes 1 -> ahora 4)', '2025-12-30 02:10:41.962825', 2, 4, 1),
(10, 'producto_creado', 0, 'Producto creado: 489500020013 - Luces Navideñas', '2025-12-30 03:44:49.680583', 6, NULL, 1),
(11, 'agregar', 2, 'Nuevo stock creado para SKU 489500020013 con cantidad 2', '2025-12-30 04:13:31.520338', 6, 5, 1),
(12, 'restar', 1, 'Actualización de stock (antes 2 -> ahora 1)', '2025-12-30 04:13:53.873841', 6, 5, 1),
(13, 'cambio_estado', 1, 'Cambio de estado: 1 unid. apto → defectuoso. Motivo: Producto en mal estado', '2025-12-30 04:21:26.401038', 5, 6, 1),
(14, 'devolucion', 1, 'Devolución: 1 unid. en estado apto. Motivo: Equivocación del cliente.', '2025-12-30 04:36:24.414328', 6, 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_producto`
--

CREATE TABLE `inventario_producto` (
  `id` bigint(20) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` longtext NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `marca` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_producto`
--

INSERT INTO `inventario_producto` (`id`, `sku`, `nombre`, `descripcion`, `categoria`, `precio`, `activo`, `marca`) VALUES
(1, 'C01', 'Caja de Clavos', '', 'Carpinteria', 2500.00, 1, 'Sodimac'),
(2, 'M01', 'Martillo', '', 'Carpinteria', 4990.00, 1, ''),
(3, '780187500180', 'Bolsa plastico 50x65', '', 'Aseo', 1000.00, 1, ''),
(4, 'C02', 'Caneria', '', 'Gas', 5000.00, 1, ''),
(5, '888833356783', 'Adorno Decorativo', '', 'Articulo Navideño', 2500.00, 1, ''),
(6, '489500020013', 'Luces Navideñas', '', 'Articulo Navideño', 1990.00, 1, 'Generico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_stock`
--

CREATE TABLE `inventario_stock` (
  `id` bigint(20) NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL CHECK (`cantidad` >= 0),
  `ubicacion` varchar(100) NOT NULL,
  `producto_id` bigint(20) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `fecha_defecto` datetime(6) DEFAULT NULL,
  `motivo_defecto` varchar(255) NOT NULL,
  `usuario_reporte_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_stock`
--

INSERT INTO `inventario_stock` (`id`, `cantidad`, `ubicacion`, `producto_id`, `estado`, `fecha_defecto`, `motivo_defecto`, `usuario_reporte_id`) VALUES
(1, 40, '', 1, 'apto', NULL, '', NULL),
(2, 9, '', 3, 'apto', NULL, '', NULL),
(4, 4, '', 2, 'apto', NULL, '', NULL),
(5, 2, '', 6, 'apto', NULL, '', NULL),
(6, 1, '', 5, 'defectuoso', '2025-12-30 04:21:26.397349', 'Producto en mal estado', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rrhh_empleado`
--

CREATE TABLE `rrhh_empleado` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `rut` varchar(20) NOT NULL,
  `cargo` varchar(100) NOT NULL,
  `email` varchar(254) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rrhh_vacaciones`
--

CREATE TABLE `rrhh_vacaciones` (
  `id` bigint(20) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `aprobada` tinyint(1) NOT NULL,
  `empleado_id` bigint(20) NOT NULL,
  `aprobada_por_id` int(11) DEFAULT NULL,
  `comentario_admin` longtext DEFAULT NULL,
  `estado` varchar(20) NOT NULL,
  `fecha_respuesta` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `soporte_instalacion`
--

CREATE TABLE `soporte_instalacion` (
  `id` bigint(20) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `fecha_programada` date NOT NULL,
  `realizada` tinyint(1) NOT NULL,
  `ticket_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `soporte_solicitudrecuperacion`
--

CREATE TABLE `soporte_solicitudrecuperacion` (
  `id` bigint(20) NOT NULL,
  `username` varchar(150) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `fecha_solicitud` datetime(6) NOT NULL,
  `fecha_respuesta` datetime(6) DEFAULT NULL,
  `atendida_por_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `soporte_ticket`
--

CREATE TABLE `soporte_ticket` (
  `id` bigint(20) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` longtext NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `asignado_a` varchar(200) NOT NULL,
  `cliente_id` bigint(20) DEFAULT NULL,
  `creado_por_id` int(11) DEFAULT NULL,
  `empleado_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_cliente`
--

CREATE TABLE `ventas_cliente` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `rut` varchar(20) NOT NULL,
  `email` varchar(254) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_cotizacion`
--

CREATE TABLE `ventas_cotizacion` (
  `id` bigint(20) NOT NULL,
  `fecha` date NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `observaciones` longtext NOT NULL,
  `cliente_id` bigint(20) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `pagada` tinyint(1) NOT NULL,
  `afp_descuento` decimal(12,2) DEFAULT NULL,
  `salud_descuento` decimal(12,2) DEFAULT NULL,
  `sueldo_bruto` decimal(12,2) DEFAULT NULL,
  `total_neto` decimal(12,2) DEFAULT NULL,
  `empleado_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_detallepedido`
--

CREATE TABLE `ventas_detallepedido` (
  `id` bigint(20) NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL CHECK (`cantidad` >= 0),
  `precio_unitario` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `producto_id` bigint(20) NOT NULL,
  `pedido_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_pedido`
--

CREATE TABLE `ventas_pedido` (
  `id` bigint(20) NOT NULL,
  `fecha` datetime(6) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `observaciones` longtext NOT NULL,
  `cliente_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `authtoken_token`
--
ALTER TABLE `authtoken_token`
  ADD PRIMARY KEY (`key`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indices de la tabla `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indices de la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indices de la tabla `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indices de la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indices de la tabla `compras_documentocomprainternacional`
--
ALTER TABLE `compras_documentocomprainternacional`
  ADD PRIMARY KEY (`id`),
  ADD KEY `compras_documentocom_orden_compra_id_f83f34e7_fk_compras_o` (`orden_compra_id`),
  ADD KEY `compras_documentocom_proveedor_id_97339440_fk_compras_p` (`proveedor_id`);

--
-- Indices de la tabla `compras_ordencompra`
--
ALTER TABLE `compras_ordencompra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `compras_ordencompra_proveedor_id_c42e35e1_fk_compras_p` (`proveedor_id`);

--
-- Indices de la tabla `compras_proveedor`
--
ALTER TABLE `compras_proveedor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rut` (`rut`);

--
-- Indices de la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indices de la tabla `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indices de la tabla `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indices de la tabla `finanzas_comision`
--
ALTER TABLE `finanzas_comision`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `finanzas_factura`
--
ALTER TABLE `finanzas_factura`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`),
  ADD KEY `finanzas_factura_cliente_id_1eae5a77` (`cliente_id`);

--
-- Indices de la tabla `finanzas_lineafactura`
--
ALTER TABLE `finanzas_lineafactura`
  ADD PRIMARY KEY (`id`),
  ADD KEY `finanzas_lineafactura_factura_id_479fbe4d_fk_finanzas_factura_id` (`factura_id`),
  ADD KEY `finanzas_lineafactur_producto_id_564a4a2e_fk_inventari` (`producto_id`);

--
-- Indices de la tabla `inventario_imagenproducto`
--
ALTER TABLE `inventario_imagenproducto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventario_imagenpro_producto_id_e8c0cf3a_fk_inventari` (`producto_id`);

--
-- Indices de la tabla `inventario_movimientostock`
--
ALTER TABLE `inventario_movimientostock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventario_movimient_producto_id_a66cca38_fk_inventari` (`producto_id`),
  ADD KEY `inventario_movimient_stock_id_275777d0_fk_inventari` (`stock_id`),
  ADD KEY `inventario_movimientostock_usuario_id_80ad7867_fk_auth_user_id` (`usuario_id`);

--
-- Indices de la tabla `inventario_producto`
--
ALTER TABLE `inventario_producto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`);

--
-- Indices de la tabla `inventario_stock`
--
ALTER TABLE `inventario_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventario_stock_producto_id_80ab929a_fk_inventario_producto_id` (`producto_id`),
  ADD KEY `inventario_stock_usuario_reporte_id_0a1c9662_fk_auth_user_id` (`usuario_reporte_id`);

--
-- Indices de la tabla `rrhh_empleado`
--
ALTER TABLE `rrhh_empleado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rut` (`rut`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indices de la tabla `rrhh_vacaciones`
--
ALTER TABLE `rrhh_vacaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rrhh_vacaciones_empleado_id_1860d028_fk_rrhh_empleado_id` (`empleado_id`),
  ADD KEY `rrhh_vacaciones_aprobada_por_id_a27a94ca_fk_auth_user_id` (`aprobada_por_id`);

--
-- Indices de la tabla `soporte_instalacion`
--
ALTER TABLE `soporte_instalacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `soporte_instalacion_ticket_id_50b5a95d_fk_soporte_ticket_id` (`ticket_id`);

--
-- Indices de la tabla `soporte_solicitudrecuperacion`
--
ALTER TABLE `soporte_solicitudrecuperacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `soporte_solicitudrec_atendida_por_id_abbd6757_fk_auth_user` (`atendida_por_id`),
  ADD KEY `soporte_solicitudrecuperacion_user_id_c4cfc359_fk_auth_user_id` (`user_id`);

--
-- Indices de la tabla `soporte_ticket`
--
ALTER TABLE `soporte_ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `soporte_ticket_cliente_id_f8c4ec71_fk_ventas_cliente_id` (`cliente_id`),
  ADD KEY `soporte_ticket_creado_por_id_3f7adc93_fk_auth_user_id` (`creado_por_id`),
  ADD KEY `soporte_ticket_empleado_id_59aad866_fk_rrhh_empleado_id` (`empleado_id`);

--
-- Indices de la tabla `ventas_cliente`
--
ALTER TABLE `ventas_cliente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rut` (`rut`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indices de la tabla `ventas_cotizacion`
--
ALTER TABLE `ventas_cotizacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ventas_cotizacion_empleado_id_c1ac7a34_fk_rrhh_empleado_id` (`empleado_id`),
  ADD KEY `ventas_cotizacion_cliente_id_a9bd0e74_fk_ventas_cliente_id` (`cliente_id`);

--
-- Indices de la tabla `ventas_detallepedido`
--
ALTER TABLE `ventas_detallepedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ventas_detallepedido_producto_id_b36898a5_fk_inventari` (`producto_id`),
  ADD KEY `ventas_detallepedido_pedido_id_fc93f642_fk_ventas_pedido_id` (`pedido_id`);

--
-- Indices de la tabla `ventas_pedido`
--
ALTER TABLE `ventas_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ventas_pedido_cliente_id_a0af3b9c_fk_ventas_cliente_id` (`cliente_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT de la tabla `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compras_documentocomprainternacional`
--
ALTER TABLE `compras_documentocomprainternacional`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compras_ordencompra`
--
ALTER TABLE `compras_ordencompra`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compras_proveedor`
--
ALTER TABLE `compras_proveedor`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `finanzas_comision`
--
ALTER TABLE `finanzas_comision`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `finanzas_factura`
--
ALTER TABLE `finanzas_factura`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `finanzas_lineafactura`
--
ALTER TABLE `finanzas_lineafactura`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario_imagenproducto`
--
ALTER TABLE `inventario_imagenproducto`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario_movimientostock`
--
ALTER TABLE `inventario_movimientostock`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `inventario_producto`
--
ALTER TABLE `inventario_producto`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `inventario_stock`
--
ALTER TABLE `inventario_stock`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `rrhh_empleado`
--
ALTER TABLE `rrhh_empleado`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rrhh_vacaciones`
--
ALTER TABLE `rrhh_vacaciones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `soporte_instalacion`
--
ALTER TABLE `soporte_instalacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `soporte_solicitudrecuperacion`
--
ALTER TABLE `soporte_solicitudrecuperacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `soporte_ticket`
--
ALTER TABLE `soporte_ticket`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ventas_cliente`
--
ALTER TABLE `ventas_cliente`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ventas_cotizacion`
--
ALTER TABLE `ventas_cotizacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ventas_detallepedido`
--
ALTER TABLE `ventas_detallepedido`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ventas_pedido`
--
ALTER TABLE `ventas_pedido`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `authtoken_token`
--
ALTER TABLE `authtoken_token`
  ADD CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Filtros para la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Filtros para la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `compras_documentocomprainternacional`
--
ALTER TABLE `compras_documentocomprainternacional`
  ADD CONSTRAINT `compras_documentocom_orden_compra_id_f83f34e7_fk_compras_o` FOREIGN KEY (`orden_compra_id`) REFERENCES `compras_ordencompra` (`id`),
  ADD CONSTRAINT `compras_documentocom_proveedor_id_97339440_fk_compras_p` FOREIGN KEY (`proveedor_id`) REFERENCES `compras_proveedor` (`id`);

--
-- Filtros para la tabla `compras_ordencompra`
--
ALTER TABLE `compras_ordencompra`
  ADD CONSTRAINT `compras_ordencompra_proveedor_id_c42e35e1_fk_compras_p` FOREIGN KEY (`proveedor_id`) REFERENCES `compras_proveedor` (`id`);

--
-- Filtros para la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `finanzas_factura`
--
ALTER TABLE `finanzas_factura`
  ADD CONSTRAINT `finanzas_factura_cliente_id_1eae5a77_fk_ventas_cliente_id` FOREIGN KEY (`cliente_id`) REFERENCES `ventas_cliente` (`id`);

--
-- Filtros para la tabla `finanzas_lineafactura`
--
ALTER TABLE `finanzas_lineafactura`
  ADD CONSTRAINT `finanzas_lineafactur_producto_id_564a4a2e_fk_inventari` FOREIGN KEY (`producto_id`) REFERENCES `inventario_producto` (`id`),
  ADD CONSTRAINT `finanzas_lineafactura_factura_id_479fbe4d_fk_finanzas_factura_id` FOREIGN KEY (`factura_id`) REFERENCES `finanzas_factura` (`id`);

--
-- Filtros para la tabla `inventario_imagenproducto`
--
ALTER TABLE `inventario_imagenproducto`
  ADD CONSTRAINT `inventario_imagenpro_producto_id_e8c0cf3a_fk_inventari` FOREIGN KEY (`producto_id`) REFERENCES `inventario_producto` (`id`);

--
-- Filtros para la tabla `inventario_movimientostock`
--
ALTER TABLE `inventario_movimientostock`
  ADD CONSTRAINT `inventario_movimient_producto_id_a66cca38_fk_inventari` FOREIGN KEY (`producto_id`) REFERENCES `inventario_producto` (`id`),
  ADD CONSTRAINT `inventario_movimient_stock_id_275777d0_fk_inventari` FOREIGN KEY (`stock_id`) REFERENCES `inventario_stock` (`id`),
  ADD CONSTRAINT `inventario_movimientostock_usuario_id_80ad7867_fk_auth_user_id` FOREIGN KEY (`usuario_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `inventario_stock`
--
ALTER TABLE `inventario_stock`
  ADD CONSTRAINT `inventario_stock_producto_id_80ab929a_fk_inventario_producto_id` FOREIGN KEY (`producto_id`) REFERENCES `inventario_producto` (`id`),
  ADD CONSTRAINT `inventario_stock_usuario_reporte_id_0a1c9662_fk_auth_user_id` FOREIGN KEY (`usuario_reporte_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `rrhh_empleado`
--
ALTER TABLE `rrhh_empleado`
  ADD CONSTRAINT `rrhh_empleado_user_id_4e4149d7_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `rrhh_vacaciones`
--
ALTER TABLE `rrhh_vacaciones`
  ADD CONSTRAINT `rrhh_vacaciones_aprobada_por_id_a27a94ca_fk_auth_user_id` FOREIGN KEY (`aprobada_por_id`) REFERENCES `auth_user` (`id`),
  ADD CONSTRAINT `rrhh_vacaciones_empleado_id_1860d028_fk_rrhh_empleado_id` FOREIGN KEY (`empleado_id`) REFERENCES `rrhh_empleado` (`id`);

--
-- Filtros para la tabla `soporte_instalacion`
--
ALTER TABLE `soporte_instalacion`
  ADD CONSTRAINT `soporte_instalacion_ticket_id_50b5a95d_fk_soporte_ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `soporte_ticket` (`id`);

--
-- Filtros para la tabla `soporte_solicitudrecuperacion`
--
ALTER TABLE `soporte_solicitudrecuperacion`
  ADD CONSTRAINT `soporte_solicitudrec_atendida_por_id_abbd6757_fk_auth_user` FOREIGN KEY (`atendida_por_id`) REFERENCES `auth_user` (`id`),
  ADD CONSTRAINT `soporte_solicitudrecuperacion_user_id_c4cfc359_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `soporte_ticket`
--
ALTER TABLE `soporte_ticket`
  ADD CONSTRAINT `soporte_ticket_cliente_id_f8c4ec71_fk_ventas_cliente_id` FOREIGN KEY (`cliente_id`) REFERENCES `ventas_cliente` (`id`),
  ADD CONSTRAINT `soporte_ticket_creado_por_id_3f7adc93_fk_auth_user_id` FOREIGN KEY (`creado_por_id`) REFERENCES `auth_user` (`id`),
  ADD CONSTRAINT `soporte_ticket_empleado_id_59aad866_fk_rrhh_empleado_id` FOREIGN KEY (`empleado_id`) REFERENCES `rrhh_empleado` (`id`);

--
-- Filtros para la tabla `ventas_cliente`
--
ALTER TABLE `ventas_cliente`
  ADD CONSTRAINT `ventas_cliente_user_id_a3d3cf16_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `ventas_cotizacion`
--
ALTER TABLE `ventas_cotizacion`
  ADD CONSTRAINT `ventas_cotizacion_cliente_id_a9bd0e74_fk_ventas_cliente_id` FOREIGN KEY (`cliente_id`) REFERENCES `ventas_cliente` (`id`),
  ADD CONSTRAINT `ventas_cotizacion_empleado_id_c1ac7a34_fk_rrhh_empleado_id` FOREIGN KEY (`empleado_id`) REFERENCES `rrhh_empleado` (`id`);

--
-- Filtros para la tabla `ventas_detallepedido`
--
ALTER TABLE `ventas_detallepedido`
  ADD CONSTRAINT `ventas_detallepedido_pedido_id_fc93f642_fk_ventas_pedido_id` FOREIGN KEY (`pedido_id`) REFERENCES `ventas_pedido` (`id`),
  ADD CONSTRAINT `ventas_detallepedido_producto_id_b36898a5_fk_inventari` FOREIGN KEY (`producto_id`) REFERENCES `inventario_producto` (`id`);

--
-- Filtros para la tabla `ventas_pedido`
--
ALTER TABLE `ventas_pedido`
  ADD CONSTRAINT `ventas_pedido_cliente_id_a0af3b9c_fk_ventas_cliente_id` FOREIGN KEY (`cliente_id`) REFERENCES `ventas_cliente` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
