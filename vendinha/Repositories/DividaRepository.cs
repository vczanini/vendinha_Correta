using Newtonsoft.Json;
using System.Data;
using vendinha.Entities.Cadastros;
using vendinha.Entities.Cliente;
using vendinha.Entities.Dividas;
using vendinha.Extensions;

namespace vendinha.Repositories
{
    public class DividaRepository : IRepositoryDivida
    {
        private readonly NHibernate.ISession _session;
        private readonly ILogger<DividaRepository> _logger;

        public DividaRepository(NHibernate.ISession session, ILogger<DividaRepository> logger)
        {
            _session = session;
            _logger = logger;
        }

        public async Task<CadastroReply> CreateDividaAsync(DividasRequest request)
        {
            try
            {
                var requestJson = JsonConvert.SerializeObject(request);

                using (var cmd = _session.Connection.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT maximus.func_gerar_divida(:cliente_json::jsonb)";

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
                return new CadastroReply() { erro = 4 };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ao criar a divida");
                throw;
            }
        }

        public async Task<List<DividaReply>> BuscaDividasAsync(BuscaDividaRequest request)
        {
            try
            {
                using (var cmd = _session.Connection.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT * FROM maximus.func_seleciona_dividas_cliente(:p_client_id)";

                    var parameter = cmd.CreateParameter();
                    parameter.ParameterName = "p_client_id";
                    parameter.DbType = DbType.Int32;
                    parameter.Value = request.client_id;
                    cmd.Parameters.Add(parameter);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        var results = new List<DividaReply>();
                        while (await reader.ReadAsync())
                        {
                            var divida = new DividaReply
                            {
                                dividaId = reader.GetInt32(reader.GetOrdinal("divida_id")),
                                clientId = reader.GetInt32(reader.GetOrdinal("client_id")),
                                valor = reader.GetDecimal(reader.GetOrdinal("valor")),
                                descricao = reader.GetString(reader.GetOrdinal("descricao")),
                                dataCriacao = reader.GetFieldValue<DateTime>(reader.GetOrdinal("data_criacao"))
                            };
                            results.Add(divida);
                        }
                        return results;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ao criar a divida");
                throw;
            }
        }

        public async Task<CadastroReply> PagarDividasAsync(PagarDividasRequest request)
        {
            try
            {
                using (var cmd = _session.Connection.CreateCommand())
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.CommandText = "SELECT maximus.func_pagar_dividas(@divida_ids)";

                    var parameter = cmd.CreateParameter();
                    parameter.ParameterName = "divida_ids";
                    parameter.DbType = DbType.String;
                    parameter.Value = string.Join(",", request.divida_ids); // Convert List<int> to comma-separated string
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
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error paying debts");
                throw;
            }
            return null;
        }
    }
}
