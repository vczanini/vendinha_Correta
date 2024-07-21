using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NHibernate;
using vendinha.Entities;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Data;
using System.Data.Common;
using vendinha.Entities.Cliente;
using Microsoft.AspNetCore.Http.HttpResults;
using vendinha.Entities.Cadastros;
using NHibernate.Mapping.ByCode;
using vendinha.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace vendinha.Repositories
{
    public class ClienteRepository : IRepository<Clientes>
    {
        private readonly NHibernate.ISession _session;
        private readonly ILogger<ClienteRepository> _logger;

        public ClienteRepository(NHibernate.ISession session, ILogger<ClienteRepository> logger)
        {
            _session = session;
            _logger = logger;
        }

        public async Task<CadastroReply> CreateClienteAsync(ClienteRequest request)
        {
            try
            {
                // Check if CPF is valid
                bool isValidCpf = Utils.IsCpf(request.CPF);
                var requestJson = JsonConvert.SerializeObject(request);

                if (!isValidCpf)
                {
                    return new CadastroReply() { erro = 3 };
                }

                using (var cmd = _session.Connection.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT maximus.func_gera_cliente(:cliente_json::jsonb)";

                    var parameter = cmd.CreateParameter();
                    parameter.ParameterName = "cliente_json";
                    parameter.DbType = DbType.String;
                    parameter.Value = requestJson;
                    cmd.Parameters.Add(parameter);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var jsonResult = reader.GetString(0);
                            var resultObject = JsonConvert.DeserializeObject<CadastroReply>(jsonResult);

                            return resultObject;
                        }
                    }
                }

                // Return error if no result is obtained
                return new CadastroReply() { erro = 4 };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ao criar o cliente");
                throw ex;
            }
        }

        public async Task<CadastroReply> EditClienteAsync(ClienteRequest request)
        {
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);

                using (var cmd = _session.Connection.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT maximus.func_edita_cliente(:cliente_json::jsonb)";

                    var parameter = cmd.CreateParameter();
                    parameter.ParameterName = "cliente_json";
                    parameter.DbType = DbType.String;
                    parameter.Value = requestJson;
                    cmd.Parameters.Add(parameter);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var jsonResult = reader.GetString(0);
                            var resultObject = JsonConvert.DeserializeObject<CadastroReply>(jsonResult);

                            return resultObject;
                        }
                    }
                }

                // Return error if no result is obtained
                return new CadastroReply() { erro = 4 };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating client");
                throw;
            }
        }

        public async Task<CadastroReply> DeletaClienteAsync(DeletarClienteRequest request)
        {
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);

                using (var cmd = _session.Connection.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT maximus.func_deleta_cliente(:cliente_cpf::jsonb)";

                    var parameter = cmd.CreateParameter();
                    parameter.ParameterName = "cliente_cpf";
                    parameter.DbType = DbType.String;
                    parameter.Value = requestJson;
                    cmd.Parameters.Add(parameter);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var jsonResult = reader.GetString(0);
                            var resultObject = JsonConvert.DeserializeObject<CadastroReply>(jsonResult);

                            return resultObject;
                        }
                    }
                }

                // Return error if no result is obtained
                return new CadastroReply() { erro = 4 };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating client");
                throw;
            }
        }

        public async Task<IEnumerable<ClientesReply>> BuscaClientesAsync()
        {
            try
            {
                using (var cmd = _session.Connection.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT json_agg(t) FROM maximus.func_organiza_clientes() t";

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var jsonResult = reader.GetString(0);
                            var resultObject = JsonConvert.DeserializeObject<List<ClientesReply>>(jsonResult);
                            return resultObject;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar os clientes");
                throw;
            }

            return Enumerable.Empty<ClientesReply>();
        }

        public async Task<ClienteCPFReply> BuscaClienteCpfAsync(DeletarClienteRequest request)
        {
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);

                using (var cmd = _session.Connection.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT maximus.func_seleciona_cliente_cpf(:cliente_cpf::jsonb)";

                    var parameter = cmd.CreateParameter();
                    parameter.ParameterName = "cliente_cpf";
                    parameter.DbType = DbType.String;
                    parameter.Value = requestJson;
                    cmd.Parameters.Add(parameter);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var jsonResult = reader.GetString(0);
                            var resultObject = JsonConvert.DeserializeObject<ClienteCPFReply>(jsonResult);
                            resultObject.Cpf = request.CPF;

                            return resultObject;
                        }
                    }
                }

                // Return error if no result is obtained
                return new ClienteCPFReply() { erro = 4 };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating client");
                throw;
            }
        }

        public async Task<List<ClientesReply>> BuscaClienteNomeAsync(SelecionarNomeRequest request)
        {
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);

                using (var cmd = _session.Connection.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM maximus.func_seleciona_cliente_nome(:cliente_nome::jsonb)";

                    var parameter = cmd.CreateParameter();
                    parameter.ParameterName = "cliente_nome";
                    parameter.DbType = DbType.String;
                    parameter.Value = requestJson;
                    cmd.Parameters.Add(parameter);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        var results = new List<ClientesReply>();
                        while (await reader.ReadAsync())
                        {
                            var cliente = new ClientesReply
                            {
                                ClientId = reader.GetInt32(reader.GetOrdinal("client_id")),
                                NomeCompleto = reader.GetString(reader.GetOrdinal("nome_completo")),
                                Cpf = reader.GetString(reader.GetOrdinal("cpf")),
                                DataNascimento = reader.GetFieldValue<DateOnly>(reader.GetOrdinal("data_nascimento")),
                                Email = reader.GetString(reader.GetOrdinal("email")),
                                TotalDividas = reader.GetDecimal(reader.GetOrdinal("total_dividas"))
                            };
                            results.Add(cliente);
                        }
                        return results;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching client by name");
                throw;
            }
        }
    }
}
