--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7 (Ubuntu 12.7-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.7 (Ubuntu 12.7-0ubuntu0.20.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    user_id integer,
    token text
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    type text,
    value text,
    user_id integer,
    transaction_date text,
    description text
);


--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    email text,
    password text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sessions VALUES (76, 94, '164c63ef-53dd-4a8d-adb1-8a518869a048');


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.transactions VALUES (72, 'income', '50000', 49, '2021-06-25T04:26:52-03:00', 'cachê');
INSERT INTO public.transactions VALUES (73, 'income', '20000', 49, '2021-06-25T04:27:06-03:00', 'ganhei aposta');
INSERT INTO public.transactions VALUES (74, 'income', '20000', 49, '2021-06-25T04:41:07-03:00', 'teste');
INSERT INTO public.transactions VALUES (75, 'income', '30000', 49, '2021-06-25T04:41:13-03:00', 'teste');
INSERT INTO public.transactions VALUES (76, 'outflow', '50000', 49, '2021-06-25T04:41:17-03:00', 'teste');
INSERT INTO public.transactions VALUES (77, 'outflow', '10000', 49, '2021-06-25T04:41:22-03:00', 'aaa');
INSERT INTO public.transactions VALUES (78, 'income', '111100', 49, '2021-06-25T04:41:26-03:00', 'aaaa');
INSERT INTO public.transactions VALUES (79, 'outflow', '111111100', 49, '2021-06-25T04:41:30-03:00', 'aaaaa');
INSERT INTO public.transactions VALUES (80, 'outflow', '11111100', 49, '2021-06-25T04:41:35-03:00', 'ssssss');
INSERT INTO public.transactions VALUES (81, 'income', '33333300', 49, '2021-06-25T04:41:39-03:00', 'aaaaa');
INSERT INTO public.transactions VALUES (82, 'income', '3555500', 49, '2021-06-25T04:41:50-03:00', 'aaaaaaaa');
INSERT INTO public.transactions VALUES (83, 'outflow', '8888800', 49, '2021-06-25T04:41:57-03:00', 'rrrr');
INSERT INTO public.transactions VALUES (84, 'outflow', '77777700', 49, '2021-06-25T04:42:04-03:00', 'eeeee');
INSERT INTO public.transactions VALUES (85, 'income', '60000000', 49, '2021-06-25T04:45:27-03:00', 'oooooo');
INSERT INTO public.transactions VALUES (86, 'income', '120000000', 49, '2021-06-25T04:45:52-03:00', 'aaaaaa');
INSERT INTO public.transactions VALUES (87, 'income', '20000', 52, '2021-06-25T14:31:32-03:00', 'ganhei aposta');
INSERT INTO public.transactions VALUES (88, 'outflow', '30000', 52, '2021-06-25T14:32:26-03:00', 'perdi na rua');
INSERT INTO public.transactions VALUES (89, 'outflow', '100000', 52, '2021-06-25T14:54:39-03:00', 'freela');
INSERT INTO public.transactions VALUES (90, 'income', '50000', 52, '2021-06-25T15:20:01-03:00', 'teste');
INSERT INTO public.transactions VALUES (91, 'income', '40000', 52, '2021-06-25T15:26:26-03:00', 'divida');
INSERT INTO public.transactions VALUES (92, 'outflow', '60000', 52, '2021-06-25T15:26:33-03:00', 'perdi aposta');
INSERT INTO public.transactions VALUES (93, 'income', '20000', 55, '2021-06-25T16:10:20-03:00', 'ganhei aposta');
INSERT INTO public.transactions VALUES (94, 'outflow', '50000', 55, '2021-06-25T16:10:41-03:00', 'perdi na rua');
INSERT INTO public.transactions VALUES (95, 'income', '200000', 55, '2021-06-25T16:11:53-03:00', 'freela');
INSERT INTO public.transactions VALUES (96, 'income', '30000', 55, '2021-06-25T16:14:05-03:00', 'teste');
INSERT INTO public.transactions VALUES (97, 'income', '30000', 55, '2021-06-25T16:15:57-03:00', 'teste');
INSERT INTO public.transactions VALUES (98, 'income', '40000', 55, '2021-06-25T16:16:33-03:00', 'teste');
INSERT INTO public.transactions VALUES (99, 'income', '60000', 55, '2021-06-25T16:16:55-03:00', 'teste');
INSERT INTO public.transactions VALUES (100, 'outflow', '50000', 55, '2021-06-25T16:17:11-03:00', 'teste');
INSERT INTO public.transactions VALUES (101, 'income', '80000', 55, '2021-06-25T16:18:10-03:00', 'teste');
INSERT INTO public.transactions VALUES (102, 'income', '50000', 55, '2021-06-25T16:19:13-03:00', 'teste');
INSERT INTO public.transactions VALUES (103, 'income', '100000000', 55, '2021-06-25T16:20:47-03:00', 'herança');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (94, 'Teste', 'teste@teste.com', '$2b$10$oRxifKf3pFeWmVhR7g5uCOFkovn4ZBgd5dYvjto3A07zVK9F5J3oK');
INSERT INTO public.users VALUES (95, 'Teste', 'teste@teste.com', '$2b$10$7R45tDK4rEUp5xwG1B.WueQe0ztNQ.VjekLPoRKVQ9k1CPJfPeID2');


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_id_seq', 77, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_id_seq', 103, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 95, true);


--
-- PostgreSQL database dump complete
--

