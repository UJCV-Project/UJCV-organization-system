--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:7Koy1p2G732/tJuBk9Moqg==$gHDsutj13TiSDLKt11OE0RtIuYlVd42VjIkjAQYNkFg=:/bj9R4IX6yh3enmGIZySEoEdii3P2GnS+TAHbp81R/E=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "classes" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: classes; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE classes WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE classes OWNER TO postgres;

\connect classes

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: CourseStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CourseStatus" AS ENUM (
    'activo',
    'inactivo'
);


ALTER TYPE public."CourseStatus" OWNER TO postgres;

--
-- Name: DegreeStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DegreeStatus" AS ENUM (
    'activo',
    'inactivo'
);


ALTER TYPE public."DegreeStatus" OWNER TO postgres;

--
-- Name: ProfessorStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProfessorStatus" AS ENUM (
    'activo',
    'inactivo',
    'jubilado',
    'de_baja'
);


ALTER TYPE public."ProfessorStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AcademicPeriod; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AcademicPeriod" (
    id text NOT NULL,
    year integer NOT NULL,
    period integer NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AcademicPeriod" OWNER TO postgres;

--
-- Name: Course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Course" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "unitValue" integer NOT NULL,
    "theoryHours" integer NOT NULL,
    "practiceHours" integer NOT NULL,
    status public."CourseStatus" DEFAULT 'activo'::public."CourseStatus" NOT NULL
);


ALTER TABLE public."Course" OWNER TO postgres;

--
-- Name: Curriculum; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Curriculum" (
    "degreeId" text NOT NULL,
    "courseId" text NOT NULL,
    semester integer
);


ALTER TABLE public."Curriculum" OWNER TO postgres;

--
-- Name: Degree; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Degree" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    status public."DegreeStatus" DEFAULT 'activo'::public."DegreeStatus" NOT NULL
);


ALTER TABLE public."Degree" OWNER TO postgres;

--
-- Name: Event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    "scheduleId" text NOT NULL,
    day integer NOT NULL,
    "startTime" integer NOT NULL,
    "endTime" integer NOT NULL
);


ALTER TABLE public."Event" OWNER TO postgres;

--
-- Name: Professor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Professor" (
    id text NOT NULL,
    code character varying(20) NOT NULL,
    "firstName" character varying(50) NOT NULL,
    "lastName" character varying(50) NOT NULL,
    email text NOT NULL,
    "phoneNumber" character varying(20) NOT NULL,
    status public."ProfessorStatus" DEFAULT 'activo'::public."ProfessorStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Professor" OWNER TO postgres;

--
-- Name: Room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Room" (
    id text NOT NULL,
    code character varying(10) NOT NULL
);


ALTER TABLE public."Room" OWNER TO postgres;

--
-- Name: Schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Schedule" (
    id text NOT NULL,
    "academicPeriodId" text NOT NULL,
    "professorId" text NOT NULL,
    "courseId" text NOT NULL,
    "roomId" text NOT NULL,
    section text NOT NULL
);


ALTER TABLE public."Schedule" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: AcademicPeriod; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AcademicPeriod" (id, year, period, "startDate", "endDate") FROM stdin;
8ff0cae6-60d4-4a09-9b8b-71cb87e289ce	2025	1	2025-01-01 00:00:00	2025-05-01 00:00:00
11ea55a0-1f78-46ac-8793-3c67e059d827	2025	2	2025-05-01 00:00:00	2025-09-01 00:00:00
664e5b62-a16f-455b-ac86-bb1b90225cf3	2025	3	2025-09-01 00:00:00	2026-01-01 00:00:00
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Course" (id, code, name, "unitValue", "theoryHours", "practiceHours", status) FROM stdin;
b414eedb-d222-4dc0-b131-c11df082594b	FIL1015	FILOSOFIA	3	3	0	activo
f444b4b9-e580-4969-a0c4-12e7348b4489	ESP1014	ESPAÑOL	3	3	0	activo
f6026cdc-d001-4125-b42a-20a2e531e0a3	MAT1014	ALGEBRA	4	4	0	activo
f1b026d9-d17a-42c8-b484-f1bee00b7902	MAT1015	GEOMETRIA Y TRIGONOMETRIA	4	4	0	activo
264dfaed-5b2f-44bd-8a94-2b7dffc2862f	IDI1015	IDIOMA EXTRANJERO	5	5	0	activo
f5305bc1-8f6e-45ee-85b4-3a0be5ce9b07	IIT1015	ALFABETIZACION DIGITAL	3	1	6	activo
fa51da09-7d19-4d77-a9ab-9bd8c1ad73d0	ESP1024	TECNICAS DE COMUNICACION	4	3	3	activo
6e756e16-1746-486d-a976-77877ca338b7	MAT1021	VECTORES Y MATRICES	3	3	0	activo
8d3c16ee-5544-4892-8acb-a653b03ced15	MAT1022	CALCULO I	4	4	0	activo
98659a5e-a4a7-4bda-9f60-9a83955f0834	IDI1026	IDIOMA EXTRANJERO II	5	5	0	activo
345c6e3b-bdbf-441a-99ca-cc7e64852708	MAT1030	MATEMATICAS DISCRETAS	3	3	0	activo
142fd540-0cb7-4044-ad05-f7d34e270e4d	MAT1032	CALCULO II	4	4	0	activo
e54ac0b5-95f4-4b81-ac52-cd5fddd5987c	FIS1035	FISICA I	4	3	3	activo
af694082-c504-48ac-afe3-d0115b82fe9d	IDI1037	IDIOMA EXTRANJERO III	5	5	0	activo
c8e20c45-5444-4496-ae04-bbaf9d96c8f9	EDF2011	DEPORTE/ARTE	1	0	3	activo
da4b2744-d83c-4fe0-849b-eb32735ff83e	IIT3012	PROGRAMACION DE DISPOSITIVOS MOVILES	3	3	0	activo
765039b3-09fb-4a21-abd8-3982ac2c2445	IIT3014	BASE DE DATOS RELACIONALES	4	4	0	activo
966e1b4f-3490-4e72-894a-f3e12f4c2407	IIT3015	ELECTRONICA DIGITAL	4	3	3	activo
21561c4d-bc34-461f-9072-c5a9648514dd	ADM2010	CONTABILIDAD I	3	2	3	activo
b4afd69d-cba4-483b-9d41-e645e67a029c	IIT3021	REDES Y COMUNICACIONES I	4	3	3	activo
80d13a4f-1770-4620-840b-04537a80ff16	IIT3022	ANALISIS Y DISEÑO DE SISTEMAS DE INFORMACION	3	3	0	activo
84fa8311-f829-4485-a2d3-2ce36b0c5f21	IIT3024	BASE DE DATOS ORIENTADAS A OBJETOS	4	4	0	activo
65e2b011-988d-45ce-8e95-68560a5d9212	IIT3025	ARQUITECTURA DE COMPUTADORAS	4	3	3	activo
75bc4d1d-c5b6-4991-a7c8-b14941340bfe	ADM3011	ADMINISTRACION DE RECURSOS HUMANOS	3	3	0	activo
381e625a-7952-41f7-83b1-bb8e1667f4bc	IIT3031	REDES Y COMUNICACIONES II	4	3	3	activo
c69837ef-6b94-4a65-9aa2-36b9cceb2aab	IIT3032	INGENIERIA DE SOFTWARE I	3	3	0	activo
25c2c965-ae16-4ebd-a84f-ba220e5628a5	IIT3033	DISEÑO WEB Y ADMINISTRACION DE CONTENIDOS	4	3	3	activo
33d0a956-1372-41a4-9592-7d851b8fc578	IIT3035	MICROCONTROLADORES	4	3	3	activo
3122dcff-4220-4f20-a9be-8d4d001f527d	ADM3032	PLANEACION ESTRATEGICA	3	2	3	activo
c1a05c05-f8c8-4ba1-aa4f-46900bfe5999	HIS2024	HISTORIA DE HONDURAS	3	3	0	activo
b709754f-0792-4f1b-bed8-453d326fdc4f	IIT2010	FUNDAMENTOS DE PROGRAMACION	4	3	3	activo
ef86fa48-d9bc-48c2-acb9-c6006f7c1924	MAT2015	ECUACIONES DIFERENCIALES	3	3	0	activo
eac169ed-64db-45cb-8a65-ccdabaec67db	FIS2012	FISICA II	4	3	3	activo
01aa889b-3136-44a0-9eb4-627f48915cc8	SOC1014	SOCIOLOGIA	3	3	0	activo
0c681e85-1c77-404f-90ae-af28cd784f2f	MAT2095	PROBABILIDADES Y ESTADISTICA	3	3	0	activo
16bdd2d1-d857-4ccc-88cc-08a309e87436	IIT2025	PROGRAMACION I	4	3	3	activo
ca1641aa-0179-4569-b1a7-bc699f8ce41e	MAT2024	ANALISIS NUMERICO	3	3	0	activo
f7017585-c210-45cb-8763-f9fe6c2dee60	FIS2025	FISICA III	4	3	3	activo
68a0068a-1560-41fb-9861-aefa2fdd098c	BIO1034	ECOLOGIA	3	3	0	activo
3a3aa8cd-8329-4710-8373-7172a886e391	IIT3011	SISTEMAS OPERATIVOS II	4	3	3	activo
443c5b4c-1aff-4db6-ad50-ffdec184cf40	IIT2032	SISTEMAS OPERATIVOS I	3	2	3	activo
c9382592-84e2-4a0e-97d4-431517a0e637	IIT2035	PROGRAMACION II	4	3	3	activo
d43cc152-6b23-47e1-bc46-dc86ad6df194	IIT2036	ESTRUCTURA DE DATOS Y ALGORITMOS	3	3	0	activo
b26c1683-4867-477f-bc3c-51236411a2d5	IIT2037	PRINCIPIOS DE ELECTRONICA	4	3	3	activo
7a434ec5-a023-4a1f-bf18-17cdd535de7f	ADM2011	ADMINISTRACION I	3	3	0	activo
192153be-1e77-4575-829a-2ade38758d63	IIT4011	SEGURIDAD DE LA INFORMACION	4	4	0	activo
8413e772-ee5d-4068-9485-c41f0d94227c	IIT4012	INGENIERIA DE SOFTWARE II	3	3	0	activo
5f0a82a4-07af-4541-a5de-e091b4610e20	IIT4013	DESARROLLO DE APLICACIONES WEB	4	3	3	activo
0ae10a12-58af-4e3d-9ca2-f994eacb6af2	IIT4015	MICROPROCESADORES	4	3	3	activo
788843ec-454a-4b8a-9d2f-8e9d0daeacc8	ADM4012	GESTION DE LA INNOVACION	3	3	0	activo
055c3b86-6220-4d07-bff3-32050393f895	IIT4021	SEGURIDAD EN REDES INALAMBRICAS	3	3	0	activo
6e701975-14f6-4ae7-b085-3fac4f1820af	IIT4022	AUDITORIA DE SISTEMAS DE INFORMACION	4	4	0	activo
0fa02bea-1d24-4743-b58c-54b5192099d8	IIT4027	ECOLOGIA DE LA INFORMACION	3	3	0	activo
2859fc59-2f62-4112-af6a-f6066bafcbac	IIT4028	CABLEADO ESTRUCTURADO	3	2	3	activo
98f680eb-56e8-428c-ad5d-2bc7fee4bbf8	ADM4021	GERENCIA DE PROYECTOS	3	3	0	activo
e0b68173-ecbe-40b5-9802-032879e333f6	IIT4031	GESTION DE LA SEGURIDAD DE LA INFORMACION	3	3	0	activo
f64fa713-0f29-4073-86fd-adec2b4e4839	ADM2012	METODOS DE INVESTIGACION	3	3	0	activo
5c901c31-40c0-4e7f-9357-92979d89c4e7	DER4033	DERECHO DIGITAL	3	3	0	activo
c9552e1c-b109-44dc-9af3-6ae411d99bfb	ADM4032	DESARROLLO EMPRESARIAL	3	3	0	activo
123fedef-5555-429f-9f5e-8c5db4e45392	IIT4032	GERENCIA DE LA INFOTECNOLOGIA	3	3	0	activo
\.


--
-- Data for Name: Curriculum; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Curriculum" ("degreeId", "courseId", semester) FROM stdin;
a264a5c4-7998-4682-b7c0-282f080dff54	f6026cdc-d001-4125-b42a-20a2e531e0a3	1
a264a5c4-7998-4682-b7c0-282f080dff54	f444b4b9-e580-4969-a0c4-12e7348b4489	1
a264a5c4-7998-4682-b7c0-282f080dff54	b414eedb-d222-4dc0-b131-c11df082594b	1
a264a5c4-7998-4682-b7c0-282f080dff54	f1b026d9-d17a-42c8-b484-f1bee00b7902	1
a264a5c4-7998-4682-b7c0-282f080dff54	264dfaed-5b2f-44bd-8a94-2b7dffc2862f	1
a264a5c4-7998-4682-b7c0-282f080dff54	f5305bc1-8f6e-45ee-85b4-3a0be5ce9b07	2
a264a5c4-7998-4682-b7c0-282f080dff54	8d3c16ee-5544-4892-8acb-a653b03ced15	2
a264a5c4-7998-4682-b7c0-282f080dff54	6e756e16-1746-486d-a976-77877ca338b7	2
a264a5c4-7998-4682-b7c0-282f080dff54	98659a5e-a4a7-4bda-9f60-9a83955f0834	2
a264a5c4-7998-4682-b7c0-282f080dff54	fa51da09-7d19-4d77-a9ab-9bd8c1ad73d0	2
a264a5c4-7998-4682-b7c0-282f080dff54	142fd540-0cb7-4044-ad05-f7d34e270e4d	3
a264a5c4-7998-4682-b7c0-282f080dff54	af694082-c504-48ac-afe3-d0115b82fe9d	3
a264a5c4-7998-4682-b7c0-282f080dff54	e54ac0b5-95f4-4b81-ac52-cd5fddd5987c	3
a264a5c4-7998-4682-b7c0-282f080dff54	345c6e3b-bdbf-441a-99ca-cc7e64852708	3
a264a5c4-7998-4682-b7c0-282f080dff54	c8e20c45-5444-4496-ae04-bbaf9d96c8f9	3
a264a5c4-7998-4682-b7c0-282f080dff54	765039b3-09fb-4a21-abd8-3982ac2c2445	7
a264a5c4-7998-4682-b7c0-282f080dff54	21561c4d-bc34-461f-9072-c5a9648514dd	7
a264a5c4-7998-4682-b7c0-282f080dff54	966e1b4f-3490-4e72-894a-f3e12f4c2407	7
a264a5c4-7998-4682-b7c0-282f080dff54	da4b2744-d83c-4fe0-849b-eb32735ff83e	7
a264a5c4-7998-4682-b7c0-282f080dff54	3a3aa8cd-8329-4710-8373-7172a886e391	7
a264a5c4-7998-4682-b7c0-282f080dff54	75bc4d1d-c5b6-4991-a7c8-b14941340bfe	8
a264a5c4-7998-4682-b7c0-282f080dff54	80d13a4f-1770-4620-840b-04537a80ff16	8
a264a5c4-7998-4682-b7c0-282f080dff54	65e2b011-988d-45ce-8e95-68560a5d9212	8
a264a5c4-7998-4682-b7c0-282f080dff54	84fa8311-f829-4485-a2d3-2ce36b0c5f21	8
a264a5c4-7998-4682-b7c0-282f080dff54	b4afd69d-cba4-483b-9d41-e645e67a029c	8
a264a5c4-7998-4682-b7c0-282f080dff54	381e625a-7952-41f7-83b1-bb8e1667f4bc	9
a264a5c4-7998-4682-b7c0-282f080dff54	c69837ef-6b94-4a65-9aa2-36b9cceb2aab	9
a264a5c4-7998-4682-b7c0-282f080dff54	25c2c965-ae16-4ebd-a84f-ba220e5628a5	9
a264a5c4-7998-4682-b7c0-282f080dff54	33d0a956-1372-41a4-9592-7d851b8fc578	9
a264a5c4-7998-4682-b7c0-282f080dff54	3122dcff-4220-4f20-a9be-8d4d001f527d	9
a264a5c4-7998-4682-b7c0-282f080dff54	c1a05c05-f8c8-4ba1-aa4f-46900bfe5999	4
a264a5c4-7998-4682-b7c0-282f080dff54	b709754f-0792-4f1b-bed8-453d326fdc4f	4
a264a5c4-7998-4682-b7c0-282f080dff54	ef86fa48-d9bc-48c2-acb9-c6006f7c1924	4
a264a5c4-7998-4682-b7c0-282f080dff54	eac169ed-64db-45cb-8a65-ccdabaec67db	4
a264a5c4-7998-4682-b7c0-282f080dff54	01aa889b-3136-44a0-9eb4-627f48915cc8	4
a264a5c4-7998-4682-b7c0-282f080dff54	ca1641aa-0179-4569-b1a7-bc699f8ce41e	5
a264a5c4-7998-4682-b7c0-282f080dff54	f7017585-c210-45cb-8763-f9fe6c2dee60	5
a264a5c4-7998-4682-b7c0-282f080dff54	68a0068a-1560-41fb-9861-aefa2fdd098c	5
a264a5c4-7998-4682-b7c0-282f080dff54	16bdd2d1-d857-4ccc-88cc-08a309e87436	5
a264a5c4-7998-4682-b7c0-282f080dff54	0c681e85-1c77-404f-90ae-af28cd784f2f	5
a264a5c4-7998-4682-b7c0-282f080dff54	7a434ec5-a023-4a1f-bf18-17cdd535de7f	6
a264a5c4-7998-4682-b7c0-282f080dff54	b26c1683-4867-477f-bc3c-51236411a2d5	6
a264a5c4-7998-4682-b7c0-282f080dff54	d43cc152-6b23-47e1-bc46-dc86ad6df194	6
a264a5c4-7998-4682-b7c0-282f080dff54	c9382592-84e2-4a0e-97d4-431517a0e637	6
a264a5c4-7998-4682-b7c0-282f080dff54	443c5b4c-1aff-4db6-ad50-ffdec184cf40	6
a264a5c4-7998-4682-b7c0-282f080dff54	5f0a82a4-07af-4541-a5de-e091b4610e20	10
a264a5c4-7998-4682-b7c0-282f080dff54	0ae10a12-58af-4e3d-9ca2-f994eacb6af2	10
a264a5c4-7998-4682-b7c0-282f080dff54	788843ec-454a-4b8a-9d2f-8e9d0daeacc8	10
a264a5c4-7998-4682-b7c0-282f080dff54	8413e772-ee5d-4068-9485-c41f0d94227c	10
a264a5c4-7998-4682-b7c0-282f080dff54	192153be-1e77-4575-829a-2ade38758d63	10
a264a5c4-7998-4682-b7c0-282f080dff54	98f680eb-56e8-428c-ad5d-2bc7fee4bbf8	11
a264a5c4-7998-4682-b7c0-282f080dff54	0fa02bea-1d24-4743-b58c-54b5192099d8	11
a264a5c4-7998-4682-b7c0-282f080dff54	6e701975-14f6-4ae7-b085-3fac4f1820af	11
a264a5c4-7998-4682-b7c0-282f080dff54	055c3b86-6220-4d07-bff3-32050393f895	11
a264a5c4-7998-4682-b7c0-282f080dff54	2859fc59-2f62-4112-af6a-f6066bafcbac	11
a264a5c4-7998-4682-b7c0-282f080dff54	5c901c31-40c0-4e7f-9357-92979d89c4e7	12
a264a5c4-7998-4682-b7c0-282f080dff54	c9552e1c-b109-44dc-9af3-6ae411d99bfb	12
a264a5c4-7998-4682-b7c0-282f080dff54	123fedef-5555-429f-9f5e-8c5db4e45392	12
a264a5c4-7998-4682-b7c0-282f080dff54	e0b68173-ecbe-40b5-9802-032879e333f6	12
a264a5c4-7998-4682-b7c0-282f080dff54	f64fa713-0f29-4073-86fd-adec2b4e4839	12
\.


--
-- Data for Name: Degree; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Degree" (id, code, name, status) FROM stdin;
a264a5c4-7998-4682-b7c0-282f080dff54	IIT	INGENIERIA EN INFOTECNOLOGIA	activo
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Event" (id, "scheduleId", day, "startTime", "endTime") FROM stdin;
23e0e5f3-3c95-4478-8d63-da9724710233	f770cb41-7227-4a12-a0c6-f1439bfdc47e	1	700	1000
35a90d8b-dd82-4b40-b856-d11ffecddf08	608a6f5d-7e75-420c-a3db-aeeda62750c0	1	1700	2000
645c6394-d9ac-453c-a6c4-bbbf371af19c	f87f40e0-4a15-4559-9753-21576a8feffb	4	700	1000
959017db-25a4-451b-b9ae-a45f086beab1	608a6f5d-7e75-420c-a3db-aeeda62750c0	3	1700	2000
ec0355b4-5589-48f6-a31a-c447cdf621b7	f87f40e0-4a15-4559-9753-21576a8feffb	2	700	1000
ed6fc2df-ce41-433a-b2aa-6a794fbdb099	f770cb41-7227-4a12-a0c6-f1439bfdc47e	3	700	1000
4defcdf6-a6da-4864-9274-c11dbaa8141d	a1cdf491-6fc7-4e94-b418-6a0f5791e3d7	2	1700	2000
7203e9f8-91d4-4bb7-ab72-01af57e51f70	a1cdf491-6fc7-4e94-b418-6a0f5791e3d7	4	1700	2000
a5d5dcbd-c429-4527-a661-9c1859496124	125aa1ee-4105-4940-bf40-7b9f7c072853	1	1700	2000
3b0d1371-112c-4733-a94b-9e7b56004fe9	125aa1ee-4105-4940-bf40-7b9f7c072853	3	1700	2000
f3e05ef6-5d6e-4b0f-85a0-7df9ff49df1f	e2ecce9e-cf07-4ed7-8a6a-15a75997c1db	1	700	1000
6897c255-3e96-445d-827c-592f94cdb33c	e2ecce9e-cf07-4ed7-8a6a-15a75997c1db	3	700	1000
ff4337a7-70fd-4217-bae2-915df3e19c8e	df4ea9bf-04df-43d8-bf89-8154f0bdf5fb	2	700	1000
38229259-ac6d-41b1-8579-0384ed4adadc	df4ea9bf-04df-43d8-bf89-8154f0bdf5fb	4	700	1000
de93e418-0a78-4b1a-a330-1e2bce222400	0f2cd276-430e-4be7-8436-6f8b4edd4c95	2	1300	1600
155f5489-2bd6-43bb-87d9-b4ebdc2d19eb	0f2cd276-430e-4be7-8436-6f8b4edd4c95	4	1300	1600
b6fca35b-a8af-4b01-b758-dd426d82f423	21ae1e57-72b9-4311-8fc6-50ab01a84cae	1	1100	1400
35530154-3faa-4227-8a6f-4338bece910c	21ae1e57-72b9-4311-8fc6-50ab01a84cae	3	1100	1400
af0b0df1-88ed-4aec-ada7-e2ebc4e3bc45	54c3993f-ca2b-4132-aec4-eaf718e8675d	1	1100	1400
5e606b6c-1f85-41e7-b360-0bbfdd72c803	54c3993f-ca2b-4132-aec4-eaf718e8675d	3	1100	1300
7f27da2d-a5a6-4c4e-8bdc-a414fcb9bdc7	a8a5a666-2901-47e3-bdfd-f0a6b70d41d3	4	1000	1300
4c3310ff-c565-40c5-87a1-63a74ff152b9	de0104cf-fc1f-43c4-a9cf-717297e2a91f	2	1700	2000
7ef996be-4e92-46c5-8c7e-c1789855f819	de0104cf-fc1f-43c4-a9cf-717297e2a91f	4	1700	2000
d24a389a-64e9-4086-a4a1-e3392321ec4e	83b45541-f397-4d82-bd1d-ac5efe8a0a72	1	800	1100
36567d78-3991-4418-8b9d-2dfd5f7ca8bf	83b45541-f397-4d82-bd1d-ac5efe8a0a72	3	900	1100
0d23155b-128c-450f-9002-5fdecb45da13	8eb3e9e6-8cf4-436d-9d42-60553c2aebf2	2	1000	1200
84eff1a8-7f06-4aa8-9f17-0c3d0928cb08	8eb3e9e6-8cf4-436d-9d42-60553c2aebf2	4	1000	1200
53d07368-bc21-4f45-a73b-22e070b37a45	08ecc9d2-aac8-4000-9415-ad5f6d9564c0	2	700	1000
bcca4b77-e353-48d9-a75f-fd6acd1a5a34	08ecc9d2-aac8-4000-9415-ad5f6d9564c0	4	700	1000
5dda1e62-43e3-44d3-b3aa-f346d9dc644b	ef0ecc92-1fe0-46e9-b132-ccfc016c5c70	1	1700	2000
347f7107-4266-4daf-bc86-856c247b9b81	ef0ecc92-1fe0-46e9-b132-ccfc016c5c70	3	1700	2000
230209b7-04bd-49e4-a1c8-254f47ae2dcf	8e219a50-1595-497f-bb50-26cef011107d	5	1400	1700
00d0906f-7b6e-4511-b6a1-898fd30aa8d6	00d4e513-e370-4de5-9cb2-43d465117465	1	1500	1700
72cff714-a734-4621-8dbd-23c8df96c39b	00d4e513-e370-4de5-9cb2-43d465117465	3	1500	1700
f253776e-6879-48fc-b687-dcb04e53b2c0	a5bd96fa-0166-4001-990a-28df8d1d0029	2	1000	1200
f0e44dfb-7fbf-4bb9-ac3a-69653e64a236	a5bd96fa-0166-4001-990a-28df8d1d0029	4	1000	1200
8c5d984a-2a26-4b7e-b365-d526de79dc21	80ebb45b-8daf-4c41-8016-4f9e6a0f15c2	5	1100	1400
5981b5b3-3423-4204-aa0c-5d1d825c4343	7da5a1c6-3bb7-43cc-a124-88610d051dac	5	1100	1400
33cfd17f-4eb9-45a9-93b2-b97a33fe0115	5aa609bd-8199-4205-84f2-89c88a5c3602	2	1400	1700
60c51bd9-1da4-4eda-8e34-ea76b20823fa	5aa609bd-8199-4205-84f2-89c88a5c3602	4	1400	1700
811c34b8-c9d5-4275-81fd-703ef2b8af7c	37abd819-6c5f-4d4d-adb3-0c5fcb8cfb63	2	1000	1300
5f01e99c-f22b-47c8-b904-e82079cf59b0	37abd819-6c5f-4d4d-adb3-0c5fcb8cfb63	4	1000	1300
0890eb8b-db07-4bb6-ba14-45017e02ebe2	a008a8e5-4810-47cd-98e7-3404c96fdb21	5	1400	1700
f23c73fc-f48d-4fde-a705-66c2a16319d2	ef07c213-6491-4803-970a-1bf7b5a6a924	5	1700	2000
fcdde2fb-a588-403f-b06d-1e57af7c8cf5	c5afa865-4b69-4bc3-9afe-64bc4712bcc7	6	1200	1500
\.


--
-- Data for Name: Professor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Professor" (id, code, "firstName", "lastName", email, "phoneNumber", status, "createdAt", "updatedAt") FROM stdin;
e9c84e59-7d8a-4656-b01e-03bafce850a1	PR001	ALEXIS ARMANDO	VASQUEZ VASQUEZ	alexis.vasquez@ujcv.edu.hn	+50499123456	activo	2025-06-21 05:14:27.83	2025-06-21 05:14:27.83
6db21162-1048-4c01-af27-b19602312379	PR002	ANGEL GILBERTO	ALEMAN SALINAS	angel.aleman@ujcv.edu.hn	+50499123456	activo	2025-06-21 05:15:01.118	2025-06-21 05:15:01.118
be563468-c9fb-49a6-800e-ff5d5bb85d58	PR003	CHESTER DANIEL	CACERES BARDALES	chester.caceres@ujcv.edu.hn	+50499123456	activo	2025-06-21 05:15:07.9	2025-06-21 05:15:07.9
5d26fd0b-9a2a-465b-a304-f1de3d08e17c	PR004	DANIEL JESE	CASCO MONCADA	daniel.casco@ujcv.edu.hn	+50499123457	activo	2025-06-21 05:15:14.484	2025-06-21 05:15:14.484
298d5adb-bcfb-427f-84af-d0a99304aec6	PR005	FRANCISCO	SALINAS	francisco.salinas@ujcv.edu.hn	+50499123457	activo	2025-06-21 05:15:21.699	2025-06-21 05:15:21.699
4a4d21e2-ad5a-48d4-b205-cf5b84bc8a80	PR006	JOSE MARDEN	ARGUETA	jose.argueta@ujcv.edu.hn	+50499123457	activo	2025-06-21 05:15:26.779	2025-06-21 05:15:26.779
c3fc7833-760d-46d0-9250-0978ba2ca6eb	PR007	JOSUE OCTAVIO	RODRIGEZ SANCHEZ	josue.rodrigez@ujcv.edu.hn	+50499123457	activo	2025-06-21 05:15:31.4	2025-06-21 05:15:31.4
abb9ea80-b5a3-4783-9238-2eb8af380900	PR008	ORLANDO FABRICIO	EUCEDA CASTILLO	orlando.euceda@ujcv.edu.hn	+50499123457	activo	2025-06-21 05:15:36.415	2025-06-21 05:15:36.415
41e01e45-17bd-4a83-a141-53edd357c3cc	PR009	OSMAR NEPTALI	NOLASCO VASQUEZ	osmar.nolasco@ujcv.edu.hn	+50499123457	activo	2025-06-21 05:15:42.166	2025-06-21 05:15:42.166
41bf8600-c975-4f2d-b337-8054eccf748b	PR010	OSMIN ORLANDO	GOMEZ	osmin.gomez@ujcv.edu.hn	+50499123457	activo	2025-06-21 05:15:47.605	2025-06-21 05:15:47.605
746c2c16-a2db-4851-8720-adff600108f4	PR011	RAUL ANTONIO	FERNANDEZ	raul.fernandez@ujcv.edu.hn	+50499123457	activo	2025-06-21 05:15:52.487	2025-06-21 05:15:52.487
fc683436-cf36-41ef-afaa-acbf07d39c3f	PR012	SENOVIA MARIA	LOPEZ GUILLEN	senovia.lopez@ujcv.edu.hn	+50499123457	activo	2025-06-21 05:15:57.556	2025-06-21 05:15:57.556
c6cba385-362d-4faa-8f82-dccb76c255e3	PR013	SINDY YANELY	BARAHONA IZAGUIRRE	sindy.barahona@ujcv.edu.hn	+50499123457	activo	2025-06-21 05:16:02.673	2025-06-21 05:16:02.673
\.


--
-- Data for Name: Room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Room" (id, code) FROM stdin;
dd551435-5e52-49b8-a428-aa444927c7c0	C1
c31e25da-2e32-44d2-8bcf-1fc8b2653bf8	C2
868742ce-fb5f-4c03-a246-b2ae21177050	C3
8db55ea8-8dc5-406c-a2c7-33eb2579d1e4	C4
69267f1c-a457-4b71-880a-1d4b3bca3918	C5
b378e125-3320-4f04-a731-d04c967cd348	C6
2cf166cc-95bb-49a3-9534-43820177366c	C7
372e2fa2-5ad1-4472-9fac-49285b8c97f8	C8
e4aaafad-f05e-49d1-95c9-70a005ab809c	LAB1
539aaf73-e7b6-4784-9e42-a54ad44d18ee	LAB2
62203751-89d2-4221-8bce-3d813acafb93	LAB3
c36fc14f-765a-48de-b6d8-24e8674b8e6c	LAB4
85fd59d4-51cb-4f04-81d9-10ca22c0cfd3	VIRTUAL
\.


--
-- Data for Name: Schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Schedule" (id, "academicPeriodId", "professorId", "courseId", "roomId", section) FROM stdin;
608a6f5d-7e75-420c-a3db-aeeda62750c0	11ea55a0-1f78-46ac-8793-3c67e059d827	298d5adb-bcfb-427f-84af-d0a99304aec6	f5305bc1-8f6e-45ee-85b4-3a0be5ce9b07	c36fc14f-765a-48de-b6d8-24e8674b8e6c	G
f770cb41-7227-4a12-a0c6-f1439bfdc47e	11ea55a0-1f78-46ac-8793-3c67e059d827	41bf8600-c975-4f2d-b337-8054eccf748b	f5305bc1-8f6e-45ee-85b4-3a0be5ce9b07	e4aaafad-f05e-49d1-95c9-70a005ab809c	A
f87f40e0-4a15-4559-9753-21576a8feffb	11ea55a0-1f78-46ac-8793-3c67e059d827	41bf8600-c975-4f2d-b337-8054eccf748b	f5305bc1-8f6e-45ee-85b4-3a0be5ce9b07	e4aaafad-f05e-49d1-95c9-70a005ab809c	D
a1cdf491-6fc7-4e94-b418-6a0f5791e3d7	11ea55a0-1f78-46ac-8793-3c67e059d827	fc683436-cf36-41ef-afaa-acbf07d39c3f	f5305bc1-8f6e-45ee-85b4-3a0be5ce9b07	85fd59d4-51cb-4f04-81d9-10ca22c0cfd3	B
125aa1ee-4105-4940-bf40-7b9f7c072853	11ea55a0-1f78-46ac-8793-3c67e059d827	fc683436-cf36-41ef-afaa-acbf07d39c3f	f5305bc1-8f6e-45ee-85b4-3a0be5ce9b07	85fd59d4-51cb-4f04-81d9-10ca22c0cfd3	C
e2ecce9e-cf07-4ed7-8a6a-15a75997c1db	11ea55a0-1f78-46ac-8793-3c67e059d827	c6cba385-362d-4faa-8f82-dccb76c255e3	f5305bc1-8f6e-45ee-85b4-3a0be5ce9b07	85fd59d4-51cb-4f04-81d9-10ca22c0cfd3	F
df4ea9bf-04df-43d8-bf89-8154f0bdf5fb	11ea55a0-1f78-46ac-8793-3c67e059d827	c6cba385-362d-4faa-8f82-dccb76c255e3	f5305bc1-8f6e-45ee-85b4-3a0be5ce9b07	85fd59d4-51cb-4f04-81d9-10ca22c0cfd3	E
0f2cd276-430e-4be7-8436-6f8b4edd4c95	11ea55a0-1f78-46ac-8793-3c67e059d827	746c2c16-a2db-4851-8720-adff600108f4	b709754f-0792-4f1b-bed8-453d326fdc4f	c36fc14f-765a-48de-b6d8-24e8674b8e6c	A
21ae1e57-72b9-4311-8fc6-50ab01a84cae	11ea55a0-1f78-46ac-8793-3c67e059d827	746c2c16-a2db-4851-8720-adff600108f4	16bdd2d1-d857-4ccc-88cc-08a309e87436	62203751-89d2-4221-8bce-3d813acafb93	A
54c3993f-ca2b-4132-aec4-eaf718e8675d	11ea55a0-1f78-46ac-8793-3c67e059d827	6db21162-1048-4c01-af27-b19602312379	443c5b4c-1aff-4db6-ad50-ffdec184cf40	c36fc14f-765a-48de-b6d8-24e8674b8e6c	A
a8a5a666-2901-47e3-bdfd-f0a6b70d41d3	11ea55a0-1f78-46ac-8793-3c67e059d827	c3fc7833-760d-46d0-9250-0978ba2ca6eb	d43cc152-6b23-47e1-bc46-dc86ad6df194	85fd59d4-51cb-4f04-81d9-10ca22c0cfd3	A
de0104cf-fc1f-43c4-a9cf-717297e2a91f	11ea55a0-1f78-46ac-8793-3c67e059d827	41e01e45-17bd-4a83-a141-53edd357c3cc	b26c1683-4867-477f-bc3c-51236411a2d5	85fd59d4-51cb-4f04-81d9-10ca22c0cfd3	A
83b45541-f397-4d82-bd1d-ac5efe8a0a72	11ea55a0-1f78-46ac-8793-3c67e059d827	746c2c16-a2db-4851-8720-adff600108f4	3a3aa8cd-8329-4710-8373-7172a886e391	62203751-89d2-4221-8bce-3d813acafb93	A
8eb3e9e6-8cf4-436d-9d42-60553c2aebf2	11ea55a0-1f78-46ac-8793-3c67e059d827	746c2c16-a2db-4851-8720-adff600108f4	765039b3-09fb-4a21-abd8-3982ac2c2445	c36fc14f-765a-48de-b6d8-24e8674b8e6c	A
08ecc9d2-aac8-4000-9415-ad5f6d9564c0	11ea55a0-1f78-46ac-8793-3c67e059d827	6db21162-1048-4c01-af27-b19602312379	966e1b4f-3490-4e72-894a-f3e12f4c2407	62203751-89d2-4221-8bce-3d813acafb93	A
ef0ecc92-1fe0-46e9-b132-ccfc016c5c70	11ea55a0-1f78-46ac-8793-3c67e059d827	4a4d21e2-ad5a-48d4-b205-cf5b84bc8a80	381e625a-7952-41f7-83b1-bb8e1667f4bc	62203751-89d2-4221-8bce-3d813acafb93	A
8e219a50-1595-497f-bb50-26cef011107d	11ea55a0-1f78-46ac-8793-3c67e059d827	6db21162-1048-4c01-af27-b19602312379	c69837ef-6b94-4a65-9aa2-36b9cceb2aab	62203751-89d2-4221-8bce-3d813acafb93	A
00d4e513-e370-4de5-9cb2-43d465117465	11ea55a0-1f78-46ac-8793-3c67e059d827	5d26fd0b-9a2a-465b-a304-f1de3d08e17c	25c2c965-ae16-4ebd-a84f-ba220e5628a5	e4aaafad-f05e-49d1-95c9-70a005ab809c	A
a5bd96fa-0166-4001-990a-28df8d1d0029	11ea55a0-1f78-46ac-8793-3c67e059d827	e9c84e59-7d8a-4656-b01e-03bafce850a1	33d0a956-1372-41a4-9592-7d851b8fc578	85fd59d4-51cb-4f04-81d9-10ca22c0cfd3	A
80ebb45b-8daf-4c41-8016-4f9e6a0f15c2	11ea55a0-1f78-46ac-8793-3c67e059d827	746c2c16-a2db-4851-8720-adff600108f4	8413e772-ee5d-4068-9485-c41f0d94227c	c36fc14f-765a-48de-b6d8-24e8674b8e6c	A
7da5a1c6-3bb7-43cc-a124-88610d051dac	11ea55a0-1f78-46ac-8793-3c67e059d827	6db21162-1048-4c01-af27-b19602312379	da4b2744-d83c-4fe0-849b-eb32735ff83e	62203751-89d2-4221-8bce-3d813acafb93	A
5aa609bd-8199-4205-84f2-89c88a5c3602	11ea55a0-1f78-46ac-8793-3c67e059d827	6db21162-1048-4c01-af27-b19602312379	5f0a82a4-07af-4541-a5de-e091b4610e20	62203751-89d2-4221-8bce-3d813acafb93	A
37abd819-6c5f-4d4d-adb3-0c5fcb8cfb63	11ea55a0-1f78-46ac-8793-3c67e059d827	6db21162-1048-4c01-af27-b19602312379	0ae10a12-58af-4e3d-9ca2-f994eacb6af2	62203751-89d2-4221-8bce-3d813acafb93	A
c5afa865-4b69-4bc3-9afe-64bc4712bcc7	11ea55a0-1f78-46ac-8793-3c67e059d827	fc683436-cf36-41ef-afaa-acbf07d39c3f	055c3b86-6220-4d07-bff3-32050393f895	85fd59d4-51cb-4f04-81d9-10ca22c0cfd3	A
a008a8e5-4810-47cd-98e7-3404c96fdb21	11ea55a0-1f78-46ac-8793-3c67e059d827	746c2c16-a2db-4851-8720-adff600108f4	0fa02bea-1d24-4743-b58c-54b5192099d8	c36fc14f-765a-48de-b6d8-24e8674b8e6c	A
ef07c213-6491-4803-970a-1bf7b5a6a924	11ea55a0-1f78-46ac-8793-3c67e059d827	abb9ea80-b5a3-4783-9238-2eb8af380900	123fedef-5555-429f-9f5e-8c5db4e45392	85fd59d4-51cb-4f04-81d9-10ca22c0cfd3	A
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2ff7f7ba-c7aa-4c35-ad88-506eef9faa17	26277a5ab8819bcc84e2deedf7bd4fa89b5b0eb36c85e913dd9407c9b683d4c3	2025-06-20 20:39:32.217486+00	20250611194442_init	\N	\N	2025-06-20 20:39:32.171846+00	1
5ff7d656-047a-4843-85e2-cdcf3d43411f	ae64cf52798101b22871134756bbcd740b90c9560bcf601c2bdf370e169792c3	2025-06-20 20:40:12.618602+00	20250620204012_init	\N	\N	2025-06-20 20:40:12.537586+00	1
2b4b6e8d-d674-4b65-b8af-3d450bbe9136	407fb9ebeacbc6d200be49888454bccf95b2f25e58abafa5d060e5670b325761	2025-06-21 07:31:16.207839+00	20250621073115_section_added	\N	\N	2025-06-21 07:31:16.199918+00	1
\.


--
-- Name: AcademicPeriod AcademicPeriod_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicPeriod"
    ADD CONSTRAINT "AcademicPeriod_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: Curriculum Curriculum_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Curriculum"
    ADD CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("degreeId", "courseId");


--
-- Name: Degree Degree_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Degree"
    ADD CONSTRAINT "Degree_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Professor Professor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Professor"
    ADD CONSTRAINT "Professor_pkey" PRIMARY KEY (id);


--
-- Name: Room Room_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_pkey" PRIMARY KEY (id);


--
-- Name: Schedule Schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Course_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Course_code_key" ON public."Course" USING btree (code);


--
-- Name: Degree_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Degree_code_key" ON public."Degree" USING btree (code);


--
-- Name: Event_scheduleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Event_scheduleId_idx" ON public."Event" USING btree ("scheduleId");


--
-- Name: Professor_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Professor_code_key" ON public."Professor" USING btree (code);


--
-- Name: Professor_code_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Professor_code_status_idx" ON public."Professor" USING btree (code, status);


--
-- Name: Professor_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Professor_email_key" ON public."Professor" USING btree (email);


--
-- Name: Schedule_academicPeriodId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Schedule_academicPeriodId_idx" ON public."Schedule" USING btree ("academicPeriodId");


--
-- Name: Schedule_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Schedule_courseId_idx" ON public."Schedule" USING btree ("courseId");


--
-- Name: Schedule_professorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Schedule_professorId_idx" ON public."Schedule" USING btree ("professorId");


--
-- Name: Schedule_roomId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Schedule_roomId_idx" ON public."Schedule" USING btree ("roomId");


--
-- Name: Curriculum Curriculum_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Curriculum"
    ADD CONSTRAINT "Curriculum_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Curriculum Curriculum_degreeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Curriculum"
    ADD CONSTRAINT "Curriculum_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES public."Degree"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Event Event_scheduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES public."Schedule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Schedule Schedule_academicPeriodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT "Schedule_academicPeriodId_fkey" FOREIGN KEY ("academicPeriodId") REFERENCES public."AcademicPeriod"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Schedule Schedule_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT "Schedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Schedule Schedule_professorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT "Schedule_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES public."Professor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Schedule Schedule_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT "Schedule_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public."Room"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "professor-ms" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: professor-ms; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "professor-ms" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE "professor-ms" OWNER TO postgres;

\encoding SQL_ASCII
\connect -reuse-previous=on "dbname='professor-ms'"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ProfessorStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProfessorStatus" AS ENUM (
    'activo',
    'inactivo',
    'jubilado',
    'de_baja'
);


ALTER TYPE public."ProfessorStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Availability" (
    id text NOT NULL,
    "professorId" text NOT NULL,
    "dayOfWeek" integer NOT NULL,
    "startTime" integer NOT NULL,
    "endTime" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Availability" OWNER TO postgres;

--
-- Name: Professor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Professor" (
    id text NOT NULL,
    code character varying(20) NOT NULL,
    email text NOT NULL,
    status public."ProfessorStatus" DEFAULT 'activo'::public."ProfessorStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "firstName" character varying(50) NOT NULL,
    "lastName" character varying(50) NOT NULL,
    "phoneNumber" character varying(20) NOT NULL
);


ALTER TABLE public."Professor" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Availability" (id, "professorId", "dayOfWeek", "startTime", "endTime", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Professor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Professor" (id, code, email, status, "createdAt", "updatedAt", "firstName", "lastName", "phoneNumber") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
99834ec6-f27b-49a9-ac11-b95566048ace	fe3f810c93351de581da631387c8011e477f7cbcacfae8d030fc8c53b673704e	2025-06-10 17:57:31.753469+00	20250531042715_init	\N	\N	2025-06-10 17:57:31.731889+00	1
8a1379b2-9af2-43e1-b1df-49146b7158c8	dc4360f68218a5f4bedfe2f192592a7177ee92f5332424488cb854fbcfc68486	2025-06-10 17:57:31.785344+00	20250531210039_init	\N	\N	2025-06-10 17:57:31.755991+00	1
cb1d4092-cc1a-422f-b0a0-e2ea499b2a82	ea8b1c8b6580b627304c43fb2e2f4f59bdce948cf2e2d2fb7b016bdddf0ccf80	2025-06-10 17:57:31.811585+00	20250531210309_init	\N	\N	2025-06-10 17:57:31.787784+00	1
0db9f403-cb2a-45b5-8287-d539a6c9ae34	f8ecbcdfdf0dbe14d2cac4743c11e71d5a50c0e347c7bb6e7d1e4eee22255d3d	2025-06-10 17:57:31.836174+00	20250607002610_add_availability	\N	\N	2025-06-10 17:57:31.814486+00	1
\.


--
-- Name: Availability Availability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Availability"
    ADD CONSTRAINT "Availability_pkey" PRIMARY KEY (id);


--
-- Name: Professor Professor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Professor"
    ADD CONSTRAINT "Professor_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Availability_professorId_dayOfWeek_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Availability_professorId_dayOfWeek_idx" ON public."Availability" USING btree ("professorId", "dayOfWeek");


--
-- Name: Professor_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Professor_code_key" ON public."Professor" USING btree (code);


--
-- Name: Professor_code_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Professor_code_status_idx" ON public."Professor" USING btree (code, status);


--
-- Name: Professor_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Professor_email_key" ON public."Professor" USING btree (email);


--
-- Name: Availability Availability_professorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Availability"
    ADD CONSTRAINT "Availability_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES public."Professor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

--
-- Database "schedule" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: schedule; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE schedule WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE schedule OWNER TO postgres;

\connect schedule

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

