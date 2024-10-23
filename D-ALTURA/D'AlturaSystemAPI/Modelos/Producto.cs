namespace D_AlturaSystemAPI.Modelos
{
    public class Producto
    {
        public int idproducto { get; set; }
        public int codigo { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public DateTime f_ingreso { get; set; }
        public DateTime f_vencimiento { get; set; }
        public decimal precio_compra { get; set; }
        public decimal precio_venta { get; set; }
        public int stock { get; set; }
        public string estado { get; set; }
        public int idcategoria { get; set; }
    }
}

