using Microsoft.AspNetCore.Mvc;
using vendinha.Entities;
using vendinha.Repositories;
using Microsoft.Extensions.Logging;
using vendinha.Entities.Cliente;
using vendinha.Entities.Cadastros;

namespace vendinha.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly ClienteRepository _clienteRepository;
        private readonly ILogger<ClienteController> _logger;

        public ClienteController(ClienteRepository clienteRepository, ILogger<ClienteController> logger)
        {
            _clienteRepository = clienteRepository;
            _logger = logger;
        }

        [HttpPost("criarcliente")]
        public async Task<ActionResult> CriarCliente([FromBody] ClienteRequest request)
        {
            try
            {
                var resposta = await _clienteRepository.CreateClienteAsync(request);
                return Ok(resposta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao Criar cliente");
                return BadRequest(ex);
            }
        }

        [HttpPost("editarcliente")]
        public async Task<ActionResult> EditarCliente([FromBody] ClienteRequest request)
        {
            try
            {
                var resposta = await _clienteRepository.EditClienteAsync(request);
                return Ok(resposta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao Editar cliente");
                return BadRequest(ex);
            }
        }

        [HttpPost("deletarcliente")]
        public async Task<ActionResult> DeletarCliente([FromBody] DeletarClienteRequest request)
        {
            try
            {
                var resposta = await _clienteRepository.DeletaClienteAsync(request);
                return Ok(resposta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao Deletar cliente");
                return BadRequest(ex);
            }
        }

        [HttpGet("buscarclientes")]
        public async Task<ActionResult<IEnumerable<ClientesReply>>> BuscarCliente()
        {
            try
            {
                var resposta = await _clienteRepository.BuscaClientesAsync();
                return Ok(resposta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar os clientes");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("buscarclientecpf")]
        public async Task<ActionResult> BuscarClienteCpf([FromBody] DeletarClienteRequest request)
        {
            try
            {
                var resposta = await _clienteRepository.BuscaClienteCpfAsync(request);
                return Ok(resposta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar o cliente");
                return BadRequest(ex);
            }
        }

        [HttpPost("buscarclientenome")]
        public async Task<ActionResult> BuscarClienteNome([FromBody] SelecionarNomeRequest request)
        {
            try
            {
                var resposta = await _clienteRepository.BuscaClienteNomeAsync(request);
                return Ok(resposta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar o cliente");
                return BadRequest(ex);
            }
        }
    }
}
