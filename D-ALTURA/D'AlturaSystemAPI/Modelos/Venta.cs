namespace D_AlturaSystemAPI.Modelos    
{
    public class Venta
    {
        public int idventa { get; set; }
        public DateTime fecha { get; set; }
        public string serie { get; set; }
        public string num_documento { get; set; }
        public decimal subtotal { get; set; }
        public decimal iva { get; set; }
        public decimal total { get; set; }
        public string estado { get; set; }
        public int idusuario { get; set; }
        public int idcliente { get; set; }
    }

}
