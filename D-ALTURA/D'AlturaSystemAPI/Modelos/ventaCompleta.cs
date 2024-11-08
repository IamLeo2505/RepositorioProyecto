namespace D_AlturaSystemAPI.Modelos
{
    public class VentaCompleta
    {
        public Venta Venta { get; set; }
        public List<DetalleVenta> DetalleVentas { get; set; }
    }

}
