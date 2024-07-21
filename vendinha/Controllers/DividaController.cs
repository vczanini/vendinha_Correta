using Microsoft.AspNetCore.Mvc;
using vendinha.Entities.Cadastros;
using vendinha.Entities.Dividas;
using vendinha.Repositories;

namespace vendinha.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DividaController : ControllerBase
    {
        private readonly DividaRepository _dividaRepository;
        private readonly ILogger<DividaController> _logger;

        public DividaController(DividaRepository dividaRepository, ILogger<DividaController> logger)
        {
            _dividaRepository = dividaRepository;
            _logger = logger;
        }

        [HttpPost("criardivida")]
        public async Task<ActionResult> CriarDivida([FromBody] DividasRequest request)
        {
            try
            {
                var resposta = await _dividaRepository.CreateDividaAsync(request);
                return Ok(resposta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao Criar divida");
                return BadRequest(ex);
            }
        }

        [HttpPost("buscardividas")]
        public async Task<ActionResult> BuscarDividas([FromBody] BuscaDividaRequest request)
        {
            try
            {
                var resposta = await _dividaRepository.BuscaDividasAsync(request);
                return Ok(resposta);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar divida");
                return BadRequest(ex);
            }
        }

        [HttpPost("pagardividas")]
        public async Task<ActionResult> PagarDividas([FromBody] PagarDividasRequest request)
        {
            try
            {
                var resultado = await _dividaRepository.PagarDividasAsync(request);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao pagar as dívidas");
                return BadRequest(ex.Message);
            }
        }
    }
}
