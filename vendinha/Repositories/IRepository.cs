using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using vendinha.Entities;
using vendinha.Entities.Cadastros;
using vendinha.Entities.Cliente;
using vendinha.Entities.Dividas;

namespace vendinha.Repositories
{
    public interface IRepository<T>
    {
        Task<CadastroReply> CreateClienteAsync(ClienteRequest request);
        Task<CadastroReply> EditClienteAsync(ClienteRequest request);
        Task<CadastroReply> DeletaClienteAsync(DeletarClienteRequest request);
        Task<IEnumerable<ClientesReply>> BuscaClientesAsync();
        Task<ClienteCPFReply> BuscaClienteCpfAsync(DeletarClienteRequest request);
        Task<List<ClientesReply>> BuscaClienteNomeAsync(SelecionarNomeRequest request);
    }

    public interface IRepositoryDivida
    {
        Task<CadastroReply> CreateDividaAsync(DividasRequest request);
        Task<List<DividaReply>> BuscaDividasAsync(BuscaDividaRequest request);
        Task<CadastroReply> PagarDividasAsync(PagarDividasRequest request);
    }
}