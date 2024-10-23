namespace D_AlturaSystemAPI.Modelos
{
    public class DetalleCompra
    {
        public int iddetallecompra { get; set; }
        public int cantidad { get; set; }
        public decimal precio { get; set; }
        public decimal total { get; set; }
        public int idcompra { get; set; } 
        public int idproducto { get; set; }
    }
}

