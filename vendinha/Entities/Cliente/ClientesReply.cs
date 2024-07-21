using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace vendinha.Entities.Cliente
{
    public class ClientesReply
    {
        [JsonProperty("client_id")]
        public virtual int ClientId { get; set; }

        [JsonProperty("nome_completo")]
        public virtual string NomeCompleto { get; set; }

        [JsonProperty("cpf")]
        public virtual string Cpf { get; set; }

        [JsonProperty("data_nascimento")]
        public virtual DateOnly DataNascimento { get; set; }

        [JsonProperty("email")]
        public virtual string Email { get; set; }

        [JsonProperty("total_dividas")]
        public virtual decimal TotalDividas { get; set; }

        [Newtonsoft.Json.JsonIgnore]
        public int Idade
        {
            get
            {
                var hoje = DateOnly.FromDateTime(DateTime.Today);
                var idade = hoje.Year - DataNascimento.Year;
                if (DataNascimento > hoje.AddYears(-idade)) idade--;
                return idade;
            }
        }
    }

}
