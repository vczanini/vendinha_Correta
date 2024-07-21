namespace vendinha.Entities.Dividas
{
    public class DividaReply
    {
        public virtual int dividaId { get; set; }

        public virtual int clientId { get; set; }

        public virtual decimal valor { get; set; }

        public virtual DateTime dataCriacao { get; set; }

        public virtual string descricao { get; set; }
    }
}
