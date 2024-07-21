namespace vendinha.Entities.Dividas
{
    public class DividasRequest
    {
        public virtual int clientId { get; set; }
        public virtual decimal valor { get; set; }
        public string descricao { get; set; }
    }
}
