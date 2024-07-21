using Newtonsoft.Json;

namespace vendinha.Entities.Cliente
{
    public class ClienteCPFReply
    {
        [JsonProperty("erro")]
        public virtual int erro { get; set; }

        [JsonProperty("nome_completo")]
        public virtual string NomeCompleto { get; set; }

        [JsonProperty("cpf")]
        public virtual string Cpf { get; set; }

        [JsonProperty("data_nascimento")]
        public virtual DateOnly DataNascimento { get; set; }

        [JsonProperty("email")]
        public virtual string Email { get; set; }

    }
}
