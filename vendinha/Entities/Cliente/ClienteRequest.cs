namespace vendinha.Entities.Cliente
{
    public class ClienteRequest
    {
        public virtual string nomeCompleto { get; set; }
        public virtual string CPF { get; set; }
        public virtual DateOnly dataNascimento { get; set; }
        public virtual string email { get; set; }
    }
}
