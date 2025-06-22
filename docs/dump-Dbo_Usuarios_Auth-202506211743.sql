--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.2

-- Started on 2025-06-21 17:43:04 -03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16479)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4519 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 7 (class 2615 OID 16509)
-- Name: restaurant; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA restaurant;


ALTER SCHEMA restaurant OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16492)
-- Name: usuario; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.usuario (
    id_usuario integer NOT NULL,
    nombre text NOT NULL,
    correo text NOT NULL,
    password text NOT NULL,
    id_tipousuario integer NOT NULL,
    estado integer DEFAULT 1 NOT NULL,
    id_restaurante integer,
    CONSTRAINT usuario_estado_check CHECK ((estado = ANY (ARRAY[0, 1])))
);


ALTER TABLE auth.usuario OWNER TO postgres;

--
-- TOC entry 247 (class 1255 OID 16652)
-- Name: sp_create_usuario(text, text, text, integer); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.sp_create_usuario(p_nombre text, p_correo text, p_password text, p_tipousuario_id integer) RETURNS auth.usuario
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_usuario auth.usuario;
BEGIN
  -- Verificar si ya existe un usuario con ese correo
  IF EXISTS (
    SELECT 1 FROM auth.usuario WHERE correo = p_correo
  ) THEN
    RAISE EXCEPTION 'Correo ya registrado';
  END IF;

  -- Insertar el usuario y capturar el registro completo
  INSERT INTO auth.usuario (
    nombre, correo, password, id_tipousuario, estado
  )
  VALUES (
    p_nombre, p_correo, p_password, p_tipousuario_id, 1
  )
  RETURNING * INTO v_usuario;

  RETURN v_usuario;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creando usuario: %', SQLERRM;
END;
$$;


ALTER FUNCTION auth.sp_create_usuario(p_nombre text, p_correo text, p_password text, p_tipousuario_id integer) OWNER TO postgres;

--
-- TOC entry 250 (class 1255 OID 16657)
-- Name: sp_obtener_perfil_usuario(integer); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.sp_obtener_perfil_usuario(p_id_usuario integer) RETURNS TABLE(id_usuario integer, nombre text, correo text, estado integer, tipo_usuario text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id_usuario,
    u.nombre,
    u.correo,
    u.estado,
    t.descripcion
  FROM auth.usuario u
  JOIN auth.tipousuario t ON t.id_tipousuario = u.id_tipousuario
  WHERE u.id_usuario = p_id_usuario;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario con ID % no encontrado', p_id_usuario;
  END IF;
END;
$$;


ALTER FUNCTION auth.sp_obtener_perfil_usuario(p_id_usuario integer) OWNER TO postgres;

--
-- TOC entry 251 (class 1255 OID 16659)
-- Name: sp_obtener_todos_usuarios(); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.sp_obtener_todos_usuarios() RETURNS TABLE(id_usuario integer, nombre text, correo text, estado integer, tipo_usuario text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id_usuario::INT,
    u.nombre::TEXT,
    u.correo::TEXT,
    u.estado::INT,
    t.descripcion::TEXT AS tipo_usuario
  FROM auth.usuario u
  JOIN auth.tipousuario t ON t.id_tipousuario = u.id_tipousuario
  ORDER BY u.id_usuario;
END;
$$;


ALTER FUNCTION auth.sp_obtener_todos_usuarios() OWNER TO postgres;

--
-- TOC entry 264 (class 1255 OID 16661)
-- Name: sp_set_inactivo_usuario(integer); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.sp_set_inactivo_usuario(p_id_usuario integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE auth.usuario
  SET estado = 0
  WHERE id_usuario = p_id_usuario;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario con ID % no encontrado', p_id_usuario;
  END IF;
END;
$$;


ALTER FUNCTION auth.sp_set_inactivo_usuario(p_id_usuario integer) OWNER TO postgres;

--
-- TOC entry 249 (class 1255 OID 16656)
-- Name: sp_update_password(integer, text); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.sp_update_password(p_id_usuario integer, p_new_password text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_usuario auth.usuario;
BEGIN
  SELECT * INTO v_usuario
  FROM auth.usuario
  WHERE id_usuario = p_id_usuario;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario con ID % no encontrado', p_id_usuario;
  END IF;

  IF v_usuario.password = p_new_password THEN
    RAISE EXCEPTION 'La nueva contraseña no puede ser igual a la anterior';
  END IF;

  UPDATE auth.usuario
  SET password = p_new_password
  WHERE id_usuario = p_id_usuario;
END;
$$;


ALTER FUNCTION auth.sp_update_password(p_id_usuario integer, p_new_password text) OWNER TO postgres;

--
-- TOC entry 287 (class 1255 OID 16745)
-- Name: sp_update_perfil_usuario(integer, text, text); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.sp_update_perfil_usuario(p_id_usuario integer, p_nombre text, p_correo text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE usuarios
  SET nombre = p_nombre,
      correo = p_correo
  WHERE id_usuario = p_id_usuario;
END;
$$;


ALTER FUNCTION auth.sp_update_perfil_usuario(p_id_usuario integer, p_nombre text, p_correo text) OWNER TO postgres;

--
-- TOC entry 4520 (class 0 OID 0)
-- Dependencies: 287
-- Name: FUNCTION sp_update_perfil_usuario(p_id_usuario integer, p_nombre text, p_correo text); Type: COMMENT; Schema: auth; Owner: postgres
--

COMMENT ON FUNCTION auth.sp_update_perfil_usuario(p_id_usuario integer, p_nombre text, p_correo text) IS 'Actualiza nombre y correo del usuario logueado';


--
-- TOC entry 248 (class 1255 OID 16654)
-- Name: sp_update_usuario(integer, text, text, integer); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.sp_update_usuario(p_id_usuario integer, p_nombre text, p_correo text, p_tipousuario_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE auth.usuario
  SET nombre = p_nombre,
      correo = p_correo,
      id_tipousuario = p_tipousuario_id
  WHERE id_usuario = p_id_usuario;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario con ID % no encontrado', p_id_usuario;
  END IF;
END;
$$;


ALTER FUNCTION auth.sp_update_usuario(p_id_usuario integer, p_nombre text, p_correo text, p_tipousuario_id integer) OWNER TO postgres;

--
-- TOC entry 262 (class 1255 OID 16660)
-- Name: sp_update_usuario(integer, text, text, integer, integer); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.sp_update_usuario(p_id_usuario integer, p_nombre text, p_correo text, p_tipousuario_id integer, p_estado integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE auth.usuario
  SET nombre = p_nombre,
      correo = p_correo,
      id_tipousuario = p_tipousuario_id,
      estado = p_estado
  WHERE id_usuario = p_id_usuario;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario con ID % no encontrado', p_id_usuario;
  END IF;
END;
$$;


ALTER FUNCTION auth.sp_update_usuario(p_id_usuario integer, p_nombre text, p_correo text, p_tipousuario_id integer, p_estado integer) OWNER TO postgres;

--
-- TOC entry 280 (class 1255 OID 16729)
-- Name: deshabilitar_metodo_pago(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.deshabilitar_metodo_pago(p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_result JSON;
    v_estado INTEGER;
BEGIN
    BEGIN
        -- Verificar si el método de pago existe y obtener su estado actual
        SELECT estado INTO v_estado
        FROM restaurant.metodo_pago
        WHERE id_metodo = p_id;
        
        -- Verificar si se encontró el método de pago
        IF NOT FOUND THEN
            RETURN json_build_object(
                'success', 0,
                'message', 'Error: El método de pago con ID ' || p_id || ' no existe',
                'id', NULL
            );
        END IF;
        
        -- Verificar si ya está deshabilitado
        IF v_estado = 0 THEN
            RETURN json_build_object(
                'success', 0,
                'message', 'El método de pago ya está deshabilitado',
                'id', p_id
            );
        END IF;
        
        -- Deshabilitar el método de pago (cambiar estado a 0)
        UPDATE restaurant.metodo_pago
        SET estado = 0
        WHERE id_metodo = p_id;
        
        -- Verificar si se actualizó correctamente (debería ser siempre verdadero en este punto)
        IF FOUND THEN
            v_result := json_build_object(
                'success', 1,
                'message', 'Método de pago deshabilitado exitosamente',
                'id', p_id
            );
        ELSE
            v_result := json_build_object(
                'success', 0,
                'message', 'Error al deshabilitar el método de pago',
                'id', p_id
            );
        END IF;
        
        RETURN v_result;
        
    EXCEPTION WHEN OTHERS THEN
        -- Capturar cualquier error y devolver un mensaje
        v_result := json_build_object(
            'success', 0,
            'message', 'Error: ' || SQLERRM,
            'id', NULL
        );
        
        RETURN v_result;
    END;
END;
$$;


ALTER FUNCTION public.deshabilitar_metodo_pago(p_id integer) OWNER TO postgres;

--
-- TOC entry 295 (class 1255 OID 16761)
-- Name: sp_cancelar_pago(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_cancelar_pago(p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_result JSON;
BEGIN
  BEGIN
    -- Verificar si existe el pago
    IF NOT EXISTS (
      SELECT 1 FROM restaurant.pago WHERE id_pago = p_id
    ) THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El pago con ID ' || p_id || ' no existe',
        'id', NULL
      );
    END IF;

    -- Cancelar: setear estado a 0
    UPDATE restaurant.pago
    SET estado = 0
    WHERE id_pago = p_id;

    RETURN json_build_object(
      'success', 1,
      'message', 'Pago cancelado exitosamente',
      'id', p_id
    );

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION public.sp_cancelar_pago(p_id integer) OWNER TO postgres;

--
-- TOC entry 281 (class 1255 OID 16730)
-- Name: sp_guardar_metodo_pago(integer, character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_guardar_metodo_pago(p_id integer DEFAULT NULL::integer, p_nombre character varying DEFAULT NULL::character varying, p_estado integer DEFAULT 1) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id INTEGER;
    v_result JSON;
    v_existe_nombre BOOLEAN;
    v_nombre_actual VARCHAR;
BEGIN
    BEGIN
        -- Validación de parámetros
        IF p_nombre IS NULL THEN
            RETURN json_build_object(
                'success', 0,
                'message', 'Error: El nombre del método de pago no puede ser nulo',
                'id', NULL
            );
        END IF;

        -- Validar que el estado sea 0 o 1
        IF p_estado IS NOT NULL AND p_estado NOT IN (0, 1) THEN
            RETURN json_build_object(
                'success', 0,
                'message', 'Error: El estado debe ser 0 (inactivo) o 1 (activo)',
                'id', NULL
            );
        END IF;

        -- Verificar si ya existe un método de pago con el mismo nombre
        IF p_id IS NULL THEN
            -- Para INSERT, verificar que no exista ningún registro con ese nombre
            SELECT EXISTS(
                SELECT 1 
                FROM restaurant.metodo_pago 
                WHERE nombre = p_nombre
            ) INTO v_existe_nombre;

            IF v_existe_nombre THEN
                RETURN json_build_object(
                    'success', 0,
                    'message', 'Error: Ya existe un método de pago con el nombre "' || p_nombre || '"',
                    'id', NULL
                );
            END IF;
        ELSE
            -- Para UPDATE, verificar si realmente se intenta cambiar el nombre
            SELECT nombre INTO v_nombre_actual
            FROM restaurant.metodo_pago
            WHERE id_metodo = p_id;

            IF v_nombre_actual IS DISTINCT FROM p_nombre THEN
                SELECT EXISTS(
                    SELECT 1 
                    FROM restaurant.metodo_pago 
                    WHERE nombre = p_nombre AND id_metodo != p_id
                ) INTO v_existe_nombre;

                IF v_existe_nombre THEN
                    RETURN json_build_object(
                        'success', 0,
                        'message', 'Error: Ya existe otro método de pago con el nombre "' || p_nombre || '"',
                        'id', NULL
                    );
                END IF;
            END IF;
        END IF;

        -- Verificar si es una operación de insert o update
        IF p_id IS NULL THEN
            -- INSERT: Crear nuevo método de pago
            INSERT INTO restaurant.metodo_pago(nombre, estado)
            VALUES (p_nombre, p_estado)
            RETURNING id_metodo INTO v_id;

            v_result := json_build_object(
                'success', 1,
                'message', 'Método de pago creado exitosamente',
                'id', v_id
            );
        ELSE
            -- UPDATE: Actualizar método de pago existente
            UPDATE restaurant.metodo_pago
            SET nombre = p_nombre,
                estado = p_estado
            WHERE id_metodo = p_id;

            IF FOUND THEN
                v_result := json_build_object(
                    'success', 1,
                    'message', 'Método de pago actualizado exitosamente',
                    'id', p_id
                );
            ELSE
                v_result := json_build_object(
                    'success', 0,
                    'message', 'Error: El método de pago con ID ' || p_id || ' no existe',
                    'id', NULL
                );
            END IF;
        END IF;

        RETURN v_result;

    EXCEPTION WHEN OTHERS THEN
        v_result := json_build_object(
            'success', 0,
            'message', 'Error: ' || SQLERRM,
            'id', NULL
        );
        RETURN v_result;
    END;
END;
$$;


ALTER FUNCTION public.sp_guardar_metodo_pago(p_id integer, p_nombre character varying, p_estado integer) OWNER TO postgres;

--
-- TOC entry 304 (class 1255 OID 16769)
-- Name: sp_guardar_pago(integer, integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_guardar_pago(p_id integer DEFAULT NULL::integer, p_id_pedido integer DEFAULT NULL::integer, p_id_metodo integer DEFAULT NULL::integer, p_estado integer DEFAULT 1) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id INTEGER;
  v_result JSON;
  v_monto NUMERIC(10,2);
BEGIN
  BEGIN
    -- Validar existencia del pedido y obtener el monto
    SELECT precio INTO v_monto
    FROM restaurant.pedido
    WHERE id_pedido = p_id_pedido;

    IF NOT FOUND THEN
      RETURN json_build_object('success', 0, 'message', 'Error: El pedido no existe', 'id', NULL);
    END IF;

    IF v_monto IS NULL OR v_monto <= 0 THEN
      RETURN json_build_object('success', 0, 'message', 'Error: El pedido no tiene un monto válido', 'id', NULL);
    END IF;

    -- Validar método de pago
    IF NOT EXISTS (
      SELECT 1 FROM restaurant.metodo_pago WHERE id_metodo = p_id_metodo
    ) THEN
      RETURN json_build_object('success', 0, 'message', 'Error: El método de pago no existe', 'id', NULL);
    END IF;

    IF p_estado NOT IN (0, 1) THEN
      RETURN json_build_object('success', 0, 'message', 'Error: Estado inválido', 'id', NULL);
    END IF;

    -- Insert o update
    IF p_id IS NULL THEN
      INSERT INTO restaurant.pago(id_pedido, fecha, monto, estado, id_metodo)
      VALUES (p_id_pedido, NOW(), v_monto, p_estado, p_id_metodo)
      RETURNING id_pago INTO v_id;

      -- Si el pago es activo, actualizar el estado del pedido
      IF p_estado = 1 THEN
        UPDATE restaurant.pedido
        SET estado = 2  -- pagado
        WHERE id_pedido = p_id_pedido;
      END IF;

    ELSE
      UPDATE restaurant.pago
      SET estado = p_estado
      WHERE id_pago = p_id
      RETURNING id_pago INTO v_id;

      -- Si se reactivó el pago, también marcamos el pedido como pagado
      IF p_estado = 1 THEN
        UPDATE restaurant.pedido
        SET estado = 2
        WHERE id_pedido = p_id_pedido;
      END IF;
    END IF;

    RETURN json_build_object(
      'success', 1,
      'message', 'Pago registrado correctamente',
      'id', v_id
    );

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION public.sp_guardar_pago(p_id integer, p_id_pedido integer, p_id_metodo integer, p_estado integer) OWNER TO postgres;

--
-- TOC entry 313 (class 1255 OID 16796)
-- Name: sp_habilitar_metodo_pago(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_habilitar_metodo_pago(p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_result JSON;
    v_estado INTEGER;
BEGIN
    BEGIN
        -- Verificar si el método de pago existe y obtener su estado actual
        SELECT estado INTO v_estado
        FROM restaurant.metodo_pago
        WHERE id_metodo = p_id;

        IF NOT FOUND THEN
            RETURN json_build_object(
                'success', 0,
                'message', 'Error: El método de pago con ID ' || p_id || ' no existe',
                'id', NULL
            );
        END IF;

        -- Verificar si ya está habilitado
        IF v_estado = 1 THEN
            RETURN json_build_object(
                'success', 0,
                'message', 'El método de pago ya está habilitado',
                'id', p_id
            );
        END IF;

        -- Habilitar el método de pago (estado = 1)
        UPDATE restaurant.metodo_pago
        SET estado = 1
        WHERE id_metodo = p_id;

        IF FOUND THEN
            v_result := json_build_object(
                'success', 1,
                'message', 'Método de pago habilitado exitosamente',
                'id', p_id
            );
        ELSE
            v_result := json_build_object(
                'success', 0,
                'message', 'Error al habilitar el método de pago',
                'id', p_id
            );
        END IF;

        RETURN v_result;

    EXCEPTION WHEN OTHERS THEN
        v_result := json_build_object(
            'success', 0,
            'message', 'Error: ' || SQLERRM,
            'id', NULL
        );
        RETURN v_result;
    END;
END;
$$;


ALTER FUNCTION public.sp_habilitar_metodo_pago(p_id integer) OWNER TO postgres;

--
-- TOC entry 314 (class 1255 OID 16732)
-- Name: sp_listar_metodos_pago(character varying, integer, character varying, character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_metodos_pago(p_busqueda character varying DEFAULT NULL::character varying, p_estado integer DEFAULT NULL::integer, p_orden_col character varying DEFAULT 'nombre'::character varying, p_orden_dir character varying DEFAULT 'ASC'::character varying, p_page_index integer DEFAULT 1, p_page_size integer DEFAULT 10) RETURNS TABLE(id_metodo integer, nombre character varying, estado integer, total_rows bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.id_metodo,
        mp.nombre,
        mp.estado,
        COUNT(*) OVER() AS total_rows
    FROM restaurant.metodo_pago mp
    WHERE 
        (p_busqueda IS NULL OR mp.nombre ILIKE '%' || p_busqueda || '%')
        AND (
            p_estado IS NULL OR mp.estado = p_estado
        )
    ORDER BY 
        CASE WHEN p_orden_col = 'nombre' AND p_orden_dir = 'ASC' THEN mp.nombre END ASC,
        CASE WHEN p_orden_col = 'nombre' AND p_orden_dir = 'DESC' THEN mp.nombre END DESC
    OFFSET (p_page_index - 1) * p_page_size
    LIMIT p_page_size;
END;
$$;


ALTER FUNCTION public.sp_listar_metodos_pago(p_busqueda character varying, p_estado integer, p_orden_col character varying, p_orden_dir character varying, p_page_index integer, p_page_size integer) OWNER TO postgres;

--
-- TOC entry 305 (class 1255 OID 16770)
-- Name: sp_listar_pagos(character varying, integer, character varying, character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_pagos(p_busqueda character varying DEFAULT NULL::character varying, p_estado integer DEFAULT NULL::integer, p_orden_col character varying DEFAULT 'id_pago'::character varying, p_orden_dir character varying DEFAULT 'DESC'::character varying, p_page_index integer DEFAULT 1, p_page_size integer DEFAULT 10) RETURNS TABLE(id_pago integer, id_pedido integer, fecha timestamp without time zone, monto numeric, estado integer, id_metodo integer, nombre_metodo character varying, metodo_estado integer, pedido_cantidad integer, pedido_precio numeric, total_rows bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id_pago,
    p.id_pedido,
    p.fecha,
    p.monto,
    p.estado,
    p.id_metodo,
    m.nombre,
    m.estado,
    ped.cantidad,
    ped.precio,
    COUNT(*) OVER() AS total_rows
  FROM restaurant.pago p
  INNER JOIN restaurant.metodo_pago m ON m.id_metodo = p.id_metodo
  INNER JOIN restaurant.pedido ped ON ped.id_pedido = p.id_pedido
  WHERE
    (p_busqueda IS NULL OR m.nombre ILIKE '%' || p_busqueda || '%')
    AND (
      p_estado IS NULL OR p.estado = p_estado 
    )
  ORDER BY
    CASE WHEN p_orden_col = 'id_pago' AND p_orden_dir = 'ASC' THEN p.id_pago END ASC,
  CASE WHEN p_orden_col = 'id_pago' AND p_orden_dir = 'DESC' THEN p.id_pago END DESC,

  CASE WHEN p_orden_col = 'nombre_metodo' AND p_orden_dir = 'ASC' THEN m.nombre END ASC,
  CASE WHEN p_orden_col = 'nombre_metodo' AND p_orden_dir = 'DESC' THEN m.nombre END DESC,

  CASE WHEN p_orden_col = 'fecha' AND p_orden_dir = 'ASC' THEN p.fecha END ASC,
  CASE WHEN p_orden_col = 'fecha' AND p_orden_dir = 'DESC' THEN p.fecha END DESC,

  CASE WHEN p_orden_col = 'monto' AND p_orden_dir = 'ASC' THEN p.monto END ASC,
  CASE WHEN p_orden_col = 'monto' AND p_orden_dir = 'DESC' THEN p.monto END DESC
  OFFSET (p_page_index - 1) * p_page_size
  LIMIT p_page_size;
END;
$$;


ALTER FUNCTION public.sp_listar_pagos(p_busqueda character varying, p_estado integer, p_orden_col character varying, p_orden_dir character varying, p_page_index integer, p_page_size integer) OWNER TO postgres;

--
-- TOC entry 300 (class 1255 OID 16765)
-- Name: sp_listar_reservas(character varying, integer, character varying, character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_reservas(p_busqueda character varying DEFAULT NULL::character varying, p_estado integer DEFAULT NULL::integer, p_orden_col character varying DEFAULT 'id_reserva'::character varying, p_orden_dir character varying DEFAULT 'DESC'::character varying, p_page_index integer DEFAULT 1, p_page_size integer DEFAULT 10) RETURNS TABLE(id_reserva integer, fecha date, hora time without time zone, id_mesa integer, numero_mesa integer, descripcion_mesa character varying, id_usuario integer, nombre_usuario character varying, tipo_usuario character varying, estado integer, total_rows bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id_reserva,
    r.fecha,
    r.hora,
    m.id_mesa,
    m.numero,
    m.descripcion,
    u.id_usuario,
    u.nombre,
    tu.descripcion,
    r.estado,
    COUNT(*) OVER() AS total_rows
  FROM restaurant.reserva r
  INNER JOIN restaurant.mesa m ON m.id_mesa = r.id_mesa
  INNER JOIN auth.usuario u ON u.id_usuario = r.id_usuario
  INNER JOIN auth.tipousuario tu ON tu.id_tipousuario = u.id_tipousuario
  WHERE
    (p_busqueda IS NULL OR u.nombre ILIKE '%' || p_busqueda || '%')
    AND (
      (p_estado IS NOT NULL AND r.estado = p_estado)
      OR (p_estado IS NULL AND r.estado = 1)
    )
  ORDER BY
    CASE WHEN p_orden_col = 'id_reserva' AND p_orden_dir = 'ASC' THEN r.id_reserva END ASC,
    CASE WHEN p_orden_col = 'id_reserva' AND p_orden_dir = 'DESC' THEN r.id_reserva END DESC,
    CASE WHEN p_orden_col = 'nombre_usuario' AND p_orden_dir = 'ASC' THEN u.nombre END ASC,
    CASE WHEN p_orden_col = 'nombre_usuario' AND p_orden_dir = 'DESC' THEN u.nombre END DESC
  OFFSET (p_page_index - 1) * p_page_size
  LIMIT p_page_size;
END;
$$;


ALTER FUNCTION public.sp_listar_reservas(p_busqueda character varying, p_estado integer, p_orden_col character varying, p_orden_dir character varying, p_page_index integer, p_page_size integer) OWNER TO postgres;

--
-- TOC entry 309 (class 1255 OID 16790)
-- Name: actualizar_estado_pedido(integer, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.actualizar_estado_pedido(p_id integer, p_nuevo_estado integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_result JSON;
  v_estado_actual INTEGER;
BEGIN
  BEGIN
    -- 1. Verificar si el pedido existe
    SELECT estado INTO v_estado_actual
    FROM restaurant.pedido
    WHERE id_pedido = p_id;

    IF NOT FOUND THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'El pedido con ID ' || p_id || ' no existe',
        'id', NULL
      );
    END IF;

    -- 2. Validar transición de estado (opcional pero recomendable)
    IF v_estado_actual = 0 THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'No se puede cambiar el estado desde "cancelado"',
        'id', p_id
      );
    END IF;

    -- Evitar redundancia si ya está en el estado solicitado
    IF v_estado_actual = p_nuevo_estado THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'El pedido ya se encuentra en ese estado',
        'id', p_id
      );
    END IF;

    -- 3. Actualizar el estado
    UPDATE restaurant.pedido
    SET estado = p_nuevo_estado
    WHERE id_pedido = p_id;

    IF FOUND THEN
      v_result := json_build_object(
        'success', 1,
        'message', 'Estado del pedido actualizado a ' || p_nuevo_estado,
        'id', p_id
      );
    ELSE
      v_result := json_build_object(
        'success', 0,
        'message', 'Error al actualizar el estado',
        'id', p_id
      );
    END IF;

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.actualizar_estado_pedido(p_id integer, p_nuevo_estado integer) OWNER TO postgres;

--
-- TOC entry 297 (class 1255 OID 16757)
-- Name: sp_buscar_detalle_pedido_por_id(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_buscar_detalle_pedido_por_id(p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_result JSON;
  v_data JSON;
BEGIN
  BEGIN
    -- Verificar si existe el detalle
    IF NOT EXISTS (
      SELECT 1 FROM restaurant.detalle_pedido WHERE id_detalle_pedido = p_id
    ) THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El detalle con ID ' || p_id || ' no existe',
        'data', NULL
      );
    END IF;

    -- Armar el JSON de respuesta
    SELECT json_build_object(
      'id_detalle_pedido', d.id_detalle_pedido,
      'cliente', d.cliente,
      'direccion', d.direccion,
      'id_pedido', d.id_pedido,
      'estado', d.estado,
      'items', (
        SELECT json_agg(
          json_build_object(
            'id_item_pedido', ip.id_item_pedido,
            'id_item', ip.id_item,
            'nombre', i.nombre,
            'descripcion', i.descripcion,
            'cantidad', ip.cantidad,
            'subtotal', ip.subtotal,
            'estado', ip.estado
          )
        )
        FROM restaurant.items_pedido ip
        JOIN restaurant.item i ON i.id_item = ip.id_item
        WHERE ip.id_pedido = d.id_pedido
      )
    )
    INTO v_data
    FROM restaurant.detalle_pedido d
    WHERE d.id_detalle_pedido = p_id;

    RETURN json_build_object(
      'success', 1,
      'message', 'Detalle del pedido encontrado',
      'data', v_data
    );

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'data', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_buscar_detalle_pedido_por_id(p_id integer) OWNER TO postgres;

--
-- TOC entry 290 (class 1255 OID 16739)
-- Name: sp_buscar_item_por_id(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_buscar_item_por_id(p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_result JSON;
  v_item RECORD;
BEGIN
  BEGIN
    -- Buscar el ítem
    SELECT 
      id_item,
      nombre,
      descripcion,
      stock,
      precio,
      estado,
      id_categoria,
      id_menu
    INTO v_item
    FROM restaurant.item
    WHERE id_item = p_id;

    -- Verificar si se encontró
    IF NOT FOUND THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El ítem con ID ' || p_id || ' no existe',
        'data', NULL
      );
    END IF;

    -- Devolver datos en formato estructurado
    v_result := json_build_object(
      'success', 1,
      'message', 'Ítem encontrado',
      'data', json_build_object(
        'id_item', v_item.id_item,
        'nombre', v_item.nombre,
        'descripcion', v_item.descripcion,
        'stock', v_item.stock,
        'precio', v_item.precio,
        'estado', v_item.estado,
        'id_categoria', v_item.id_categoria,
        'id_menu', v_item.id_menu
      )
    );

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'data', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_buscar_item_por_id(p_id integer) OWNER TO postgres;

--
-- TOC entry 311 (class 1255 OID 16794)
-- Name: sp_buscar_pedido_por_id(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_buscar_pedido_por_id(p_id integer) RETURNS TABLE(id_pedido integer, cantidad_total integer, precio_total numeric, estado_pedido integer, estado_descripcion text, fecha date, id_mesa integer, numero_mesa integer, descripcion_mesa text, id_usuario integer, usuario_nombre text, tipo_usuario text, id_item integer, nombre_item text, descripcion_item text, cantidad_item integer, subtotal_item numeric, total_rows bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id_pedido,
    p.cantidad,
    p.precio,
    p.estado,
    CASE p.estado
      WHEN 0 THEN 'Cancelado'
      WHEN 1 THEN 'Solicitado'
      WHEN 2 THEN 'Pagado'
      WHEN 3 THEN 'Preparando'
      WHEN 4 THEN 'Entregado'
      WHEN 5 THEN 'En mesa'
      ELSE 'Desconocido'
    END::text AS estado_descripcion,
    p.fecha,
    m.id_mesa,
    m.numero AS numero_mesa,
    m.descripcion::text AS descripcion_mesa,
    u.id_usuario,
    u.nombre::text AS usuario_nombre,
    tu.descripcion::text AS tipo_usuario,
    i.id_item,
    i.nombre::text AS nombre_item,
    i.descripcion::text AS descripcion_item,
    ip.cantidad AS cantidad_item,
    ip.subtotal AS subtotal_item,
    COUNT(*) OVER() AS total_rows
  FROM restaurant.pedido p
  INNER JOIN restaurant.mesa m ON m.id_mesa = p.id_mesa
  INNER JOIN auth.usuario u ON u.id_usuario = p.id_usuario
  INNER JOIN auth.tipousuario tu ON tu.id_tipousuario = u.id_tipousuario
  LEFT JOIN restaurant.items_pedido ip ON ip.id_pedido = p.id_pedido
  LEFT JOIN restaurant.item i ON i.id_item = ip.id_item
  WHERE p.id_pedido = p_id;
END;
$$;


ALTER FUNCTION restaurant.sp_buscar_pedido_por_id(p_id integer) OWNER TO postgres;

--
-- TOC entry 312 (class 1255 OID 16795)
-- Name: sp_buscar_pedido_por_id_completo(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_buscar_pedido_por_id_completo(p_id_pedido integer) RETURNS TABLE(id_pedido integer, cantidad_total integer, precio_total numeric, estado_pedido integer, estado_descripcion character varying, fecha date, id_mesa integer, numero_mesa integer, descripcion_mesa character varying, id_usuario integer, usuario_nombre character varying, tipo_usuario character varying, id_item integer, nombre_item character varying, descripcion_item character varying, cantidad_item integer, subtotal_item numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id_pedido,
    p.cantidad,
    p.precio,
    p.estado,
    CASE p.estado
      WHEN 0 THEN 'Cancelado'
      WHEN 1 THEN 'Solicitado'
      WHEN 2 THEN 'Pagado'
      WHEN 3 THEN 'Preparando'
      WHEN 4 THEN 'Entregado'
      WHEN 5 THEN 'En mesa'
      ELSE 'Desconocido'
    END::VARCHAR AS estado_descripcion,
    p.fecha,
    m.id_mesa,
    m.numero AS numero_mesa,
    m.descripcion::VARCHAR AS descripcion_mesa,
    u.id_usuario,
    u.nombre::VARCHAR AS usuario_nombre,
    tu.descripcion::VARCHAR AS tipo_usuario,
    i.id_item,
    i.nombre::VARCHAR AS nombre_item,
    i.descripcion::VARCHAR AS descripcion_item,
    ip.cantidad AS cantidad_item,
    ip.subtotal AS subtotal_item
  FROM restaurant.pedido p
  INNER JOIN restaurant.mesa m ON m.id_mesa = p.id_mesa
  INNER JOIN auth.usuario u ON u.id_usuario = p.id_usuario
  INNER JOIN auth.tipousuario tu ON tu.id_tipousuario = u.id_tipousuario
  LEFT JOIN restaurant.items_pedido ip ON ip.id_pedido = p.id_pedido
  LEFT JOIN restaurant.item i ON i.id_item = ip.id_item
  WHERE p.id_pedido = p_id_pedido;
END;
$$;


ALTER FUNCTION restaurant.sp_buscar_pedido_por_id_completo(p_id_pedido integer) OWNER TO postgres;

--
-- TOC entry 293 (class 1255 OID 16749)
-- Name: sp_cancelar_detalle_pedido(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_cancelar_detalle_pedido(p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_result JSON;
  v_estado_actual INTEGER;
BEGIN
  BEGIN
    -- Verificar si el detalle existe y obtener su estado actual
    SELECT estado INTO v_estado_actual
    FROM restaurant.detalle_pedido
    WHERE id_detalle_pedido = p_id;

    IF NOT FOUND THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El detalle con ID ' || p_id || ' no existe',
        'id', NULL
      );
    END IF;

    -- Verificar si ya está cancelado
    IF v_estado_actual = 0 THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'El detalle ya está cancelado',
        'id', p_id
      );
    END IF;

    -- Cancelar (estado = 0)
    UPDATE restaurant.detalle_pedido
    SET estado = 0
    WHERE id_detalle_pedido = p_id;

    IF FOUND THEN
      v_result := json_build_object(
        'success', 1,
        'message', 'Detalle del pedido cancelado exitosamente',
        'id', p_id
      );
    ELSE
      v_result := json_build_object(
        'success', 0,
        'message', 'Error al cancelar el detalle',
        'id', p_id
      );
    END IF;

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_cancelar_detalle_pedido(p_id integer) OWNER TO postgres;

--
-- TOC entry 291 (class 1255 OID 16746)
-- Name: sp_cancelar_pedido(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_cancelar_pedido(p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_result JSON;
  v_estado_actual INTEGER;
BEGIN
  BEGIN
    -- Verificar si el pedido existe y obtener su estado actual
    SELECT estado INTO v_estado_actual
    FROM restaurant.pedido
    WHERE id_pedido = p_id;

    IF NOT FOUND THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El pedido con ID ' || p_id || ' no existe',
        'id', NULL
      );
    END IF;

    -- Verificar si ya está cancelado
    IF v_estado_actual = 0 THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'El pedido ya está cancelado',
        'id', p_id
      );
    END IF;

    -- Cancelar (setear estado a 0)
    UPDATE restaurant.pedido
    SET estado = 0
    WHERE id_pedido = p_id;

    IF FOUND THEN
      v_result := json_build_object(
        'success', 1,
        'message', 'Pedido cancelado exitosamente',
        'id', p_id
      );
    ELSE
      v_result := json_build_object(
        'success', 0,
        'message', 'Error al cancelar el pedido',
        'id', p_id
      );
    END IF;

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_cancelar_pedido(p_id integer) OWNER TO postgres;

--
-- TOC entry 301 (class 1255 OID 16768)
-- Name: sp_cancelar_reserva(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_cancelar_reserva(p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_result JSON;
  v_id_mesa INTEGER;
BEGIN
  BEGIN
    -- Validar existencia
    SELECT id_mesa INTO v_id_mesa
    FROM restaurant.reserva
    WHERE id_reserva = p_id;

    IF NOT FOUND THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: La reserva con ID ' || p_id || ' no existe',
        'id', NULL
      );
    END IF;

    -- Cancelar reserva
    UPDATE restaurant.reserva
    SET estado = 0
    WHERE id_reserva = p_id;

    -- Liberar mesa
    UPDATE restaurant.mesa
    SET estado = 0
    WHERE id_mesa = v_id_mesa;

    RETURN json_build_object(
      'success', 1,
      'message', 'Reserva cancelada y mesa liberada correctamente',
      'id', p_id
    );

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_cancelar_reserva(p_id integer) OWNER TO postgres;

--
-- TOC entry 267 (class 1255 OID 16676)
-- Name: sp_create_menu(text, text); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_create_menu(p_nombre text, p_descripcion text) RETURNS TABLE(id_menu integer, nombre text, descripcion text, estado integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_menu INT;
  v_nombre TEXT;
  v_descripcion TEXT;
  v_estado INT;
BEGIN
  INSERT INTO restaurant.menu (nombre, descripcion, estado)
  VALUES (p_nombre, p_descripcion, 1)
  RETURNING 
    restaurant.menu.id_menu,
    restaurant.menu.nombre,
    restaurant.menu.descripcion,
    restaurant.menu.estado
  INTO v_id_menu, v_nombre, v_descripcion, v_estado;

  RETURN QUERY
  SELECT v_id_menu, v_nombre, v_descripcion, v_estado;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al crear el menú: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_create_menu(p_nombre text, p_descripcion text) OWNER TO postgres;

--
-- TOC entry 277 (class 1255 OID 16703)
-- Name: sp_create_mesa(integer, integer, text, bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_create_mesa(p_numero integer, p_capacidad integer, p_descripcion text, p_id_restaurante bigint) RETURNS TABLE(id_mesa integer, numero integer, capacidad integer, descripcion text, estado integer, id_restaurante integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  WITH inserted AS (
    INSERT INTO restaurant.mesa (numero, capacidad, descripcion, estado, id_restaurante)
    VALUES (p_numero, p_capacidad, p_descripcion, 0, p_id_restaurante)
    RETURNING 
      inserted.id_mesa,
      inserted.numero,
      inserted.capacidad,
      inserted.descripcion,
      inserted.estado,
      inserted.id_restaurante
  )
  SELECT 
    inserted.id_mesa,
    inserted.numero,
    inserted.capacidad,
    inserted.descripcion,
    inserted.estado,
    inserted.id_restaurante
  FROM inserted;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al crear la mesa: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_create_mesa(p_numero integer, p_capacidad integer, p_descripcion text, p_id_restaurante bigint) OWNER TO postgres;

--
-- TOC entry 278 (class 1255 OID 16706)
-- Name: sp_create_mesa(bigint, bigint, text, bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_create_mesa(p_numero bigint, p_capacidad bigint, p_descripcion text, p_id_restaurante bigint) RETURNS TABLE(id_mesa integer, numero integer, capacidad integer, descripcion text, estado integer, id_restaurante integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  WITH inserted AS (
    INSERT INTO restaurant.mesa AS m (numero, capacidad, descripcion, estado, id_restaurante)
    VALUES (p_numero, p_capacidad, p_descripcion, 0, p_id_restaurante)
    RETURNING
      m.id_mesa,
      m.numero,
      m.capacidad,
      m.descripcion,
      m.estado,
      m.id_restaurante
  )
  SELECT
    inserted.id_mesa::INT,
    inserted.numero::INT,
    inserted.capacidad::INT,
    inserted.descripcion::TEXT,
    inserted.estado::INT,
    inserted.id_restaurante::INT
  FROM inserted;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al crear la mesa: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_create_mesa(p_numero bigint, p_capacidad bigint, p_descripcion text, p_id_restaurante bigint) OWNER TO postgres;

--
-- TOC entry 268 (class 1255 OID 16688)
-- Name: sp_create_restaurante(text, text, text, text, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_create_restaurante(p_nombre text, p_direccion text, p_telefono text, p_email text, p_id_menu integer) RETURNS TABLE(id_restaurante integer, nombre text, direccion text, telefono text, email text, id_menu integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_restaurante INT;
  v_nombre TEXT;
  v_direccion TEXT;
  v_telefono TEXT;
  v_email TEXT;
  v_id_menu INT;
BEGIN
  INSERT INTO restaurant.restaurante (nombre, direccion, telefono, email, id_menu)
  VALUES (p_nombre, p_direccion, p_telefono, p_email, p_id_menu)
  RETURNING id_restaurante, nombre, direccion, telefono, email, id_menu
  INTO v_id_restaurante, v_nombre, v_direccion, v_telefono, v_email, v_id_menu;

  RETURN QUERY
  SELECT v_id_restaurante, v_nombre, v_direccion, v_telefono, v_email, v_id_menu;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al crear el restaurante: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_create_restaurante(p_nombre text, p_direccion text, p_telefono text, p_email text, p_id_menu integer) OWNER TO postgres;

--
-- TOC entry 270 (class 1255 OID 16693)
-- Name: sp_create_restaurante(text, text, text, text, bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_create_restaurante(p_nombre text, p_direccion text, p_telefono text, p_email text, p_id_menu bigint) RETURNS TABLE(id_restaurante integer, nombre text, direccion text, telefono text, email text, id_menu integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  WITH inserted AS (
    INSERT INTO restaurant.restaurante AS r (nombre, direccion, telefono, email, id_menu)
    VALUES (p_nombre, p_direccion, p_telefono, p_email, p_id_menu)
    RETURNING 
      r.id_restaurante, 
      r.nombre, 
      r.direccion, 
      r.telefono, 
      r.email, 
      r.id_menu
  )
  SELECT 
    inserted.id_restaurante::INT,
    inserted.nombre::TEXT,
    inserted.direccion::TEXT,
    inserted.telefono::TEXT,
    inserted.email::TEXT,
    inserted.id_menu::INT
  FROM inserted;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al crear el restaurante: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_create_restaurante(p_nombre text, p_direccion text, p_telefono text, p_email text, p_id_menu bigint) OWNER TO postgres;

--
-- TOC entry 285 (class 1255 OID 16734)
-- Name: sp_deshabilitar_categoria(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_deshabilitar_categoria(p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_result JSON;
    v_estado INTEGER;
BEGIN
    BEGIN
        -- Verificar si la categoría existe y obtener su estado actual
        SELECT estado INTO v_estado
        FROM restaurant.categoria
        WHERE id_categoria = p_id;

        -- Si no existe la categoría
        IF NOT FOUND THEN
            RETURN json_build_object(
                'success', 0,
                'message', 'Error: La categoría con ID ' || p_id || ' no existe',
                'id', NULL
            );
        END IF;

        -- Si ya está deshabilitada
        IF v_estado = 0 THEN
            RETURN json_build_object(
                'success', 0,
                'message', 'La categoría ya está deshabilitada',
                'id', p_id
            );
        END IF;

        -- Deshabilitar (estado = 0)
        UPDATE restaurant.categoria
        SET estado = 0
        WHERE id_categoria = p_id;

        -- Confirmar que la actualización ocurrió
        IF FOUND THEN
            v_result := json_build_object(
                'success', 1,
                'message', 'Categoría deshabilitada exitosamente',
                'id', p_id
            );
        ELSE
            v_result := json_build_object(
                'success', 0,
                'message', 'Error al deshabilitar la categoría',
                'id', p_id
            );
        END IF;

        RETURN v_result;

    EXCEPTION WHEN OTHERS THEN
        RETURN json_build_object(
            'success', 0,
            'message', 'Error: ' || SQLERRM,
            'id', NULL
        );
    END;
END;
$$;


ALTER FUNCTION restaurant.sp_deshabilitar_categoria(p_id integer) OWNER TO postgres;

--
-- TOC entry 289 (class 1255 OID 16737)
-- Name: sp_deshabilitar_item(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_deshabilitar_item(p_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_result JSON;
  v_estado INTEGER;
BEGIN
  BEGIN
    -- Verificar si el ítem existe y obtener su estado
    SELECT estado INTO v_estado
    FROM restaurant.item
    WHERE id_item = p_id;

    IF NOT FOUND THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El ítem con ID ' || p_id || ' no existe',
        'id', NULL
      );
    END IF;

    -- Verificar si ya está deshabilitado
    IF v_estado = 0 THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'El ítem ya está deshabilitado',
        'id', p_id
      );
    END IF;

    -- Deshabilitar (estado = 0)
    UPDATE restaurant.item
    SET estado = 0
    WHERE id_item = p_id;

    IF FOUND THEN
      v_result := json_build_object(
        'success', 1,
        'message', 'Ítem deshabilitado exitosamente',
        'id', p_id
      );
    ELSE
      v_result := json_build_object(
        'success', 0,
        'message', 'Error al deshabilitar el ítem',
        'id', p_id
      );
    END IF;

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_deshabilitar_item(p_id integer) OWNER TO postgres;

--
-- TOC entry 265 (class 1255 OID 16679)
-- Name: sp_disable_menu(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_disable_menu(p_id_menu integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE restaurant.menu
  SET estado = 0
  WHERE id_menu = p_id_menu;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró un menú con el id % para desactivar', p_id_menu;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al desactivar el menú: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_disable_menu(p_id_menu integer) OWNER TO postgres;

--
-- TOC entry 266 (class 1255 OID 16687)
-- Name: sp_disable_menu(bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_disable_menu(p_id_menu bigint) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_menu INT;
BEGIN
  UPDATE restaurant.menu AS m
  SET estado = 0
  WHERE m.id_menu = p_id_menu
  RETURNING m.id_menu
  INTO v_id_menu;

  IF v_id_menu IS NULL THEN
    RAISE EXCEPTION 'No se encontró un menú para desactivar con id %', p_id_menu;
  END IF;

  RETURN format('Menú desactivado correctamente (id: %s)', v_id_menu);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al desactivar el menú: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_disable_menu(p_id_menu bigint) OWNER TO postgres;

--
-- TOC entry 303 (class 1255 OID 16781)
-- Name: sp_enable_menu(integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_enable_menu(p_id_menu integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE restaurant.menu
  SET estado = 1
  WHERE id_menu = p_id_menu;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró un menú con el id % para activar', p_id_menu;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al activar el menú: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_enable_menu(p_id_menu integer) OWNER TO postgres;

--
-- TOC entry 4521 (class 0 OID 0)
-- Dependencies: 303
-- Name: FUNCTION sp_enable_menu(p_id_menu integer); Type: COMMENT; Schema: restaurant; Owner: postgres
--

COMMENT ON FUNCTION restaurant.sp_enable_menu(p_id_menu integer) IS 'activa menu';


--
-- TOC entry 246 (class 1255 OID 16783)
-- Name: sp_enable_menu(bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_enable_menu(p_id_menu bigint) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_menu INT;
BEGIN
  UPDATE restaurant.menu AS m
  SET estado = 1
  WHERE m.id_menu = p_id_menu
  RETURNING m.id_menu
  INTO v_id_menu;

  IF v_id_menu IS NULL THEN
    RAISE EXCEPTION 'No se encontró un menú para activar con id %', p_id_menu;
  END IF;

  RETURN format('Menú activado correctamente (id: %s)', v_id_menu);

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al activar el menú: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_enable_menu(p_id_menu bigint) OWNER TO postgres;

--
-- TOC entry 273 (class 1255 OID 16699)
-- Name: sp_find_all_mesas(); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_find_all_mesas() RETURNS TABLE(id_mesa integer, numero integer, capacidad integer, descripcion text, id_restaurante integer, estado integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id_mesa::INT,
    m.numero::INT,
    m.capacidad::INT,
    m.descripcion::TEXT,
    m.id_restaurante::INT,
    m.estado::INT
  FROM restaurant.mesa AS m;
END;
$$;


ALTER FUNCTION restaurant.sp_find_all_mesas() OWNER TO postgres;

--
-- TOC entry 245 (class 1255 OID 16685)
-- Name: sp_find_menu(bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_find_menu(p_id_menu bigint) RETURNS TABLE(id_menu integer, nombre text, descripcion text, estado integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id_menu,
    m.nombre::TEXT, -- 🔥 casteo explícito
    m.descripcion::TEXT, -- 🔥 casteo explícito
    m.estado
  FROM restaurant.menu AS m
  WHERE m.id_menu = p_id_menu;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró un menú con el id %', p_id_menu;
  END IF;
END;
$$;


ALTER FUNCTION restaurant.sp_find_menu(p_id_menu bigint) OWNER TO postgres;

--
-- TOC entry 274 (class 1255 OID 16700)
-- Name: sp_find_mesa_by_id(bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_find_mesa_by_id(p_id_mesa bigint) RETURNS TABLE(id_mesa integer, numero integer, capacidad integer, descripcion text, id_restaurante integer, estado integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id_mesa::INT,
    m.numero::INT,
    m.capacidad::INT,
    m.descripcion::TEXT,
    m.id_restaurante::INT,
    m.estado::INT
  FROM restaurant.mesa AS m
  WHERE m.id_mesa = p_id_mesa;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró la mesa con id %', p_id_mesa;
  END IF;
END;
$$;


ALTER FUNCTION restaurant.sp_find_mesa_by_id(p_id_mesa bigint) OWNER TO postgres;

--
-- TOC entry 272 (class 1255 OID 16695)
-- Name: sp_find_restaurante(bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_find_restaurante(p_id_restaurante bigint) RETURNS TABLE(id_restaurante integer, nombre text, direccion text, telefono text, email text, id_menu integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id_restaurante::INT,
    r.nombre::TEXT,
    r.direccion::TEXT,
    r.telefono::TEXT,
    r.email::TEXT,
    r.id_menu::INT
  FROM restaurant.restaurante AS r
  WHERE r.id_restaurante = p_id_restaurante;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró el restaurante con id %', p_id_restaurante;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al buscar el restaurante: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_find_restaurante(p_id_restaurante bigint) OWNER TO postgres;

--
-- TOC entry 284 (class 1255 OID 16733)
-- Name: sp_guardar_categoria(integer, character varying, character varying, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_guardar_categoria(p_id integer DEFAULT NULL::integer, p_nombre character varying DEFAULT NULL::character varying, p_descripcion character varying DEFAULT NULL::character varying, p_estado integer DEFAULT 1) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id INTEGER;
  v_result JSON;
  v_existe_nombre BOOLEAN;
  v_nombre_actual VARCHAR;
BEGIN
  BEGIN
    -- Validaciones básicas
    IF p_nombre IS NULL THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El nombre de la categoría no puede ser nulo',
        'id', NULL
      );
    END IF;

    IF p_estado IS NOT NULL AND p_estado NOT IN (0, 1) THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El estado debe ser 0 (inactivo) o 1 (activo)',
        'id', NULL
      );
    END IF;

    -- Validación de nombre único
    IF p_id IS NULL THEN
      SELECT EXISTS(
        SELECT 1
        FROM restaurant.categoria
        WHERE nombre = p_nombre
      ) INTO v_existe_nombre;

      IF v_existe_nombre THEN
        RETURN json_build_object(
          'success', 0,
          'message', 'Error: Ya existe una categoría con el nombre "' || p_nombre || '"',
          'id', NULL
        );
      END IF;
    ELSE
      SELECT nombre INTO v_nombre_actual
      FROM restaurant.categoria
      WHERE id_categoria = p_id;

      IF v_nombre_actual IS DISTINCT FROM p_nombre THEN
        SELECT EXISTS(
          SELECT 1
          FROM restaurant.categoria
          WHERE nombre = p_nombre AND id_categoria != p_id
        ) INTO v_existe_nombre;

        IF v_existe_nombre THEN
          RETURN json_build_object(
            'success', 0,
            'message', 'Error: Ya existe otra categoría con el nombre "' || p_nombre || '"',
            'id', NULL
          );
        END IF;
      END IF;
    END IF;

    -- INSERT o UPDATE
    IF p_id IS NULL THEN
      INSERT INTO restaurant.categoria(nombre, descripcion, estado)
      VALUES (p_nombre, p_descripcion, p_estado)
      RETURNING id_categoria INTO v_id;

      v_result := json_build_object(
        'success', 1,
        'message', 'Categoría creada exitosamente',
        'id', v_id
      );
    ELSE
      UPDATE restaurant.categoria
      SET nombre = p_nombre,
          descripcion = p_descripcion,
          estado = p_estado
      WHERE id_categoria = p_id;

      IF FOUND THEN
        v_result := json_build_object(
          'success', 1,
          'message', 'Categoría actualizada exitosamente',
          'id', p_id
        );
      ELSE
        v_result := json_build_object(
          'success', 0,
          'message', 'Error: La categoría con ID ' || p_id || ' no existe',
          'id', NULL
        );
      END IF;
    END IF;

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_guardar_categoria(p_id integer, p_nombre character varying, p_descripcion character varying, p_estado integer) OWNER TO postgres;

--
-- TOC entry 292 (class 1255 OID 16748)
-- Name: sp_guardar_detalle_pedido(integer, character varying, character varying, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_guardar_detalle_pedido(p_id integer DEFAULT NULL::integer, p_cliente character varying DEFAULT NULL::character varying, p_direccion character varying DEFAULT NULL::character varying, p_id_pedido integer DEFAULT NULL::integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id INTEGER;
  v_result JSON;
  v_estado_pedido INTEGER;
BEGIN
  BEGIN
    -- Validación obligatoria
    IF p_id_pedido IS NULL THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El ID del pedido es obligatorio',
        'id', NULL
      );
    END IF;

    -- Verificar existencia del pedido y su estado
    SELECT estado INTO v_estado_pedido
    FROM restaurant.pedido
    WHERE id_pedido = p_id_pedido;

    IF NOT FOUND THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El pedido con ID ' || p_id_pedido || ' no existe',
        'id', NULL
      );
    END IF;

    IF v_estado_pedido = 0 THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: No se puede asociar detalle a un pedido cancelado',
        'id', NULL
      );
    END IF;

    -- INSERT o UPDATE
    IF p_id IS NULL THEN
      INSERT INTO restaurant.detalle_pedido(cliente, direccion, id_pedido)
      VALUES (p_cliente, p_direccion, p_id_pedido)
      RETURNING id_detalle_pedido INTO v_id;

      v_result := json_build_object(
        'success', 1,
        'message', 'Detalle del pedido creado exitosamente',
        'id', v_id
      );
    ELSE
      UPDATE restaurant.detalle_pedido
      SET cliente = p_cliente,
          direccion = p_direccion,
          id_pedido = p_id_pedido
      WHERE id_detalle_pedido = p_id;

      IF FOUND THEN
        v_result := json_build_object(
          'success', 1,
          'message', 'Detalle del pedido actualizado exitosamente',
          'id', p_id
        );
      ELSE
        v_result := json_build_object(
          'success', 0,
          'message', 'Error: El detalle con ID ' || p_id || ' no existe',
          'id', NULL
        );
      END IF;
    END IF;

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_guardar_detalle_pedido(p_id integer, p_cliente character varying, p_direccion character varying, p_id_pedido integer) OWNER TO postgres;

--
-- TOC entry 288 (class 1255 OID 16736)
-- Name: sp_guardar_item(integer, character varying, character varying, integer, numeric, integer, integer, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_guardar_item(p_id integer DEFAULT NULL::integer, p_nombre character varying DEFAULT NULL::character varying, p_descripcion character varying DEFAULT NULL::character varying, p_stock integer DEFAULT 0, p_precio numeric DEFAULT 0, p_estado integer DEFAULT 1, p_id_categoria integer DEFAULT NULL::integer, p_id_menu integer DEFAULT NULL::integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id INTEGER;
  v_result JSON;
  v_existe_nombre BOOLEAN;
  v_nombre_actual VARCHAR;
BEGIN
  BEGIN
    -- Validación obligatoria
    IF p_nombre IS NULL THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El nombre del ítem no puede ser nulo',
        'id', NULL
      );
    END IF;

    IF p_estado NOT IN (0, 1) THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El estado debe ser 0 (inactivo) o 1 (activo)',
        'id', NULL
      );
    END IF;

    -- Validar existencia de menú
    IF p_id_menu IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM restaurant.menu WHERE id_menu = p_id_menu) THEN
        RETURN json_build_object(
          'success', 0,
          'message', 'Error: El menú con ID ' || p_id_menu || ' no existe',
          'id', NULL
        );
      END IF;
    END IF;

    -- Validar existencia de categoría
    IF p_id_categoria IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM restaurant.categoria WHERE id_categoria = p_id_categoria) THEN
        RETURN json_build_object(
          'success', 0,
          'message', 'Error: La categoría con ID ' || p_id_categoria || ' no existe',
          'id', NULL
        );
      END IF;
    END IF;

    -- Verificar nombre duplicado
    IF p_id IS NULL THEN
      SELECT EXISTS(
        SELECT 1 FROM restaurant.item WHERE nombre = p_nombre
      ) INTO v_existe_nombre;

      IF v_existe_nombre THEN
        RETURN json_build_object(
          'success', 0,
          'message', 'Error: Ya existe un ítem con el nombre "' || p_nombre || '"',
          'id', NULL
        );
      END IF;
    ELSE
      SELECT nombre INTO v_nombre_actual
      FROM restaurant.item
      WHERE id_item = p_id;

      IF v_nombre_actual IS DISTINCT FROM p_nombre THEN
        SELECT EXISTS(
          SELECT 1 FROM restaurant.item
          WHERE nombre = p_nombre AND id_item != p_id
        ) INTO v_existe_nombre;

        IF v_existe_nombre THEN
          RETURN json_build_object(
            'success', 0,
            'message', 'Error: Ya existe otro ítem con el nombre "' || p_nombre || '"',
            'id', NULL
          );
        END IF;
      END IF;
    END IF;

    -- INSERT o UPDATE
    IF p_id IS NULL THEN
      INSERT INTO restaurant.item(
        nombre, descripcion, stock, precio, estado, id_categoria, id_menu
      )
      VALUES (
        p_nombre, p_descripcion, p_stock, p_precio, p_estado, p_id_categoria, p_id_menu
      )
      RETURNING id_item INTO v_id;

      v_result := json_build_object(
        'success', 1,
        'message', 'Ítem creado exitosamente',
        'id', v_id
      );
    ELSE
      UPDATE restaurant.item
      SET nombre = p_nombre,
          descripcion = p_descripcion,
          stock = p_stock,
          precio = p_precio,
          estado = p_estado,
          id_categoria = p_id_categoria,
          id_menu = p_id_menu
      WHERE id_item = p_id;

      IF FOUND THEN
        v_result := json_build_object(
          'success', 1,
          'message', 'Ítem actualizado exitosamente',
          'id', p_id
        );
      ELSE
        v_result := json_build_object(
          'success', 0,
          'message', 'Error: El ítem con ID ' || p_id || ' no existe',
          'id', NULL
        );
      END IF;
    END IF;

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_guardar_item(p_id integer, p_nombre character varying, p_descripcion character varying, p_stock integer, p_precio numeric, p_estado integer, p_id_categoria integer, p_id_menu integer) OWNER TO postgres;

--
-- TOC entry 282 (class 1255 OID 16741)
-- Name: sp_guardar_pedido(integer, integer, numeric, integer, integer, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_guardar_pedido(p_id integer DEFAULT NULL::integer, p_cantidad integer DEFAULT 0, p_precio numeric DEFAULT 0, p_id_usuario integer DEFAULT NULL::integer, p_estado integer DEFAULT 1, p_id_mesa integer DEFAULT NULL::integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id INTEGER;
  v_result JSON;
BEGIN
  BEGIN
    -- Validaciones básicas
    IF p_id_usuario IS NULL THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El usuario no puede ser nulo',
        'id', NULL
      );
    END IF;

    IF p_estado NOT IN (0, 1) THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El estado debe ser 0 (cancelado) o 1 (activo)',
        'id', NULL
      );
    END IF;

    -- Validar existencia de usuario
    IF NOT EXISTS (SELECT 1 FROM auth.usuario WHERE id_usuario = p_id_usuario) THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El usuario con ID ' || p_id_usuario || ' no existe',
        'id', NULL
      );
    END IF;

    -- Validar existencia de mesa si se especifica
    IF p_id_mesa IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM restaurant.mesa WHERE id_mesa = p_id_mesa) THEN
        RETURN json_build_object(
          'success', 0,
          'message', 'Error: La mesa con ID ' || p_id_mesa || ' no existe',
          'id', NULL
        );
      END IF;
    END IF;

    -- INSERT o UPDATE
    IF p_id IS NULL THEN
      INSERT INTO restaurant.pedido (
        cantidad, precio, id_usuario, estado, id_mesa
      )
      VALUES (
        p_cantidad, p_precio, p_id_usuario, p_estado, p_id_mesa
      )
      RETURNING id_pedido INTO v_id;

      v_result := json_build_object(
        'success', 1,
        'message', 'Pedido creado exitosamente',
        'id', v_id
      );
    ELSE
      UPDATE restaurant.pedido
      SET cantidad = p_cantidad,
          precio = p_precio,
          id_usuario = p_id_usuario,
          estado = p_estado,
          id_mesa = p_id_mesa
      WHERE id_pedido = p_id;

      IF FOUND THEN
        v_result := json_build_object(
          'success', 1,
          'message', 'Pedido actualizado exitosamente',
          'id', p_id
        );
      ELSE
        v_result := json_build_object(
          'success', 0,
          'message', 'Error: El pedido con ID ' || p_id || ' no existe',
          'id', NULL
        );
      END IF;
    END IF;

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_guardar_pedido(p_id integer, p_cantidad integer, p_precio numeric, p_id_usuario integer, p_estado integer, p_id_mesa integer) OWNER TO postgres;

--
-- TOC entry 296 (class 1255 OID 16755)
-- Name: sp_guardar_pedido_completo(integer, integer, integer, jsonb); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_guardar_pedido_completo(p_id integer DEFAULT NULL::integer, p_id_usuario integer DEFAULT NULL::integer, p_id_mesa integer DEFAULT NULL::integer, p_items jsonb DEFAULT NULL::jsonb) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_pedido INTEGER;
  v_result JSON;
  v_precio_total NUMERIC(10, 2) := 0;
  v_cantidad_total INTEGER := 0;
  v_item JSONB;
  v_id_item INTEGER;
  v_cantidad INTEGER;
  v_precio_unitario NUMERIC(10, 2);
BEGIN
  BEGIN
    -- ✅ Validaciones previas
    IF NOT EXISTS (SELECT 1 FROM auth.usuario WHERE id_usuario = p_id_usuario) THEN
      RETURN json_build_object('success', 0, 'message', 'Error: El usuario no existe', 'id', NULL);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM restaurant.mesa WHERE id_mesa = p_id_mesa) THEN
      RETURN json_build_object('success', 0, 'message', 'Error: La mesa no existe', 'id', NULL);
    END IF;

    -- ✅ Insertar o actualizar pedido (estado = 1 activo)
    IF p_id IS NULL THEN
      INSERT INTO restaurant.pedido (cantidad, precio, id_usuario, id_mesa, estado, fecha)
      VALUES (0, 0, p_id_usuario, p_id_mesa, 1, CURRENT_DATE)
      RETURNING id_pedido INTO v_id_pedido;
    ELSE
      UPDATE restaurant.pedido
      SET id_usuario = p_id_usuario,
          id_mesa = p_id_mesa,
          fecha = CURRENT_DATE
      WHERE id_pedido = p_id
      RETURNING id_pedido INTO v_id_pedido;

      DELETE FROM restaurant.items_pedido WHERE id_pedido = v_id_pedido;
    END IF;

    -- ✅ Recorrer y guardar los ítems
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
      v_id_item := (v_item ->> 'id_item')::INTEGER;
      v_cantidad := (v_item ->> 'cantidad')::INTEGER;

      SELECT precio INTO v_precio_unitario
      FROM restaurant.item
      WHERE id_item = v_id_item;

      -- ❗Validación: ítem debe existir y tener precio
      IF NOT FOUND OR v_precio_unitario IS NULL THEN
        RETURN json_build_object(
          'success', 0,
          'message', 'Error: El ítem con ID ' || v_id_item || ' no existe o no tiene precio',
          'id', NULL
        );
      END IF;

      INSERT INTO restaurant.items_pedido (
        id_pedido, id_item, cantidad, subtotal, estado
      ) VALUES (
        v_id_pedido, v_id_item, v_cantidad, v_precio_unitario * v_cantidad, 1
      );

      v_precio_total := v_precio_total + (v_precio_unitario * v_cantidad);
      v_cantidad_total := v_cantidad_total + v_cantidad;
    END LOOP;

    -- ✅ Actualizar totales del pedido
    UPDATE restaurant.pedido
    SET cantidad = v_cantidad_total,
        precio = v_precio_total
    WHERE id_pedido = v_id_pedido;

    -- ✅ Respuesta final
    RETURN json_build_object(
      'success', 1,
      'message', 'Pedido guardado exitosamente',
      'id', v_id_pedido
    );

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_guardar_pedido_completo(p_id integer, p_id_usuario integer, p_id_mesa integer, p_items jsonb) OWNER TO postgres;

--
-- TOC entry 310 (class 1255 OID 16791)
-- Name: sp_guardar_pedido_completo_alt(integer, integer, integer, jsonb); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_guardar_pedido_completo_alt(p_id integer, p_id_usuario integer, p_id_mesa integer, p_items jsonb) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_pedido INTEGER;
  v_result JSON;
  v_precio_total NUMERIC(10, 2) := 0;
  v_cantidad_total INTEGER := 0;
  v_item JSONB;
  v_id_item INTEGER;
  v_cantidad INTEGER;
  v_precio_unitario NUMERIC(10, 2);
BEGIN
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.usuario WHERE id_usuario = p_id_usuario) THEN
      RETURN json_build_object('success', 0, 'message', 'Error: El usuario no existe', 'id', NULL);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM restaurant.mesa WHERE id_mesa = p_id_mesa) THEN
      RETURN json_build_object('success', 0, 'message', 'Error: La mesa no existe', 'id', NULL);
    END IF;

    IF p_id IS NULL THEN
      INSERT INTO restaurant.pedido (cantidad, precio, id_usuario, id_mesa, estado, fecha)
      VALUES (0, 0, p_id_usuario, p_id_mesa, 1, CURRENT_DATE)
      RETURNING id_pedido INTO v_id_pedido;
    ELSE
      UPDATE restaurant.pedido
      SET id_usuario = p_id_usuario,
          id_mesa = p_id_mesa,
          fecha = CURRENT_DATE
      WHERE id_pedido = p_id
      RETURNING id_pedido INTO v_id_pedido;

      DELETE FROM restaurant.items_pedido WHERE id_pedido = v_id_pedido;
    END IF;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
      v_id_item := (v_item ->> 'id_item')::INTEGER;
      v_cantidad := (v_item ->> 'cantidad')::INTEGER;

      SELECT precio INTO v_precio_unitario
      FROM restaurant.item
      WHERE id_item = v_id_item;

      IF NOT FOUND OR v_precio_unitario IS NULL THEN
        RETURN json_build_object(
          'success', 0,
          'message', 'Error: El ítem con ID ' || v_id_item || ' no existe o no tiene precio',
          'id', NULL
        );
      END IF;

      INSERT INTO restaurant.items_pedido (
        id_pedido, id_item, cantidad, subtotal, estado
      ) VALUES (
        v_id_pedido, v_id_item, v_cantidad, v_precio_unitario * v_cantidad, 1
      );

      v_precio_total := v_precio_total + (v_precio_unitario * v_cantidad);
      v_cantidad_total := v_cantidad_total + v_cantidad;
    END LOOP;

    UPDATE restaurant.pedido
    SET cantidad = v_cantidad_total,
        precio = v_precio_total
    WHERE id_pedido = v_id_pedido;

    RETURN json_build_object(
      'success', 1,
      'message', 'Pedido guardado exitosamente',
      'id', v_id_pedido
    );

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_guardar_pedido_completo_alt(p_id integer, p_id_usuario integer, p_id_mesa integer, p_items jsonb) OWNER TO postgres;

--
-- TOC entry 299 (class 1255 OID 16764)
-- Name: sp_guardar_reserva(integer, date, time without time zone, integer, integer, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_guardar_reserva(p_id integer DEFAULT NULL::integer, p_fecha date DEFAULT now(), p_hora time without time zone DEFAULT now(), p_id_mesa integer DEFAULT NULL::integer, p_id_usuario integer DEFAULT NULL::integer, p_estado integer DEFAULT 1) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id INTEGER;
  v_result JSON;
BEGIN
  BEGIN
    -- Validaciones
    IF NOT EXISTS (SELECT 1 FROM restaurant.mesa WHERE id_mesa = p_id_mesa) THEN
      RETURN json_build_object('success', 0, 'message', 'Error: La mesa no existe', 'id', NULL);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.usuario WHERE id_usuario = p_id_usuario) THEN
      RETURN json_build_object('success', 0, 'message', 'Error: El usuario no existe', 'id', NULL);
    END IF;

    IF p_estado NOT IN (0, 1) THEN
      RETURN json_build_object('success', 0, 'message', 'Error: Estado inválido', 'id', NULL);
    END IF;

    -- Insert o update
    IF p_id IS NULL THEN
      INSERT INTO restaurant.reserva(fecha, hora, id_mesa, id_usuario, estado)
      VALUES (p_fecha, p_hora, p_id_mesa, p_id_usuario, p_estado)
      RETURNING id_reserva INTO v_id;

      -- Cambiar estado de la mesa a 2 (reservada)
      UPDATE restaurant.mesa SET estado = 2 WHERE id_mesa = p_id_mesa;
    ELSE
      UPDATE restaurant.reserva
      SET fecha = p_fecha,
          hora = p_hora,
          id_mesa = p_id_mesa,
          id_usuario = p_id_usuario,
          estado = p_estado
      WHERE id_reserva = p_id
      RETURNING id_reserva INTO v_id;
    END IF;

    RETURN json_build_object('success', 1, 'message', 'Reserva guardada correctamente', 'id', v_id);

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', 0, 'message', 'Error: ' || SQLERRM, 'id', NULL);
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_guardar_reserva(p_id integer, p_fecha date, p_hora time without time zone, p_id_mesa integer, p_id_usuario integer, p_estado integer) OWNER TO postgres;

--
-- TOC entry 307 (class 1255 OID 16784)
-- Name: sp_habilitar_item(bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_habilitar_item(p_id bigint) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_result JSON;
  v_estado INTEGER;
BEGIN
  BEGIN
    -- Verificar si el ítem existe y obtener su estado actual
    SELECT estado INTO v_estado
    FROM restaurant.item
    WHERE id_item = p_id;

    IF NOT FOUND THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'Error: El ítem con ID ' || p_id || ' no existe',
        'id', NULL
      );
    END IF;

    -- Verificar si ya está habilitado
    IF v_estado = 1 THEN
      RETURN json_build_object(
        'success', 0,
        'message', 'El ítem ya está habilitado',
        'id', p_id
      );
    END IF;

    -- Habilitar el ítem (estado = 1)
    UPDATE restaurant.item
    SET estado = 1
    WHERE id_item = p_id;

    IF FOUND THEN
      v_result := json_build_object(
        'success', 1,
        'message', 'Ítem habilitado exitosamente',
        'id', p_id
      );
    ELSE
      v_result := json_build_object(
        'success', 0,
        'message', 'Error al habilitar el ítem',
        'id', p_id
      );
    END IF;

    RETURN v_result;

  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', 0,
      'message', 'Error: ' || SQLERRM,
      'id', NULL
    );
  END;
END;
$$;


ALTER FUNCTION restaurant.sp_habilitar_item(p_id bigint) OWNER TO postgres;

--
-- TOC entry 286 (class 1255 OID 16735)
-- Name: sp_listar_categorias(character varying, integer, character varying, character varying, integer, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_listar_categorias(p_busqueda character varying DEFAULT NULL::character varying, p_estado integer DEFAULT NULL::integer, p_orden_col character varying DEFAULT 'nombre'::character varying, p_orden_dir character varying DEFAULT 'ASC'::character varying, p_page_index integer DEFAULT 1, p_page_size integer DEFAULT 10) RETURNS TABLE(id_categoria integer, nombre character varying, descripcion character varying, estado integer, total_rows bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id_categoria,
        c.nombre,
        c.descripcion,
        c.estado,
        COUNT(*) OVER() AS total_rows
    FROM restaurant.categoria c
    WHERE 
        (p_busqueda IS NULL OR c.nombre ILIKE '%' || p_busqueda || '%')
        AND (
            (p_estado IS NOT NULL AND c.estado = p_estado)
            OR (p_estado IS NULL AND c.estado = 1)
        )
    ORDER BY 
        CASE WHEN p_orden_col = 'nombre' AND p_orden_dir = 'ASC' THEN c.nombre END ASC,
        CASE WHEN p_orden_col = 'nombre' AND p_orden_dir = 'DESC' THEN c.nombre END DESC
    OFFSET (p_page_index - 1) * p_page_size
    LIMIT p_page_size;
END;
$$;


ALTER FUNCTION restaurant.sp_listar_categorias(p_busqueda character varying, p_estado integer, p_orden_col character varying, p_orden_dir character varying, p_page_index integer, p_page_size integer) OWNER TO postgres;

--
-- TOC entry 294 (class 1255 OID 16752)
-- Name: sp_listar_detalles_pedido(character varying, integer, character varying, character varying, integer, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_listar_detalles_pedido(p_busqueda character varying DEFAULT NULL::character varying, p_estado integer DEFAULT NULL::integer, p_orden_col character varying DEFAULT 'id_detalle_pedido'::character varying, p_orden_dir character varying DEFAULT 'DESC'::character varying, p_page_index integer DEFAULT 1, p_page_size integer DEFAULT 10) RETURNS TABLE(id_detalle_pedido integer, cliente character varying, direccion character varying, id_pedido integer, estado integer, items json, total_rows bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id_detalle_pedido,
    d.cliente,
    d.direccion,
    d.id_pedido,
    d.estado,
    (
      SELECT json_agg(
        json_build_object(
          'id_item_pedido', ip.id_item_pedido,
          'id_item', ip.id_item,
          'nombre', i.nombre,
          'descripcion', i.descripcion,
          'cantidad', ip.cantidad,
          'subtotal', ip.subtotal,
          'estado', ip.estado
        )
      )
      FROM restaurant.items_pedido ip
      INNER JOIN restaurant.item i ON i.id_item = ip.id_item
      WHERE ip.id_pedido = d.id_pedido
    ) AS items,
    COUNT(*) OVER() AS total_rows
  FROM restaurant.detalle_pedido d
  WHERE 
    (p_busqueda IS NULL OR d.cliente ILIKE '%' || p_busqueda || '%')
    AND (
      (p_estado IS NOT NULL AND d.estado = p_estado)
      OR (p_estado IS NULL AND d.estado = 1)
    )
  ORDER BY 
    CASE WHEN p_orden_col = 'id_detalle_pedido' AND p_orden_dir = 'ASC' THEN d.id_detalle_pedido END ASC,
    CASE WHEN p_orden_col = 'id_detalle_pedido' AND p_orden_dir = 'DESC' THEN d.id_detalle_pedido END DESC,
    CASE WHEN p_orden_col = 'cliente' AND p_orden_dir = 'ASC' THEN d.cliente END ASC,
    CASE WHEN p_orden_col = 'cliente' AND p_orden_dir = 'DESC' THEN d.cliente END DESC
  OFFSET (p_page_index - 1) * p_page_size
  LIMIT p_page_size;
END;
$$;


ALTER FUNCTION restaurant.sp_listar_detalles_pedido(p_busqueda character varying, p_estado integer, p_orden_col character varying, p_orden_dir character varying, p_page_index integer, p_page_size integer) OWNER TO postgres;

--
-- TOC entry 306 (class 1255 OID 16774)
-- Name: sp_listar_items(character varying, integer, character varying, character varying, integer, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_listar_items(p_busqueda character varying DEFAULT NULL::character varying, p_estado integer DEFAULT NULL::integer, p_orden_col character varying DEFAULT 'nombre'::character varying, p_orden_dir character varying DEFAULT 'ASC'::character varying, p_page_index integer DEFAULT 1, p_page_size integer DEFAULT 10) RETURNS TABLE(id_item integer, nombre character varying, descripcion character varying, stock integer, precio numeric, estado integer, id_categoria integer, nombre_categoria character varying, descripcion_categoria character varying, id_menu integer, nombre_menu character varying, total_rows bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id_item,
    i.nombre,
    i.descripcion,
    i.stock,
    i.precio,
    i.estado,
    i.id_categoria,
    c.nombre::VARCHAR,
    c.descripcion::VARCHAR,
    i.id_menu,
    m.nombre::VARCHAR,
    COUNT(*) OVER() AS total_rows
  FROM restaurant.item i
  LEFT JOIN restaurant.categoria c ON c.id_categoria = i.id_categoria
  LEFT JOIN restaurant.menu m ON m.id_menu = i.id_menu
  WHERE 
    (p_busqueda IS NULL OR i.nombre ILIKE '%' || p_busqueda || '%')
    AND (
      (p_estado IS NOT NULL AND i.estado = p_estado)
      OR (p_estado IS NULL AND i.estado = 1)
    )
  ORDER BY 
    CASE WHEN p_orden_col = 'nombre' AND p_orden_dir = 'ASC' THEN i.nombre END ASC,
    CASE WHEN p_orden_col = 'nombre' AND p_orden_dir = 'DESC' THEN i.nombre END DESC
  OFFSET (p_page_index - 1) * p_page_size
  LIMIT p_page_size;
END;
$$;


ALTER FUNCTION restaurant.sp_listar_items(p_busqueda character varying, p_estado integer, p_orden_col character varying, p_orden_dir character varying, p_page_index integer, p_page_size integer) OWNER TO postgres;

--
-- TOC entry 308 (class 1255 OID 16787)
-- Name: sp_listar_pedido_completo(character varying, integer, character varying, character varying, integer, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_listar_pedido_completo(p_busqueda character varying DEFAULT NULL::character varying, p_estado integer DEFAULT NULL::integer, p_orden_col character varying DEFAULT 'id_pedido'::character varying, p_orden_dir character varying DEFAULT 'DESC'::character varying, p_page_index integer DEFAULT 1, p_page_size integer DEFAULT 10) RETURNS TABLE(id_pedido integer, cantidad_total integer, precio_total numeric, estado_pedido integer, estado_descripcion character varying, fecha date, id_mesa integer, numero_mesa integer, descripcion_mesa character varying, id_usuario integer, usuario_nombre character varying, tipo_usuario character varying, id_item integer, nombre_item character varying, descripcion_item character varying, cantidad_item integer, subtotal_item numeric, total_rows bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id_pedido,
    p.cantidad,
    p.precio,
    p.estado,
CASE p.estado
  WHEN 0 THEN 'Cancelado'
  WHEN 1 THEN 'Solicitado'
  WHEN 2 THEN 'Pagado'
  WHEN 3 THEN 'Preparando'
  WHEN 4 THEN 'Entregado'
  WHEN 5 THEN 'En mesa'
  ELSE 'Desconocido'
END::VARCHAR AS estado_descripcion,

    p.fecha,
    m.id_mesa,
    m.numero AS numero_mesa,
    m.descripcion::VARCHAR AS descripcion_mesa,
	u.id_usuario,
    u.nombre::VARCHAR AS usuario_nombre,
    tu.descripcion::VARCHAR AS tipo_usuario,
    i.id_item,
    i.nombre::VARCHAR AS nombre_item,
    i.descripcion::VARCHAR AS descripcion_item,
    ip.cantidad AS cantidad_item,
    ip.subtotal AS subtotal_item,
    COUNT(*) OVER() AS total_rows
FROM restaurant.pedido p
INNER JOIN restaurant.mesa m ON m.id_mesa = p.id_mesa
INNER JOIN auth.usuario u ON u.id_usuario = p.id_usuario
INNER JOIN auth.tipousuario tu ON tu.id_tipousuario = u.id_tipousuario
LEFT JOIN restaurant.items_pedido ip ON ip.id_pedido = p.id_pedido
LEFT JOIN restaurant.item i ON i.id_item = ip.id_item

  WHERE
  (p_busqueda IS NULL OR u.nombre ILIKE '%' || p_busqueda || '%')
  AND (p_estado IS NULL OR p.estado = p_estado)
  ORDER BY
    CASE WHEN p_orden_col = 'id_pedido' AND p_orden_dir = 'ASC'  THEN p.id_pedido END ASC,
    CASE WHEN p_orden_col = 'id_pedido' AND p_orden_dir = 'DESC' THEN p.id_pedido END DESC,
    CASE WHEN p_orden_col = 'usuario_nombre' AND p_orden_dir = 'ASC' THEN u.nombre END ASC,
    CASE WHEN p_orden_col = 'usuario_nombre' AND p_orden_dir = 'DESC' THEN u.nombre END DESC
  OFFSET (p_page_index - 1) * p_page_size
  LIMIT p_page_size;
END;
$$;


ALTER FUNCTION restaurant.sp_listar_pedido_completo(p_busqueda character varying, p_estado integer, p_orden_col character varying, p_orden_dir character varying, p_page_index integer, p_page_size integer) OWNER TO postgres;

--
-- TOC entry 283 (class 1255 OID 16744)
-- Name: sp_listar_pedidos(character varying, integer, character varying, character varying, integer, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_listar_pedidos(p_busqueda character varying DEFAULT NULL::character varying, p_estado integer DEFAULT NULL::integer, p_orden_col character varying DEFAULT 'id_pedido'::character varying, p_orden_dir character varying DEFAULT 'DESC'::character varying, p_page_index integer DEFAULT 1, p_page_size integer DEFAULT 10) RETURNS TABLE(id_pedido integer, cantidad integer, precio numeric, estado integer, id_mesa integer, numero_mesa integer, descripcion_mesa character varying, estado_mesa integer, usuario_nombre character varying, descripcion_tipousuario character varying, total_rows bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id_pedido,
    p.cantidad,
    p.precio,
    p.estado,
    p.id_mesa,
    m.numero AS numero_mesa,
    m.descripcion::VARCHAR AS descripcion_mesa,
    m.estado AS estado_mesa,
    u.nombre::VARCHAR AS usuario_nombre,
    tu.descripcion::VARCHAR AS descripcion_tipousuario,
    COUNT(*) OVER() AS total_rows
  FROM restaurant.pedido p
  INNER JOIN restaurant.mesa m ON m.id_mesa = p.id_mesa
  INNER JOIN auth.usuario u ON u.id_usuario = p.id_usuario
  INNER JOIN auth.tipousuario tu ON tu.id_tipousuario = u.id_tipousuario
  WHERE 
    (p_busqueda IS NULL OR u.nombre ILIKE '%' || p_busqueda || '%')
    AND (
      (p_estado IS NOT NULL AND p.estado = p_estado)
      OR (p_estado IS NULL AND p.estado = 1)
    )
  ORDER BY 
    CASE WHEN p_orden_col = 'id_pedido' AND p_orden_dir = 'ASC' THEN p.id_pedido END ASC,
    CASE WHEN p_orden_col = 'id_pedido' AND p_orden_dir = 'DESC' THEN p.id_pedido END DESC,
    CASE WHEN p_orden_col = 'usuario_nombre' AND p_orden_dir = 'ASC' THEN u.nombre END ASC,
    CASE WHEN p_orden_col = 'usuario_nombre' AND p_orden_dir = 'DESC' THEN u.nombre END DESC
  OFFSET (p_page_index - 1) * p_page_size
  LIMIT p_page_size;
END;
$$;


ALTER FUNCTION restaurant.sp_listar_pedidos(p_busqueda character varying, p_estado integer, p_orden_col character varying, p_orden_dir character varying, p_page_index integer, p_page_size integer) OWNER TO postgres;

--
-- TOC entry 302 (class 1255 OID 16767)
-- Name: sp_listar_reservas(character varying, integer, character varying, character varying, integer, integer); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_listar_reservas(p_busqueda character varying DEFAULT NULL::character varying, p_estado integer DEFAULT NULL::integer, p_orden_col character varying DEFAULT 'id_reserva'::character varying, p_orden_dir character varying DEFAULT 'DESC'::character varying, p_page_index integer DEFAULT 1, p_page_size integer DEFAULT 10) RETURNS TABLE(id_reserva integer, fecha date, hora time without time zone, id_mesa integer, numero_mesa integer, descripcion_mesa character varying, estado_mesa integer, id_usuario integer, nombre_usuario character varying, tipo_usuario character varying, estado integer, total_rows bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id_reserva,
    r.fecha,
    r.hora,
    m.id_mesa,
    m.numero,
    m.descripcion::VARCHAR,
    m.estado::INTEGER,
    u.id_usuario,
    u.nombre::VARCHAR,
    tu.descripcion::VARCHAR,
    r.estado,
    COUNT(*) OVER() AS total_rows
  FROM restaurant.reserva r
  INNER JOIN restaurant.mesa m ON m.id_mesa = r.id_mesa
  INNER JOIN auth.usuario u ON u.id_usuario = r.id_usuario
  INNER JOIN auth.tipousuario tu ON tu.id_tipousuario = u.id_tipousuario
  WHERE
    (p_busqueda IS NULL OR u.nombre ILIKE '%' || p_busqueda || '%')
    AND (
      (p_estado IS NOT NULL AND r.estado = p_estado)
      OR (p_estado IS NULL AND r.estado = 1)
    )
  ORDER BY
    CASE WHEN p_orden_col = 'id_reserva' AND p_orden_dir = 'ASC' THEN r.id_reserva END ASC,
    CASE WHEN p_orden_col = 'id_reserva' AND p_orden_dir = 'DESC' THEN r.id_reserva END DESC,
    CASE WHEN p_orden_col = 'nombre_usuario' AND p_orden_dir = 'ASC' THEN u.nombre END ASC,
    CASE WHEN p_orden_col = 'nombre_usuario' AND p_orden_dir = 'DESC' THEN u.nombre END DESC
  OFFSET (p_page_index - 1) * p_page_size
  LIMIT p_page_size;
END;
$$;


ALTER FUNCTION restaurant.sp_listar_reservas(p_busqueda character varying, p_estado integer, p_orden_col character varying, p_orden_dir character varying, p_page_index integer, p_page_size integer) OWNER TO postgres;

--
-- TOC entry 276 (class 1255 OID 16702)
-- Name: sp_set_estado_libre_mesa(bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_set_estado_libre_mesa(p_id_mesa bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE restaurant.mesa
  SET estado = 0
  WHERE id_mesa = p_id_mesa;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró la mesa con id % para marcar como libre', p_id_mesa;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al cambiar estado a libre: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_set_estado_libre_mesa(p_id_mesa bigint) OWNER TO postgres;

--
-- TOC entry 275 (class 1255 OID 16701)
-- Name: sp_set_estado_ocupado_mesa(bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_set_estado_ocupado_mesa(p_id_mesa bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE restaurant.mesa
  SET estado = 1
  WHERE id_mesa = p_id_mesa;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró la mesa con id % para marcar como ocupada', p_id_mesa;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al cambiar estado a ocupado: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_set_estado_ocupado_mesa(p_id_mesa bigint) OWNER TO postgres;

--
-- TOC entry 298 (class 1255 OID 16775)
-- Name: sp_set_estado_reservado_mesa(bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_set_estado_reservado_mesa(p_id_mesa bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$BEGIN
  UPDATE restaurant.mesa
  SET estado = 2
  WHERE id_mesa = p_id_mesa;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró la mesa con id % para marcar como reservada', p_id_mesa;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al cambiar estado a reservada: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_set_estado_reservado_mesa(p_id_mesa bigint) OWNER TO postgres;

--
-- TOC entry 4522 (class 0 OID 0)
-- Dependencies: 298
-- Name: FUNCTION sp_set_estado_reservado_mesa(p_id_mesa bigint); Type: COMMENT; Schema: restaurant; Owner: postgres
--

COMMENT ON FUNCTION restaurant.sp_set_estado_reservado_mesa(p_id_mesa bigint) IS 'setea estado de la mesa a reservado (2)';


--
-- TOC entry 269 (class 1255 OID 16686)
-- Name: sp_update_menu(bigint, text, text); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_update_menu(p_id_menu bigint, p_nombre text, p_descripcion text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_id_menu INT;
BEGIN
  UPDATE restaurant.menu AS m
  SET 
    nombre = p_nombre,
    descripcion = p_descripcion
  WHERE m.id_menu = p_id_menu
  RETURNING m.id_menu
  INTO v_id_menu;

  -- Verificar si realmente actualizó
  IF v_id_menu IS NULL THEN
    RAISE EXCEPTION 'No se encontró el menú con id %', p_id_menu;
  END IF;

  -- Devolver mensaje exitoso
  RETURN format('Menú actualizado correctamente (id: %s)', v_id_menu);
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al actualizar el menú: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_update_menu(p_id_menu bigint, p_nombre text, p_descripcion text) OWNER TO postgres;

--
-- TOC entry 279 (class 1255 OID 16707)
-- Name: sp_update_mesa(bigint, bigint, bigint, text); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_update_mesa(p_id_mesa bigint, p_numero bigint, p_capacidad bigint, p_descripcion text) RETURNS TABLE(id_mesa integer, numero integer, capacidad integer, descripcion text, estado integer, id_restaurante integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  WITH updated AS (
    UPDATE restaurant.mesa AS m
    SET
      numero = p_numero,
      capacidad = p_capacidad,
      descripcion = p_descripcion
    WHERE m.id_mesa = p_id_mesa
    RETURNING
      m.id_mesa,
      m.numero,
      m.capacidad,
      m.descripcion,
      m.estado,
      m.id_restaurante
  )
  SELECT
    updated.id_mesa::INT,
    updated.numero::INT,
    updated.capacidad::INT,
    updated.descripcion::TEXT,
    updated.estado::INT,
    updated.id_restaurante::INT
  FROM updated;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al actualizar la mesa: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_update_mesa(p_id_mesa bigint, p_numero bigint, p_capacidad bigint, p_descripcion text) OWNER TO postgres;

--
-- TOC entry 271 (class 1255 OID 16694)
-- Name: sp_update_restaurante(bigint, text, text, text, text, bigint); Type: FUNCTION; Schema: restaurant; Owner: postgres
--

CREATE FUNCTION restaurant.sp_update_restaurante(p_id_restaurante bigint, p_nombre text, p_direccion text, p_telefono text, p_email text, p_id_menu bigint) RETURNS TABLE(id_restaurante integer, nombre text, direccion text, telefono text, email text, id_menu integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  WITH updated AS (
    UPDATE restaurant.restaurante AS r
    SET 
      nombre = p_nombre,
      direccion = p_direccion,
      telefono = p_telefono,
      email = p_email,
      id_menu = p_id_menu
    WHERE r.id_restaurante = p_id_restaurante
    RETURNING 
      r.id_restaurante, 
      r.nombre, 
      r.direccion, 
      r.telefono, 
      r.email, 
      r.id_menu
  )
  SELECT 
    updated.id_restaurante::INT,
    updated.nombre::TEXT,
    updated.direccion::TEXT,
    updated.telefono::TEXT,
    updated.email::TEXT,
    updated.id_menu::INT
  FROM updated;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontró el restaurante con id %', p_id_restaurante;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al actualizar el restaurante: %', SQLERRM;
END;
$$;


ALTER FUNCTION restaurant.sp_update_restaurante(p_id_restaurante bigint, p_nombre text, p_direccion text, p_telefono text, p_email text, p_id_menu bigint) OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16481)
-- Name: tipousuario; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.tipousuario (
    id_tipousuario integer NOT NULL,
    descripcion text NOT NULL,
    estado integer DEFAULT 1 NOT NULL,
    CONSTRAINT tipousuario_estado_check CHECK ((estado = ANY (ARRAY[0, 1])))
);


ALTER TABLE auth.tipousuario OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16480)
-- Name: tipousuario_id_tipousuario_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

CREATE SEQUENCE auth.tipousuario_id_tipousuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.tipousuario_id_tipousuario_seq OWNER TO postgres;

--
-- TOC entry 4523 (class 0 OID 0)
-- Dependencies: 219
-- Name: tipousuario_id_tipousuario_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: postgres
--

ALTER SEQUENCE auth.tipousuario_id_tipousuario_seq OWNED BY auth.tipousuario.id_tipousuario;


--
-- TOC entry 221 (class 1259 OID 16491)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

CREATE SEQUENCE auth.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 4524 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: postgres
--

ALTER SEQUENCE auth.usuario_id_usuario_seq OWNED BY auth.usuario.id_usuario;


--
-- TOC entry 226 (class 1259 OID 16520)
-- Name: categoria; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.categoria (
    id_categoria integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(200),
    estado integer DEFAULT 1 NOT NULL,
    CONSTRAINT categoria_estado_check CHECK ((estado = ANY (ARRAY[0, 1])))
);


ALTER TABLE restaurant.categoria OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16519)
-- Name: categoria_id_categoria_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.categoria_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.categoria_id_categoria_seq OWNER TO postgres;

--
-- TOC entry 4525 (class 0 OID 0)
-- Dependencies: 225
-- Name: categoria_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.categoria_id_categoria_seq OWNED BY restaurant.categoria.id_categoria;


--
-- TOC entry 238 (class 1259 OID 16607)
-- Name: detalle_pedido; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.detalle_pedido (
    id_detalle_pedido integer NOT NULL,
    cliente character varying(100) NOT NULL,
    direccion character varying(100) NOT NULL,
    id_pedido integer NOT NULL,
    estado integer DEFAULT 1
);


ALTER TABLE restaurant.detalle_pedido OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16606)
-- Name: detalle_pedido_id_detalle_pedido_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.detalle_pedido_id_detalle_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.detalle_pedido_id_detalle_pedido_seq OWNER TO postgres;

--
-- TOC entry 4526 (class 0 OID 0)
-- Dependencies: 237
-- Name: detalle_pedido_id_detalle_pedido_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.detalle_pedido_id_detalle_pedido_seq OWNED BY restaurant.detalle_pedido.id_detalle_pedido;


--
-- TOC entry 224 (class 1259 OID 16511)
-- Name: item; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.item (
    id_item integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(100),
    stock integer NOT NULL,
    precio numeric(10,2) NOT NULL,
    estado integer DEFAULT 1 NOT NULL,
    id_categoria integer,
    id_menu integer,
    CONSTRAINT item_estado_check CHECK ((estado = ANY (ARRAY[0, 1])))
);


ALTER TABLE restaurant.item OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16510)
-- Name: item_id_item_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.item_id_item_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.item_id_item_seq OWNER TO postgres;

--
-- TOC entry 4527 (class 0 OID 0)
-- Dependencies: 223
-- Name: item_id_item_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.item_id_item_seq OWNED BY restaurant.item.id_item;


--
-- TOC entry 244 (class 1259 OID 16709)
-- Name: items_pedido; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.items_pedido (
    id_item_pedido integer NOT NULL,
    id_pedido integer NOT NULL,
    id_item integer NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    estado integer DEFAULT 1 NOT NULL
);


ALTER TABLE restaurant.items_pedido OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16708)
-- Name: items_pedido_id_item_pedido_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.items_pedido_id_item_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.items_pedido_id_item_pedido_seq OWNER TO postgres;

--
-- TOC entry 4528 (class 0 OID 0)
-- Dependencies: 243
-- Name: items_pedido_id_item_pedido_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.items_pedido_id_item_pedido_seq OWNED BY restaurant.items_pedido.id_item_pedido;


--
-- TOC entry 228 (class 1259 OID 16534)
-- Name: menu; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.menu (
    id_menu integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(200),
    estado integer
);


ALTER TABLE restaurant.menu OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16533)
-- Name: menu_id_menu_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.menu_id_menu_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.menu_id_menu_seq OWNER TO postgres;

--
-- TOC entry 4529 (class 0 OID 0)
-- Dependencies: 227
-- Name: menu_id_menu_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.menu_id_menu_seq OWNED BY restaurant.menu.id_menu;


--
-- TOC entry 232 (class 1259 OID 16558)
-- Name: mesa; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.mesa (
    id_mesa integer NOT NULL,
    numero integer NOT NULL,
    capacidad integer NOT NULL,
    descripcion character varying(100),
    id_restaurante integer NOT NULL,
    estado integer DEFAULT 0 NOT NULL,
    CONSTRAINT mesa_estado_check CHECK ((estado = ANY (ARRAY[0, 1, 2, 3])))
);


ALTER TABLE restaurant.mesa OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16557)
-- Name: mesa_id_mesa_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.mesa_id_mesa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.mesa_id_mesa_seq OWNER TO postgres;

--
-- TOC entry 4530 (class 0 OID 0)
-- Dependencies: 231
-- Name: mesa_id_mesa_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.mesa_id_mesa_seq OWNED BY restaurant.mesa.id_mesa;


--
-- TOC entry 240 (class 1259 OID 16619)
-- Name: metodo_pago; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.metodo_pago (
    id_metodo integer NOT NULL,
    nombre character varying(50) NOT NULL,
    estado integer DEFAULT 1 NOT NULL
);


ALTER TABLE restaurant.metodo_pago OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16618)
-- Name: metodo_pago_id_metodo_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.metodo_pago_id_metodo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.metodo_pago_id_metodo_seq OWNER TO postgres;

--
-- TOC entry 4531 (class 0 OID 0)
-- Dependencies: 239
-- Name: metodo_pago_id_metodo_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.metodo_pago_id_metodo_seq OWNED BY restaurant.metodo_pago.id_metodo;


--
-- TOC entry 242 (class 1259 OID 16626)
-- Name: pago; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.pago (
    id_pago integer NOT NULL,
    id_pedido integer NOT NULL,
    fecha timestamp without time zone NOT NULL,
    monto numeric(10,2) NOT NULL,
    estado integer NOT NULL,
    id_metodo integer NOT NULL,
    CONSTRAINT pago_estado_check CHECK ((estado = ANY (ARRAY[0, 1])))
);


ALTER TABLE restaurant.pago OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16625)
-- Name: pago_id_pago_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.pago_id_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.pago_id_pago_seq OWNER TO postgres;

--
-- TOC entry 4532 (class 0 OID 0)
-- Dependencies: 241
-- Name: pago_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.pago_id_pago_seq OWNED BY restaurant.pago.id_pago;


--
-- TOC entry 236 (class 1259 OID 16587)
-- Name: pedido; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.pedido (
    id_pedido integer NOT NULL,
    cantidad integer NOT NULL,
    precio numeric(10,2) NOT NULL,
    id_usuario integer NOT NULL,
    estado integer DEFAULT 1 NOT NULL,
    id_mesa integer,
    fecha date DEFAULT now(),
    CONSTRAINT pedido_estado_check CHECK ((estado = ANY (ARRAY[0, 1, 2, 3, 4, 5])))
);


ALTER TABLE restaurant.pedido OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16586)
-- Name: pedido_id_pedido_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.pedido_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.pedido_id_pedido_seq OWNER TO postgres;

--
-- TOC entry 4533 (class 0 OID 0)
-- Dependencies: 235
-- Name: pedido_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.pedido_id_pedido_seq OWNED BY restaurant.pedido.id_pedido;


--
-- TOC entry 234 (class 1259 OID 16570)
-- Name: reserva; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.reserva (
    id_reserva integer NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    id_mesa integer NOT NULL,
    id_usuario integer NOT NULL,
    estado integer NOT NULL
);


ALTER TABLE restaurant.reserva OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16569)
-- Name: reserva_id_reserva_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.reserva_id_reserva_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.reserva_id_reserva_seq OWNER TO postgres;

--
-- TOC entry 4534 (class 0 OID 0)
-- Dependencies: 233
-- Name: reserva_id_reserva_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.reserva_id_reserva_seq OWNED BY restaurant.reserva.id_reserva;


--
-- TOC entry 230 (class 1259 OID 16546)
-- Name: restaurante; Type: TABLE; Schema: restaurant; Owner: postgres
--

CREATE TABLE restaurant.restaurante (
    id_restaurante integer NOT NULL,
    nombre character varying(100) NOT NULL,
    direccion character varying(200) NOT NULL,
    telefono character varying(20),
    email character varying(100),
    id_menu integer NOT NULL
);


ALTER TABLE restaurant.restaurante OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16545)
-- Name: restaurante_id_restaurante_seq; Type: SEQUENCE; Schema: restaurant; Owner: postgres
--

CREATE SEQUENCE restaurant.restaurante_id_restaurante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE restaurant.restaurante_id_restaurante_seq OWNER TO postgres;

--
-- TOC entry 4535 (class 0 OID 0)
-- Dependencies: 229
-- Name: restaurante_id_restaurante_seq; Type: SEQUENCE OWNED BY; Schema: restaurant; Owner: postgres
--

ALTER SEQUENCE restaurant.restaurante_id_restaurante_seq OWNED BY restaurant.restaurante.id_restaurante;


--
-- TOC entry 4268 (class 2604 OID 16484)
-- Name: tipousuario id_tipousuario; Type: DEFAULT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.tipousuario ALTER COLUMN id_tipousuario SET DEFAULT nextval('auth.tipousuario_id_tipousuario_seq'::regclass);


--
-- TOC entry 4270 (class 2604 OID 16495)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('auth.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 4274 (class 2604 OID 16523)
-- Name: categoria id_categoria; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.categoria ALTER COLUMN id_categoria SET DEFAULT nextval('restaurant.categoria_id_categoria_seq'::regclass);


--
-- TOC entry 4284 (class 2604 OID 16610)
-- Name: detalle_pedido id_detalle_pedido; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.detalle_pedido ALTER COLUMN id_detalle_pedido SET DEFAULT nextval('restaurant.detalle_pedido_id_detalle_pedido_seq'::regclass);


--
-- TOC entry 4272 (class 2604 OID 16514)
-- Name: item id_item; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.item ALTER COLUMN id_item SET DEFAULT nextval('restaurant.item_id_item_seq'::regclass);


--
-- TOC entry 4289 (class 2604 OID 16712)
-- Name: items_pedido id_item_pedido; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.items_pedido ALTER COLUMN id_item_pedido SET DEFAULT nextval('restaurant.items_pedido_id_item_pedido_seq'::regclass);


--
-- TOC entry 4276 (class 2604 OID 16537)
-- Name: menu id_menu; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.menu ALTER COLUMN id_menu SET DEFAULT nextval('restaurant.menu_id_menu_seq'::regclass);


--
-- TOC entry 4278 (class 2604 OID 16561)
-- Name: mesa id_mesa; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.mesa ALTER COLUMN id_mesa SET DEFAULT nextval('restaurant.mesa_id_mesa_seq'::regclass);


--
-- TOC entry 4286 (class 2604 OID 16622)
-- Name: metodo_pago id_metodo; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.metodo_pago ALTER COLUMN id_metodo SET DEFAULT nextval('restaurant.metodo_pago_id_metodo_seq'::regclass);


--
-- TOC entry 4288 (class 2604 OID 16629)
-- Name: pago id_pago; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.pago ALTER COLUMN id_pago SET DEFAULT nextval('restaurant.pago_id_pago_seq'::regclass);


--
-- TOC entry 4281 (class 2604 OID 16590)
-- Name: pedido id_pedido; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.pedido ALTER COLUMN id_pedido SET DEFAULT nextval('restaurant.pedido_id_pedido_seq'::regclass);


--
-- TOC entry 4280 (class 2604 OID 16573)
-- Name: reserva id_reserva; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.reserva ALTER COLUMN id_reserva SET DEFAULT nextval('restaurant.reserva_id_reserva_seq'::regclass);


--
-- TOC entry 4277 (class 2604 OID 16549)
-- Name: restaurante id_restaurante; Type: DEFAULT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.restaurante ALTER COLUMN id_restaurante SET DEFAULT nextval('restaurant.restaurante_id_restaurante_seq'::regclass);


--
-- TOC entry 4489 (class 0 OID 16481)
-- Dependencies: 220
-- Data for Name: tipousuario; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.tipousuario (id_tipousuario, descripcion, estado) FROM stdin;
1	administrador	1
3	mozo	1
2	cocinero	1
\.


--
-- TOC entry 4491 (class 0 OID 16492)
-- Dependencies: 222
-- Data for Name: usuario; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.usuario (id_usuario, nombre, correo, password, id_tipousuario, estado, id_restaurante) FROM stdin;
4	Manuela Marder	manuela.marder@example.com	$2b$10$ow6FIJrw5nm/yoDpdlvRmeFtDMsKhNqV0tZ5eH3Mr4owJkcWwZmqG	1	1	\N
5	Valeria Masa	valeria.masa@example.com	$2b$10$2kZwELDoYoS29yL2gdVUoeLrurNqC4f8n1kUdmbxfi3QpaS1ZvSBa	2	1	\N
12	Anna Gunn	skyler@white.com	$2b$10$exnrRjwJGqg2jkds5Q4hnuhYwX0ENE/0B09t/s9pboxvWlktRyFK6	3	1	\N
2	Melisa Lezcano	melissa.lezcano@example.com	$2b$10$EfXMr0cX7UP5JpNgX/TYXeE9mQZJ3pxwzQY2si6XEuAnB6Wg6X94q	1	1	\N
1	Nuevo Nombre	nuevo.correo@example.com	$2b$10$YeFTyD2THNXpBk6M3eFJC.PuvP/fEjLrr0bqRdmfSgiDpy9fYzIXS	1	1	\N
6	Phoebe	phoebe@example.com	$2a$10$W8f77jnDrwh.u6vTuK4EbeERxSeefpkaUrRMONk9F0CDwNbzdFx02	3	1	\N
8	Saul Goodman	saul@goodman.com	$2b$10$uPXt8Nmp8CXqJbdY346HL.Fii.P3xb/SSNvlxsk2M1c7fw9VTpnGO	3	1	\N
9	Jesse Pinkman	jesse@pinkman.com	$2b$10$2mOPaEu08h46u8c09KvJDe3tQe/b8muu3W7NWk8A2iWu0NUAFdobm	2	1	\N
10	Walter White	walter@white.com	$2b$10$JB5I12BW3gNWC/HVAoweLexoLw.zTFnISncYv5/vhZaqSdWXeo5IC	2	0	1
7	user	user@testchange333.com	$2b$10$BEGQR4O/ty3cN5SjFqjhWOdRQpuspN6a.u0EmjokMmVBbIhF6zcQG	2	1	\N
11	Walter Jr.	walter@junior.com	$2b$10$f.q0X38fvyhgznGOgqE1q./b9DP092454Q03A9UghJN/TAwV2ZG5a	3	1	\N
3	Agustin Lago	agustin.lago@example.com	$2b$10$2Jp3XvndKSOv580UtBT1P.pSx6v4OWJ7HGy9RRU5Z5mhJ./E7V0ra	3	1	\N
\.


--
-- TOC entry 4495 (class 0 OID 16520)
-- Dependencies: 226
-- Data for Name: categoria; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.categoria (id_categoria, nombre, descripcion, estado) FROM stdin;
2	Platos Principales	Platos fuertes para la comida principal	1
3	Postres	Dulces para finalizar la comida	1
1	Entradas	Platos para iniciar la comida	1
4	Bebidas	Refrescos, jugos y bebidas alcohólicas	1
\.


--
-- TOC entry 4507 (class 0 OID 16607)
-- Dependencies: 238
-- Data for Name: detalle_pedido; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.detalle_pedido (id_detalle_pedido, cliente, direccion, id_pedido, estado) FROM stdin;
\.


--
-- TOC entry 4493 (class 0 OID 16511)
-- Dependencies: 224
-- Data for Name: item; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.item (id_item, nombre, descripcion, stock, precio, estado, id_categoria, id_menu) FROM stdin;
1	Lomo Saltado	Carne de res, cebolla, papas fritas, tomate y arroz	20	15000.00	1	2	1
6	Pizza Margherita	Pizza tradicional italiana con salsa de tomate, mozzarella y albahaca	10	15.99	1	1	1
3	Hamburguesa especial	Pan, carne, lechuga, tomate, jamon, queso, huevo y papas	10	2500.00	1	2	1
4	Ensalada César	Lechuga, pollo, crutones, queso parmesano y aderezo César	15	7000.00	1	1	1
13	Ravioles de Ricota	Pasta rellena con ricota y espinaca, acompañada de salsa bolognesa	25	6800.00	1	2	1
14	Brownie con Helado	Brownie de chocolate con bocha de helado de vainilla	30	5550.00	0	3	1
2	Hamburguesa completa	Pan, carne, lechuga, tomate y papas	10	2500.00	0	2	1
5	Flan de Caramelo	Postre tradicional de huevo y caramelo	25	5500.00	0	3	1
\.


--
-- TOC entry 4513 (class 0 OID 16709)
-- Dependencies: 244
-- Data for Name: items_pedido; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.items_pedido (id_item_pedido, id_pedido, id_item, cantidad, subtotal, estado) FROM stdin;
197	99	1	2	30000.00	1
198	99	6	1	15.99	1
199	99	4	4	28000.00	1
200	99	13	1	6800.00	1
201	98	6	1	15.99	1
202	98	13	2	13600.00	1
203	100	1	1	15000.00	1
204	100	6	2	31.98	1
205	100	13	1	6800.00	1
206	101	13	1	6800.00	1
209	102	6	3	47.97	1
210	102	4	4	28000.00	1
211	103	13	1	6800.00	1
212	104	3	1	2500.00	1
213	105	1	1	15000.00	1
214	105	13	1	6800.00	1
215	105	3	1	2500.00	1
216	105	4	1	7000.00	1
221	107	13	3	20400.00	1
222	108	13	2	13600.00	1
223	108	1	2	30000.00	1
224	109	13	4	27200.00	1
225	106	6	1	15.99	1
226	106	1	1	15000.00	1
227	106	4	1	7000.00	1
228	106	13	2	13600.00	1
229	110	13	1	6800.00	1
230	110	6	1	15.99	1
231	110	1	1	15000.00	1
\.


--
-- TOC entry 4497 (class 0 OID 16534)
-- Dependencies: 228
-- Data for Name: menu; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.menu (id_menu, nombre, descripcion, estado) FROM stdin;
1	Menú Ejecutivo	Menú del día con entrada, plato principal y postre	1
2	Menú Fin de Semana	Especial de fin de semana con platos exclusivos	1
3	Menú Infantil 	Especial para los más pequeños	0
\.


--
-- TOC entry 4501 (class 0 OID 16558)
-- Dependencies: 232
-- Data for Name: mesa; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.mesa (id_mesa, numero, capacidad, descripcion, id_restaurante, estado) FROM stdin;
7	7	6	Barra 	1	0
8	8	5	Barra  	1	0
2	2	3	Planta alta 	1	1
4	4	6	Planta baja 	1	1
1	1	3	Tercer Piso	1	1
11	11	2	Ventanal	1	2
9	9	6	Planta Baja	1	1
\.


--
-- TOC entry 4509 (class 0 OID 16619)
-- Dependencies: 240
-- Data for Name: metodo_pago; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.metodo_pago (id_metodo, nombre, estado) FROM stdin;
1	Tarjeta de Credito	1
2	Tarjeta de Debito	1
3	Transferencia Bancaria	1
12	Paypal	1
13	Mercado Pago	1
\.


--
-- TOC entry 4511 (class 0 OID 16626)
-- Dependencies: 242
-- Data for Name: pago; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.pago (id_pago, id_pedido, fecha, monto, estado, id_metodo) FROM stdin;
23	100	2025-06-16 00:12:29.720849	21831.98	1	1
25	101	2025-06-18 21:02:09.588654	6800.00	1	12
26	103	2025-06-18 21:48:04.690948	6800.00	1	3
27	106	2025-06-19 18:44:06.873827	35615.99	1	12
28	105	2025-06-20 01:09:38.199529	31300.00	1	12
24	99	2025-06-16 19:10:30.150674	64815.99	0	3
\.


--
-- TOC entry 4505 (class 0 OID 16587)
-- Dependencies: 236
-- Data for Name: pedido; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.pedido (id_pedido, cantidad, precio, id_usuario, estado, id_mesa, fecha) FROM stdin;
98	3	13615.99	2	1	1	2025-06-16
100	4	21831.98	2	2	4	2025-10-16
102	7	28047.97	2	0	4	2025-06-16
99	8	64815.99	2	2	2	2025-07-16
101	1	6800.00	2	2	1	2025-06-16
103	1	6800.00	2	2	2	2025-06-16
107	3	20400.00	3	1	2	2025-06-18
104	1	2500.00	1	3	1	2025-06-18
108	4	43600.00	2	0	4	2025-06-18
109	4	27200.00	1	1	4	2025-06-18
106	5	35615.99	2	2	1	2025-06-19
110	3	21815.99	2	1	1	2025-06-20
105	4	31300.00	1	2	11	2025-06-18
\.


--
-- TOC entry 4503 (class 0 OID 16570)
-- Dependencies: 234
-- Data for Name: reserva; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.reserva (id_reserva, fecha, hora, id_mesa, id_usuario, estado) FROM stdin;
2	2025-05-13	20:30:00	1	5	1
1	2025-05-13	20:30:00	1	5	0
\.


--
-- TOC entry 4499 (class 0 OID 16546)
-- Dependencies: 230
-- Data for Name: restaurante; Type: TABLE DATA; Schema: restaurant; Owner: postgres
--

COPY restaurant.restaurante (id_restaurante, nombre, direccion, telefono, email, id_menu) FROM stdin;
1	Restaurante La Pérgola	Av. Libertad 456	3794-567890	lapergola@ejemplo.com	2
\.


--
-- TOC entry 4536 (class 0 OID 0)
-- Dependencies: 219
-- Name: tipousuario_id_tipousuario_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.tipousuario_id_tipousuario_seq', 2, true);


--
-- TOC entry 4537 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.usuario_id_usuario_seq', 12, true);


--
-- TOC entry 4538 (class 0 OID 0)
-- Dependencies: 225
-- Name: categoria_id_categoria_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.categoria_id_categoria_seq', 16, true);


--
-- TOC entry 4539 (class 0 OID 0)
-- Dependencies: 237
-- Name: detalle_pedido_id_detalle_pedido_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.detalle_pedido_id_detalle_pedido_seq', 1, true);


--
-- TOC entry 4540 (class 0 OID 0)
-- Dependencies: 223
-- Name: item_id_item_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.item_id_item_seq', 17, true);


--
-- TOC entry 4541 (class 0 OID 0)
-- Dependencies: 243
-- Name: items_pedido_id_item_pedido_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.items_pedido_id_item_pedido_seq', 231, true);


--
-- TOC entry 4542 (class 0 OID 0)
-- Dependencies: 227
-- Name: menu_id_menu_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.menu_id_menu_seq', 9, true);


--
-- TOC entry 4543 (class 0 OID 0)
-- Dependencies: 231
-- Name: mesa_id_mesa_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.mesa_id_mesa_seq', 12, true);


--
-- TOC entry 4544 (class 0 OID 0)
-- Dependencies: 239
-- Name: metodo_pago_id_metodo_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.metodo_pago_id_metodo_seq', 13, true);


--
-- TOC entry 4545 (class 0 OID 0)
-- Dependencies: 241
-- Name: pago_id_pago_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.pago_id_pago_seq', 28, true);


--
-- TOC entry 4546 (class 0 OID 0)
-- Dependencies: 235
-- Name: pedido_id_pedido_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.pedido_id_pedido_seq', 110, true);


--
-- TOC entry 4547 (class 0 OID 0)
-- Dependencies: 233
-- Name: reserva_id_reserva_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.reserva_id_reserva_seq', 2, true);


--
-- TOC entry 4548 (class 0 OID 0)
-- Dependencies: 229
-- Name: restaurante_id_restaurante_seq; Type: SEQUENCE SET; Schema: restaurant; Owner: postgres
--

SELECT pg_catalog.setval('restaurant.restaurante_id_restaurante_seq', 1, true);


--
-- TOC entry 4300 (class 2606 OID 16490)
-- Name: tipousuario tipousuario_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.tipousuario
    ADD CONSTRAINT tipousuario_pkey PRIMARY KEY (id_tipousuario);


--
-- TOC entry 4302 (class 2606 OID 16503)
-- Name: usuario usuario_correo_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);


--
-- TOC entry 4304 (class 2606 OID 16501)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4309 (class 2606 OID 16527)
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria);


--
-- TOC entry 4321 (class 2606 OID 16612)
-- Name: detalle_pedido detalle_pedido_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.detalle_pedido
    ADD CONSTRAINT detalle_pedido_pkey PRIMARY KEY (id_detalle_pedido);


--
-- TOC entry 4306 (class 2606 OID 16518)
-- Name: item item_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id_item);


--
-- TOC entry 4327 (class 2606 OID 16716)
-- Name: items_pedido items_pedido_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.items_pedido
    ADD CONSTRAINT items_pedido_pkey PRIMARY KEY (id_item_pedido);


--
-- TOC entry 4311 (class 2606 OID 16539)
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id_menu);


--
-- TOC entry 4315 (class 2606 OID 16563)
-- Name: mesa mesa_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.mesa
    ADD CONSTRAINT mesa_pkey PRIMARY KEY (id_mesa);


--
-- TOC entry 4323 (class 2606 OID 16624)
-- Name: metodo_pago metodo_pago_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.metodo_pago
    ADD CONSTRAINT metodo_pago_pkey PRIMARY KEY (id_metodo);


--
-- TOC entry 4325 (class 2606 OID 16632)
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 4319 (class 2606 OID 16594)
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id_pedido);


--
-- TOC entry 4317 (class 2606 OID 16575)
-- Name: reserva reserva_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.reserva
    ADD CONSTRAINT reserva_pkey PRIMARY KEY (id_reserva);


--
-- TOC entry 4313 (class 2606 OID 16551)
-- Name: restaurante restaurante_pkey; Type: CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.restaurante
    ADD CONSTRAINT restaurante_pkey PRIMARY KEY (id_restaurante);


--
-- TOC entry 4307 (class 1259 OID 16780)
-- Name: categoria_nombre_lower_unique; Type: INDEX; Schema: restaurant; Owner: postgres
--

CREATE UNIQUE INDEX categoria_nombre_lower_unique ON restaurant.categoria USING btree (lower((nombre)::text));


--
-- TOC entry 4328 (class 2606 OID 16667)
-- Name: usuario fk_usuario_restaurante; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.usuario
    ADD CONSTRAINT fk_usuario_restaurante FOREIGN KEY (id_restaurante) REFERENCES restaurant.restaurante(id_restaurante);


--
-- TOC entry 4329 (class 2606 OID 16504)
-- Name: usuario fk_usuario_tipousuario; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.usuario
    ADD CONSTRAINT fk_usuario_tipousuario FOREIGN KEY (id_tipousuario) REFERENCES auth.tipousuario(id_tipousuario) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4338 (class 2606 OID 16613)
-- Name: detalle_pedido fk_detalle_pedido; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.detalle_pedido
    ADD CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido) REFERENCES restaurant.pedido(id_pedido);


--
-- TOC entry 4341 (class 2606 OID 16722)
-- Name: items_pedido fk_item; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.items_pedido
    ADD CONSTRAINT fk_item FOREIGN KEY (id_item) REFERENCES restaurant.item(id_item) ON DELETE CASCADE;


--
-- TOC entry 4330 (class 2606 OID 16528)
-- Name: item fk_item_categoria; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.item
    ADD CONSTRAINT fk_item_categoria FOREIGN KEY (id_categoria) REFERENCES restaurant.categoria(id_categoria) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4331 (class 2606 OID 16643)
-- Name: item fk_item_menu; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.item
    ADD CONSTRAINT fk_item_menu FOREIGN KEY (id_menu) REFERENCES restaurant.menu(id_menu) ON DELETE SET NULL;


--
-- TOC entry 4333 (class 2606 OID 16564)
-- Name: mesa fk_mesa_restaurante; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.mesa
    ADD CONSTRAINT fk_mesa_restaurante FOREIGN KEY (id_restaurante) REFERENCES restaurant.restaurante(id_restaurante);


--
-- TOC entry 4339 (class 2606 OID 16633)
-- Name: pago fk_pago_metodo; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.pago
    ADD CONSTRAINT fk_pago_metodo FOREIGN KEY (id_metodo) REFERENCES restaurant.metodo_pago(id_metodo);


--
-- TOC entry 4340 (class 2606 OID 16638)
-- Name: pago fk_pago_pedido; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.pago
    ADD CONSTRAINT fk_pago_pedido FOREIGN KEY (id_pedido) REFERENCES restaurant.pedido(id_pedido);


--
-- TOC entry 4342 (class 2606 OID 16717)
-- Name: items_pedido fk_pedido; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.items_pedido
    ADD CONSTRAINT fk_pedido FOREIGN KEY (id_pedido) REFERENCES restaurant.pedido(id_pedido) ON DELETE CASCADE;


--
-- TOC entry 4336 (class 2606 OID 16662)
-- Name: pedido fk_pedido_mesa; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.pedido
    ADD CONSTRAINT fk_pedido_mesa FOREIGN KEY (id_mesa) REFERENCES restaurant.mesa(id_mesa);


--
-- TOC entry 4337 (class 2606 OID 16600)
-- Name: pedido fk_pedido_usuario; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.pedido
    ADD CONSTRAINT fk_pedido_usuario FOREIGN KEY (id_usuario) REFERENCES auth.usuario(id_usuario);


--
-- TOC entry 4334 (class 2606 OID 16576)
-- Name: reserva fk_reserva_mesa; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.reserva
    ADD CONSTRAINT fk_reserva_mesa FOREIGN KEY (id_mesa) REFERENCES restaurant.mesa(id_mesa);


--
-- TOC entry 4335 (class 2606 OID 16581)
-- Name: reserva fk_reserva_usuario; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.reserva
    ADD CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario) REFERENCES auth.usuario(id_usuario);


--
-- TOC entry 4332 (class 2606 OID 16552)
-- Name: restaurante fk_restaurante_menu; Type: FK CONSTRAINT; Schema: restaurant; Owner: postgres
--

ALTER TABLE ONLY restaurant.restaurante
    ADD CONSTRAINT fk_restaurante_menu FOREIGN KEY (id_menu) REFERENCES restaurant.menu(id_menu);


-- Completed on 2025-06-21 17:43:52 -03

--
-- PostgreSQL database dump complete
--

