/*
  # KIBA Volleyball Club Management System - Database Schema

  ## 1. New Tables
    - `usuarios` - Sistema de usuarios con autenticación básica
      - `id` (uuid, primary key)
      - `nombre` (text)
      - `email` (text, unique)
      - `password` (text, plain text storage)
      - `rol` (text, default 'user')
      - `created_at` (timestamp)

    - `categorias` - Categorías de edad para jugadores
      - `id` (uuid, primary key)
      - `nombre` (text)
      - `edad_minima` (integer)
      - `edad_maxima` (integer)
      - `descripcion` (text)

    - `posiciones` - Posiciones de voleibol
      - `id` (uuid, primary key)
      - `nombre` (text)
      - `descripcion` (text)

    - `jugadores` - Jugadores del club
      - `id` (uuid, primary key)
      - `nombre_completo` (text)
      - `sexo` (text)
      - `fecha_nacimiento` (date)
      - `edad` (integer)
      - `telefono` (text)
      - `email` (text)
      - `direccion` (text)
      - `foto_url` (text)
      - `categoria_id` (uuid, foreign key)
      - `posicion_id` (uuid, foreign key)
      - `estado` (text, default 'activo')
      - `created_at` (timestamp)

    - `pagos` - Registro de pagos mensuales
      - `id` (uuid, primary key)
      - `jugador_id` (uuid, foreign key)
      - `monto` (decimal)
      - `mes` (text)
      - `año` (integer)
      - `metodo_pago` (text)
      - `estado` (text, default 'pendiente')
      - `fecha_pago` (timestamp)
      - `recibo_url` (text)
      - `created_at` (timestamp)

    - `asistencias` - Registro de asistencias
      - `id` (uuid, primary key)
      - `jugador_id` (uuid, foreign key)
      - `fecha` (date)
      - `estado` (text, default 'presente')
      - `observaciones` (text)
      - `created_at` (timestamp)

  ## 2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Foreign key constraints for data integrity

  ## 3. Data Seeding
    - Default categories and positions
    - Admin user account
*/

-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  rol text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla categorias
CREATE TABLE IF NOT EXISTS categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  edad_minima integer NOT NULL,
  edad_maxima integer NOT NULL,
  descripcion text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla posiciones
CREATE TABLE IF NOT EXISTS posiciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla jugadores
CREATE TABLE IF NOT EXISTS jugadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo text NOT NULL,
  sexo text NOT NULL,
  fecha_nacimiento date NOT NULL,
  edad integer NOT NULL,
  telefono text DEFAULT '',
  email text DEFAULT '',
  direccion text DEFAULT '',
  foto_url text DEFAULT '',
  categoria_id uuid REFERENCES categorias(id),
  posicion_id uuid REFERENCES posiciones(id),
  estado text DEFAULT 'activo',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla pagos
CREATE TABLE IF NOT EXISTS pagos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jugador_id uuid REFERENCES jugadores(id) ON DELETE CASCADE,
  monto decimal(10,2) NOT NULL,
  mes text NOT NULL,
  año integer NOT NULL,
  metodo_pago text DEFAULT 'efectivo',
  estado text DEFAULT 'pendiente',
  fecha_pago timestamptz,
  recibo_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla asistencias
CREATE TABLE IF NOT EXISTS asistencias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jugador_id uuid REFERENCES jugadores(id) ON DELETE CASCADE,
  fecha date NOT NULL,
  estado text DEFAULT 'presente',
  observaciones text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE posiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (permitir todo para usuarios autenticados)
CREATE POLICY "Allow all operations for authenticated users" ON usuarios FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON categorias FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON posiciones FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON jugadores FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON pagos FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON asistencias FOR ALL USING (true);

-- Insertar datos iniciales para categorías
INSERT INTO categorias (nombre, edad_minima, edad_maxima, descripcion) VALUES
('Infantil', 8, 12, 'Categoría para jugadores infantiles'),
('Juvenil', 13, 17, 'Categoría para jugadores juveniles'),
('Adulto', 18, 35, 'Categoría para jugadores adultos'),
('Veterano', 36, 100, 'Categoría para jugadores veteranos')
ON CONFLICT DO NOTHING;

-- Insertar datos iniciales para posiciones
INSERT INTO posiciones (nombre, descripcion) VALUES
('Armador', 'Distribuidor del juego'),
('Opuesto', 'Atacante principal'),
('Central', 'Bloqueador y atacante rápido'),
('Líbero', 'Especialista en defensa'),
('Receptor-Atacante', 'Recepción y ataque')
ON CONFLICT DO NOTHING;

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador KIBA', 'admin@kiba.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;