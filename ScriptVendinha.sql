-- Criando o schema.
CREATE SCHEMA maximus;

-- Criando a tabela clientes.
create table maximus.clientes(
	client_id serial primary key,
	nome_completo varchar(200) not null,
	cpf varchar(14) not null unique,
	data_nascimento date not null,
	email varchar(100) unique,
	total_dividas decimal default 0,
	inativo char(1) default 'N'
)

-- Criando a tabela dividas.
create table maximus.dividas(
	divida_id serial primary key,
	client_id int not null,
	valor int not null,
	data_criacao TIMESTAMPTZ,
	data_pagamento  TIMESTAMPTZ,
	descricao json,
	pago char(1) default 'N',
)

-- Criando a função para gerar clientes.
create or replace function maximus.func_gera_cliente(cliente_json jsonb)
returns jsonb
language plpgsql
as $$
declare
	p_nome_completo varchar(200);
	p_cpf varchar(14);
	p_data_nascimento date;
	p_email varchar(100);
	p_contagem int;
begin
	-- Extrair o JSON
	p_nome_completo := cliente_json->>'nomeCompleto';
	p_cpf := cliente_json->>'CPF';
	p_data_nascimento := cliente_json->>'dataNascimento';
	p_email := cliente_json->>'email';

	-- Verificar se o cpf já está cadastrado
	select count(*) into p_contagem from maximus.clientes c where c.cpf = p_cpf and c.inativo = 'N';
	if p_contagem > 0 then
		return jsonb_build_object('erro', 1);
	end if;

	-- Verificar se um email foi informado e se ele já está cadastrado
	if p_email is not null then
		select count(*) into p_contagem from maximus.clientes c where c.email = p_email and c.inativo = 'N';
		if p_contagem > 0 then
			return jsonb_build_object('erro', 2);
		end if;
	end if;
	
	-- Inserir os dados na tabela
	insert into maximus.clientes(nome_completo, cpf, data_nascimento, email)
		values(p_nome_completo, p_cpf, p_data_nascimento, p_email);
	return json_build_object('erro', 0);
end;
$$;

-- Criando a função para editar clientes.
CREATE OR REPLACE FUNCTION maximus.func_edita_cliente(cliente_json JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    p_nome_completo VARCHAR(200);
    p_cpf VARCHAR(14);
    p_data_nascimento DATE;
    p_email VARCHAR(100);
    p_contagem INT;
    p_email_atual VARCHAR(100);
BEGIN
    -- Extrair o JSON
    p_nome_completo := cliente_json->>'nomeCompleto';
    p_cpf := cliente_json->>'CPF';
    p_data_nascimento := cliente_json->>'dataNascimento';
    p_email := cliente_json->>'email';

    -- Verificar se o CPF está cadastrado e ativo
    SELECT COUNT(*) INTO p_contagem 
    FROM maximus.clientes 
    WHERE cpf = p_cpf AND inativo = 'N';

    IF p_contagem = 0 THEN
        RETURN JSONB_BUILD_OBJECT('erro', 5);
    END IF;

    -- Obter o email atual do cliente
    SELECT email INTO p_email_atual
    FROM maximus.clientes
    WHERE cpf = p_cpf AND inativo = 'N';

    -- Verificar se o email já está cadastrado e não é o email atual do cliente
    IF p_email <> p_email_atual THEN
        SELECT COUNT(*) INTO p_contagem 
        FROM maximus.clientes 
        WHERE email = p_email AND inativo = 'N';

        IF p_contagem > 0 THEN
            RETURN JSONB_BUILD_OBJECT('erro', 2);
        END IF;
    END IF;

    -- Atualizar os valores do cliente
    UPDATE maximus.clientes
    SET nome_completo = p_nome_completo,
        data_nascimento = p_data_nascimento,
        email = p_email
    WHERE cpf = p_cpf;

    RETURN JSONB_BUILD_OBJECT('erro', 0);
END;
$$;

-- Criando a função para deletar clientes.
CREATE OR REPLACE FUNCTION maximus.func_deleta_cliente(cliente_cpf jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
declare 
    p_cpf varchar(14);
    p_client_id int;
    p_contagem int;
begin
    -- Extrair o Json
    p_cpf := cliente_cpf->>'CPF';
   
    -- Verificar se o cpf já está cadastrado
    select client_id into p_client_id
    from maximus.clientes
    where cpf = p_cpf;

    if p_client_id is null then
        return jsonb_build_object('erro', 5);  -- CPF não cadastrado
    end if;
    
    -- Verificar se o cliente tem alguma dívida não paga
    select count(*) into p_contagem
    from maximus.dividas
    where client_id = p_client_id and pago = 'N';
    
    if p_contagem > 0 then
        return jsonb_build_object('erro', 6);  -- Cliente tem dívidas não pagas
    end if;

    -- Definir o cliente como inativo
    update maximus.clientes
    set inativo = 'S'
    where cpf = p_cpf;

    return jsonb_build_object('erro', 0);  -- Sucesso
end;
$function$;

-- Criando a função para selecionar os clientes (Ordenar por dividas)
create or replace function maximus.func_organiza_clientes()
returns table (
    client_id int,
    nome_completo varchar(200),
    cpf varchar(14),
    data_nascimento date,
    email varchar(100),
    total_dividas decimal
)
language plpgsql
as $$
begin
    return query
    select c.client_id, c.nome_completo, c.cpf, c.data_nascimento, c.email, c.total_dividas
    from maximus.clientes c
    where inativo = 'N'
    order by total_dividas desc, nome_completo asc;
end;
$$;

-- Criando a função para selecionar apenas um cliente para edição
create or replace function maximus.func_seleciona_cliente_cpf(cliente_cpf jsonb)
returns jsonb
language plpgsql
as $$
declare 
    p_cpf varchar(14);
    p_contagem int;
    p_nome_completo varchar(200);
    p_data_nascimento date;
    p_email varchar(100);
begin
    -- Extrair o Json
    p_cpf := cliente_cpf->>'CPF';
   
    -- Verificar se o cpf já está cadastrado
    select count(*) into p_contagem from maximus.clientes c where c.cpf = p_cpf and c.inativo = 'N';
    if p_contagem = 0 then
        return jsonb_build_object('erro', 5);
    end if;

    -- Selecionar os valores do cliente
    select c.nome_completo, c.data_nascimento, c.email
    into p_nome_completo, p_data_nascimento, p_email
    from maximus.clientes c 
    where c.cpf = p_cpf and c.inativo = 'N';

    return jsonb_build_object(
        'erro', 0,
        'nome_completo', p_nome_completo,
        'data_nascimento', p_data_nascimento,
        'email', p_email
    );
end;
$$;	

-- Garanta que o unaccent esta funcionando
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA maximus;

-- Criando a função para selecionar os clientes que possuem um nome especifico.
create or replace function maximus.func_seleciona_cliente_nome(cliente_nome jsonb)
returns table (
    client_id int,
    nome_completo varchar(200),
    cpf varchar(14),
    data_nascimento date,
    email varchar(100),
    total_dividas decimal
)
language plpgsql
as $$
declare
    p_nome_completo varchar(200);
begin
    -- Extrair o Json
    p_nome_completo := cliente_nome->>'nomeCompleto';

    -- Retornar a consulta com o filtro e ordenação desejados
    return query
    select c.client_id, c.nome_completo, c.cpf, c.data_nascimento, c.email, c.total_dividas
    from maximus.clientes c
    where unaccent(c.nome_completo) ILIKE '%' || unaccent(p_nome_completo) || '%'
     and c.inativo = 'N'
    order by c.total_dividas desc, c.nome_completo asc;
end;
$$;

-- Criar a função para gerar a divida
create or replace function maximus.func_gerar_divida(divida_json jsonb)
returns jsonb
language plpgsql
as $function$
declare
    p_client_id int;
    p_valor decimal;
    p_descricao jsonb;
    p_total_dividas decimal;
    p_current_total_dividas decimal;
begin
    -- Extrair o JSON
    p_client_id := (divida_json->>'clientId')::int;
    p_valor := (divida_json->>'valor')::decimal;
    p_descricao := divida_json->'descricao';
    
    -- Verificar se o client_id existe na tabela clientes
    select total_dividas into p_current_total_dividas
    from maximus.clientes c
    where c.client_id = p_client_id and c.inativo = 'N';
    
    if p_current_total_dividas is null then
        return jsonb_build_object('erro', 5);
    end if;
    
    -- Verificar se a soma do valor com total_dividas é menor que 200.00
    if p_current_total_dividas + p_valor > 200 then
        return jsonb_build_object('erro', 6);
    end if;

    -- Inserir a nova dívida
    insert into maximus.dividas(client_id, valor, data_criacao, descricao)
    values (p_client_id, p_valor, timezone('America/Sao_Paulo', now()), p_descricao);

    -- Atualizar o total_dividas do cliente
    update maximus.clientes
    set total_dividas = p_current_total_dividas + p_valor
    where client_id = p_client_id;

    return jsonb_build_object('erro', 0);
end;
$function$;

-- Selecionar todas as dividas com um cliente_id especifico
CREATE OR REPLACE FUNCTION maximus.func_seleciona_dividas_cliente(p_client_id int)
RETURNS TABLE (
    divida_id int,
    client_id int,
    valor decimal,
    data_criacao timestamptz,
    data_pagamento timestamptz,
    descricao jsonb,
    pago char(1)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.divida_id::int, 
        d.client_id::int, 
        d.valor::decimal, 
        d.data_criacao::timestamptz, 
        d.data_pagamento::timestamptz, 
        d.descricao::jsonb, 
        d.pago::char
    FROM maximus.dividas d
    WHERE d.client_id = p_client_id AND d.pago = 'N';
END;
$$;

-- Pagar dividas
CREATE OR REPLACE FUNCTION maximus.func_pagar_dividas(divida_ids text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
    total_valor DECIMAL;
    ids INT[];
BEGIN
    -- Convert the comma-separated text of IDs into an integer array
    ids := string_to_array(divida_ids, ',')::INT[];

    -- Iterate over the list of divida_ids
    FOR rec IN
        SELECT d.divida_id, d.valor, d.client_id
        FROM maximus.dividas d
        WHERE d.divida_id = ANY(ids) AND pago = 'N'
    LOOP
        -- Update the divida to mark it as paid
        UPDATE maximus.dividas
        SET pago = 'S'
        WHERE divida_id = rec.divida_id;

        -- Subtract the valor from total_dividas for the client
        UPDATE maximus.clientes
        SET total_dividas = total_dividas - rec.valor
        WHERE client_id = rec.client_id;
    END LOOP;

    RETURN jsonb_build_object('erro', 0);
END;
$$;
 

