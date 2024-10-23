namespace D_AlturaSystemAPI.Modelos
{
    public class DetalleVenta
    {
        public int iddetalleventa { get; set; }
        public int cantidad { get; set; }
        public decimal precio { get; set; }
        public decimal total { get; set; }
        public int idventa { get; set; }
        public int idproducto { get; set; }
    }
}

