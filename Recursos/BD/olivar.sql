-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-11-2022 a las 10:38:14
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `olivar`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen`
--

CREATE TABLE `imagen` (
  `id_imagen` int(11) NOT NULL,
  `id_olivo` int(11) NOT NULL,
  `id_parcela` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `tipo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `imagen`
--

INSERT INTO `imagen` (`id_imagen`, `id_olivo`, `id_parcela`, `nombre`, `tipo`) VALUES
(1, 1, 1, 'termica_olivo.png', 'termica'),
(2, 1, 1, 'cenital_olivo.png', 'cenital'),
(3, 1, 1, 'termica_olivo2.png', 'termica'),
(4, 1, 1, 'cenital_olivo2.png', 'cenital'),
(5, 1, 1, 'termica_olivo3.png', 'termica'),
(6, 1, 1, 'cenital_olivo3.png', 'cenital'),
(7, 1, 1, 'Olivo.png', 'imagen'),
(8, 1, 1, 'Olivo2.png', 'imagen'),
(9, 1, 1, 'olivo3.png', 'imagen'),
(10, 2, 1, 'termica_olivo.png', 'termica'),
(11, 2, 1, 'cenital_olivo.png', 'cenital'),
(12, 2, 1, 'termica_olivo2.png', 'termica'),
(13, 2, 1, 'cenital_olivo2.png', 'cenital'),
(14, 2, 1, 'termica_olivo3.png', 'termica'),
(15, 2, 1, 'cenital_olivo3.png', 'cenital'),
(16, 2, 1, 'Olivo.png', 'imagen'),
(17, 2, 1, 'Olivo2.png', 'imagen'),
(18, 2, 1, 'olivo3.png', 'imagen'),
(19, 3, 1, 'termica_olivo.png', 'termica'),
(20, 3, 1, 'cenital_olivo.png', 'cenital'),
(21, 3, 1, 'termica_olivo2.png', 'termica'),
(22, 3, 1, 'cenital_olivo2.png', 'cenital'),
(23, 3, 1, 'termica_olivo3.png', 'termica'),
(24, 3, 1, 'cenital_olivo3.png', 'cenital'),
(25, 3, 1, 'Olivo.png', 'imagen'),
(26, 3, 1, 'Olivo2.png', 'imagen'),
(27, 3, 1, 'olivo3.png', 'imagen'),
(28, 4, 1, 'termica_olivo.png', 'termica'),
(29, 4, 1, 'cenital_olivo.png', 'cenital'),
(30, 4, 1, 'termica_olivo2.png', 'termica'),
(31, 4, 1, 'cenital_olivo2.png', 'cenital'),
(32, 4, 1, 'termica_olivo3.png', 'termica'),
(33, 4, 1, 'cenital_olivo3.png', 'cenital'),
(34, 4, 1, 'Olivo.png', 'imagen'),
(35, 4, 1, 'Olivo2.png', 'imagen'),
(36, 4, 1, 'olivo3.png', 'imagen'),
(37, 1, 2, 'termica_olivo.png', 'termica'),
(38, 1, 2, 'cenital_olivo.png', 'cenital'),
(39, 1, 2, 'termica_olivo2.png', 'termica'),
(40, 1, 2, 'cenital_olivo2.png', 'cenital'),
(41, 1, 2, 'termica_olivo3.png', 'termica'),
(42, 1, 2, 'cenital_olivo3.png', 'cenital'),
(43, 1, 2, 'Olivo.png', 'imagen'),
(44, 1, 2, 'Olivo2.png', 'imagen'),
(45, 1, 2, 'olivo3.png', 'imagen'),
(46, 2, 2, 'termica_olivo.png', 'termica'),
(47, 2, 2, 'cenital_olivo.png', 'cenital'),
(48, 2, 2, 'termica_olivo2.png', 'termica'),
(49, 2, 2, 'cenital_olivo2.png', 'cenital'),
(50, 2, 2, 'termica_olivo3.png', 'termica'),
(51, 2, 2, 'cenital_olivo3.png', 'cenital'),
(52, 2, 2, 'Olivo.png', 'imagen'),
(53, 2, 2, 'Olivo2.png', 'imagen'),
(54, 2, 2, 'olivo3.png', 'imagen'),
(55, 3, 2, 'termica_olivo.png', 'termica'),
(56, 3, 2, 'cenital_olivo.png', 'cenital'),
(57, 3, 2, 'termica_olivo2.png', 'termica'),
(58, 3, 2, 'cenital_olivo2.png', 'cenital'),
(59, 3, 2, 'termica_olivo3.png', 'termica'),
(60, 3, 2, 'cenital_olivo3.png', 'cenital'),
(61, 3, 2, 'Olivo.png', 'imagen'),
(62, 3, 2, 'Olivo2.png', 'imagen'),
(63, 3, 2, 'olivo3.png', 'imagen');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incidencia`
--

CREATE TABLE `incidencia` (
  `id` int(11) NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `incidencia`
--

INSERT INTO `incidencia` (`id`, `descripcion`) VALUES
(100, 'Uso SIGPAC validado por fotointerpretación Control Teledetección 2019');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `olivo`
--

CREATE TABLE `olivo` (
  `id_Olivo` int(11) NOT NULL,
  `altura` float NOT NULL,
  `F_plantacion` date NOT NULL,
  `id_Parcela` int(11) NOT NULL,
  `Coordenada_X` float NOT NULL,
  `Coordenada_Y` float NOT NULL,
  `Coordenada_Z` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `olivo`
--

INSERT INTO `olivo` (`id_Olivo`, `altura`, `F_plantacion`, `id_Parcela`, `Coordenada_X`, `Coordenada_Y`, `Coordenada_Z`) VALUES
(1, 1.9, '2021-11-17', 2, -9, 1, -15),
(1, 3, '2022-04-12', 211, 9, 1, 4.7),
(2, 3.5, '2021-08-17', 2, -17, 1, -20),
(2, 2.8, '2022-02-02', 211, 17, 1, 4.5),
(3, 3.2, '2021-12-09', 2, -21, 1, -8),
(3, 1.5, '2022-02-16', 211, 21, 1, -8),
(4, 2.5, '2020-05-05', 211, 15, 1, 8),
(5, 2.8, '2019-06-04', 211, -9, 1, -15),
(6, 3, '2021-06-15', 211, -21, 1, -8),
(7, 3.1, '2019-06-30', 211, -17, 1, -20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `parcela`
--

CREATE TABLE `parcela` (
  `id_Parcela` int(11) NOT NULL,
  `nombre` varchar(10) NOT NULL,
  `Municipio` varchar(10) NOT NULL,
  `ReferenciaCatastral` varchar(30) NOT NULL,
  `imagen` varchar(20) NOT NULL,
  `Provincia` varchar(20) NOT NULL,
  `fecha_vuelo` date DEFAULT NULL,
  `fecha_actualizacion` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `parcela`
--

INSERT INTO `parcela` (`id_Parcela`, `nombre`, `Municipio`, `ReferenciaCatastral`, `imagen`, `Provincia`, `fecha_vuelo`, `fecha_actualizacion`) VALUES
(2, 'Parcela_2', 'Andujar', '23900A03500147SL', 'Parcela2.png', 'Jaén', '2022-06-25', '2022-06-28'),
(211, 'Parcela_1', 'Marmolejo', '23059A00600211AO', 'ortofoto_1.png', 'Jaén', '2019-07-01', '2015-05-20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `contraseña` varchar(10) NOT NULL,
  `permisos` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `usuario`, `contraseña`, `permisos`) VALUES
(1, 'Pablo', '12345', 'ADMIN'),
(2, 'admin', 'admin', 'ADMIN'),
(3, 'cliente', '00000', 'USER');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zona`
--

CREATE TABLE `zona` (
  `id_zona` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `Codigo` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `zona`
--

INSERT INTO `zona` (`id_zona`, `nombre`, `Codigo`) VALUES
(1, 'Olivar', 'OV'),
(2, 'Viales', 'CA'),
(3, 'Improductivos', 'IM'),
(4, 'Pastizal', 'PS'),
(5, 'Forestal', 'FO'),
(6, 'Zona Urbana', 'ZU'),
(7, 'Edificaciones', 'ED'),
(8, 'Pasto Arbustivo', 'PR'),
(9, 'Pasto con Arbolado', 'PA'),
(10, 'Tierras Arables', 'TA'),
(11, 'Huerta', 'TH'),
(12, 'Frutales', 'FY'),
(13, 'Corrientes y Superficies de Agua', 'AG');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zona_incidencia`
--

CREATE TABLE `zona_incidencia` (
  `id` int(11) NOT NULL,
  `id_zona` int(11) NOT NULL,
  `id_incidencia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `zona_incidencia`
--

INSERT INTO `zona_incidencia` (`id`, `id_zona`, `id_incidencia`) VALUES
(1, 1, 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zona_parcela`
--

CREATE TABLE `zona_parcela` (
  `id` int(11) NOT NULL,
  `id_parcela` int(11) NOT NULL,
  `id_zona` int(11) NOT NULL,
  `pendiente` float NOT NULL,
  `superficie` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `zona_parcela`
--

INSERT INTO `zona_parcela` (`id`, `id_parcela`, `id_zona`, `pendiente`, `superficie`) VALUES
(1, 211, 1, 9.5, 1.0558),
(2, 211, 3, 7.9, 0.0663);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `incidencia`
--
ALTER TABLE `incidencia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `olivo`
--
ALTER TABLE `olivo`
  ADD PRIMARY KEY (`id_Olivo`,`id_Parcela`) USING BTREE,
  ADD KEY `Clave_Foranea_Olivo` (`id_Parcela`);

--
-- Indices de la tabla `parcela`
--
ALTER TABLE `parcela`
  ADD PRIMARY KEY (`id_Parcela`),
  ADD KEY `fk_ubicacion` (`Municipio`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `zona`
--
ALTER TABLE `zona`
  ADD PRIMARY KEY (`id_zona`);

--
-- Indices de la tabla `zona_incidencia`
--
ALTER TABLE `zona_incidencia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_zona_parcela` (`id_zona`),
  ADD KEY `fk_incidencia` (`id_incidencia`);

--
-- Indices de la tabla `zona_parcela`
--
ALTER TABLE `zona_parcela`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_zona` (`id_zona`),
  ADD KEY `fk_parcela` (`id_parcela`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `incidencia`
--
ALTER TABLE `incidencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT de la tabla `olivo`
--
ALTER TABLE `olivo`
  MODIFY `id_Olivo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `parcela`
--
ALTER TABLE `parcela`
  MODIFY `id_Parcela` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `zona`
--
ALTER TABLE `zona`
  MODIFY `id_zona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `zona_incidencia`
--
ALTER TABLE `zona_incidencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `zona_parcela`
--
ALTER TABLE `zona_parcela`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `olivo`
--
ALTER TABLE `olivo`
  ADD CONSTRAINT `Clave_Foranea_Olivo` FOREIGN KEY (`id_Parcela`) REFERENCES `parcela` (`id_Parcela`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `zona_incidencia`
--
ALTER TABLE `zona_incidencia`
  ADD CONSTRAINT `fk_incidencia` FOREIGN KEY (`id_incidencia`) REFERENCES `incidencia` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_zona_parcela` FOREIGN KEY (`id_zona`) REFERENCES `zona_parcela` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `zona_parcela`
--
ALTER TABLE `zona_parcela`
  ADD CONSTRAINT `fk_parcela` FOREIGN KEY (`id_parcela`) REFERENCES `parcela` (`id_Parcela`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_zona` FOREIGN KEY (`id_zona`) REFERENCES `zona` (`id_zona`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
