namespace D_AlturaSystemAPI.Modelos
{
    public class Compra
    {
        public int idcompra { get; set; }
        public DateTime fecha { get; set; }
        public string num_documento { get; set; }
        public decimal subtotal { get; set; }
        public decimal iva { get; set; }
        public decimal total { get; set; }
        public string estado { get; set; }
        public int idusuario { get; set; }
        public int idproveedor { get; set; }
    }
}
