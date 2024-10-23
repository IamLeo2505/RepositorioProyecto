using AspNetCore.Reporting;
using D_AlturaSystemAPI.Servicio;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace D_AlturaSystemAPI.Controllers
{
    [EnableCors("ReglasCors")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportesController : ControllerBase
    {
        private readonly ServiciosBD serviciosBD;

        public ReportesController(ServiciosBD servicioBD)
        {
            serviciosBD = servicioBD;
        }

        [HttpGet("ReporteProveedores")]
        public IActionResult ObtenerDatosProveedores()
        {
            var dt = serviciosBD.ObtenerDatosProveedor();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Proveedores.rdlc");

            LocalReport report = new LocalReport(path);
            report.AddDataSource("dtProveedor", dt);

            var result = report.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReporteProveedores.pdf");
        }

        [HttpGet("ReporteVenta")]
        public IActionResult ObtenerDatosVenta()
        {
            var datos = serviciosBD.ObtenerDatosDeVenta();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Ventas.rdlc");

            LocalReport reporte = new LocalReport(path);
            reporte.AddDataSource("dtVenta", datos);

            var result = reporte.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReportedeVentas.pdf");
        }

        [HttpGet("ReporteCompra")]
        public IActionResult ObtenerDatosCompras()
        {
            var datos = serviciosBD.ObtenerDatosDeCompra();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Compras.rdlc");

            LocalReport reporte = new LocalReport(path);
            reporte.AddDataSource("dtCompra", datos);

            var result = reporte.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReportedeCompras.pdf");
        }

        [HttpGet("ReporteProductos")]
        public IActionResult ObtenerDatosProductos()
        {
            var dat = serviciosBD.ObtenerDatosdeProductos();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Productos.rdlc");

            LocalReport reporte = new LocalReport(path);

            reporte.AddDataSource("dtProductos", dat);

            var result = reporte.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReportedeProductos.pdf");
        }
    }
}