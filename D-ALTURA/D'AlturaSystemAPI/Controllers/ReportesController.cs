using AspNetCore.Reporting;
using D_AlturaSystemAPI.Servicio;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

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

        [HttpGet("ReportedeEmpleados")]
        public IActionResult ObtenerDatosdeEmpleados()
        {
            var dt = serviciosBD.DatosdeEmpleados();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Empleados.rdlc");

            LocalReport report = new LocalReport(path);
            report.AddDataSource("dsEmpleado", dt);

            var result = report.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReportedeEmpleados.pdf");
        }

        [HttpGet("ReporteEmpleado/{idempleado:int}")]
        public IActionResult ReporteIdEmpleado(int idempleado)
        {
            // Obtener los datos de la factura específica
            DataTable datos = serviciosBD.ObtenerEmpleadoPorId(idempleado);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontró el empleado con el ID proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Empleados.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsEmpleado", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"ReporteEmpleado_{idempleado}.pdf");
        }

        [HttpGet("ReporteEmpleado/{nombre}")]
        public IActionResult ReporteNombreEmpleado(string nombre)
        {
            // Obtener los datos de la factura específica
            DataTable datos = serviciosBD.ObtenerEmpleadoPorNombre(nombre);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontró el empleado con el nombre proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Empleados.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsEmpleado", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"ReporteEmpleado_{nombre}.pdf");
        }

        [HttpGet("ReporteEmpleadoPor/{estado}")]
        public IActionResult ReporteEstadoEmpleado(string estado)
        {
            // Obtener los datos de la factura específica
            DataTable datos = serviciosBD.ObtenerEmpleadoPorEstado(estado);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontraron empleados con el estado proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Empleados.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsEmpleado", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"ReporteEmpleado_{estado}.pdf");
        }


        [HttpGet("ReporteClientes")]
        public IActionResult ObtenerDatosClientes()
        {
            var dt = serviciosBD.ObtenerDatosdeCliente();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Cliente.rdlc");

            LocalReport report = new LocalReport(path);
            report.AddDataSource("dsCliente", dt);

            var result = report.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReportedeClientes.pdf");
        }

        [HttpGet("ReporteCliente/{idcliente:int}")]
        public IActionResult ReporteIdCliente(int idcliente)
        {
            // Obtener los datos de la factura específica
            DataTable datos = serviciosBD.ObtenerClientePorId(idcliente);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontró el cliente con el ID proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "ClienteID.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsClienteID", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"ReporteCliente_{idcliente}.pdf");
        }

        [HttpGet("ReporteCliente/{nombre}")]
        public IActionResult ReporteNombreCliente(string nombre)
        {
            // Obtener los datos de la factura específica
            DataTable datos = serviciosBD.ObtenerClientePorNombre(nombre);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontró el cliente con el nombre proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "ClienteID.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsClienteID", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"ReporteCliente_{nombre}.pdf");
        }

        [HttpGet("ReporteCategoria")]
        public IActionResult ObtenerDatosCategoria()
        {
            var dt = serviciosBD.ObtenerDatosdeCategoria();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Categoria.rdlc");

            LocalReport report = new LocalReport(path);
            report.AddDataSource("dsCategoria", dt);

            var result = report.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReportedeCategoria.pdf");
        }

        [HttpGet("ReporteCategoria/{idcategoria:int}")]
        public IActionResult ReporteIDCategoria(int idcategoria)
        {
            // Obtener los datos de la factura específica
            DataTable dt = serviciosBD.ObtenerCategoriaporId(idcategoria);

            if (dt.Rows.Count == 0)
            {
                return NotFound("No se encontró la categoria con el ID de categoria proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Categoria.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsCategoria", dt);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"Categoria_{idcategoria}.pdf");
        }

        [HttpGet("ReporteCrédito")]
        public IActionResult ObtenerDatosCrédito()
        {
            var dt = serviciosBD.ObtenerDatosdeCrédito();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Crédito.rdlc");

            LocalReport report = new LocalReport(path);
            report.AddDataSource("dsCrédito", dt);

            var result = report.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReportedeCrédito.pdf");
        }

        [HttpGet("ReporteCrédito/{IdCrédito:int}")]
        public IActionResult ReporteIdCrédito(int IdCrédito)
        {
            // Obtener los datos de la factura específica
            DataTable datos = serviciosBD.ObtenerCréditoPorID(IdCrédito);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontró el Crédito con el ID proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Crédito.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsCrédito", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"ReporteCrédito_{IdCrédito}.pdf");
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

        [HttpGet("ReporteProveedor/{idproveedor:int}")]
        public IActionResult ReporteIdProveedor(int idproveedor)
        {
            // Obtener los datos de la factura específica
            DataTable datos = serviciosBD.ObtenerProveedorPorId(idproveedor);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontró el proveedor con el ID proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Proveedores.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dtProveedor", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"ReporteProveedor_{idproveedor}.pdf");
        }

        [HttpGet("ReporteVenta")]
        public IActionResult ObtenerDatosVenta()
        {
            var datos = serviciosBD.ObtenerDatosDeVenta();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Ventas.rdlc");

            LocalReport reporte = new LocalReport(path);
            reporte.AddDataSource("dsVentas", datos);

            var result = reporte.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReportedeVentas.pdf");
        }

        [HttpGet("ReporteVenta/{idventa:int}")]
        public IActionResult GetReportePdf(int idventa)
        {
            // Obtener los datos de la factura específica
            DataTable datos = serviciosBD.ObtenerVentaPorId(idventa);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontró la venta con el ID proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "VentaID.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsVentaID", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"Venta_{idventa}.pdf");
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

        [HttpGet("ReporteCompra/{idcompra:int}")]
        public IActionResult ReporteIDCompra(int idcompra)
        {
            // Obtener los datos de la factura específica
            DataTable datos = serviciosBD.ObtenerCompraPorId(idcompra);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontró la compra con el ID proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "ComprasID.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dtCompra", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"ReporteCompra_{idcompra}.pdf");
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

        [HttpGet("ReporteProducto/{idproducto:int}")]
        public IActionResult ReporteIdProducto(int idproducto)
        {
            // Obtener los datos de la factura específica
            DataTable datos = serviciosBD.ObtenerProductoPorId(idproducto);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontró el producto con el ID proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Productos.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dtProductos", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"Producto_{idproducto}.pdf");
        }

        [HttpGet("ReporteProducto/{f_vencimiento}")]
        public IActionResult ReporteProductoFVencimiento(DateTime f_vencimiento)
        {
            DataTable datos = serviciosBD.ObtenerProductoPorFechaVencimiento(f_vencimiento);

            if (datos.Rows.Count == 0)
            {
                return NotFound("No se encontró ningún producto entre las fechas proporcionadas.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Productos.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dtProductos", datos);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"Producto_{f_vencimiento}.pdf");
        }


        [HttpGet("ReporteUsuarios")]
        public IActionResult ObtenerDatosUsuarios()
        {
            var datos = serviciosBD.ObtenerDatosdeUsuarios();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Usuarios.rdlc");

            LocalReport reporte = new(path);

            reporte.AddDataSource("dsUsuarios", datos);

            var result = reporte.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReportedeUsuarios.pdf");
        }

        [HttpGet("ReporteUsuarios/{idusuario:int}")]
        public IActionResult ReporteIDUsuario(int idusuario)
        {
            // Obtener los datos de la factura específica
            DataTable dt = serviciosBD.ObtenerUsuarioporId(idusuario);

            if (dt.Rows.Count == 0)
            {
                return NotFound("No se encontró el usuario con el ID proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Usuarios.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsUsuarios", dt);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"Usuario_{idusuario}.pdf");
        }

        [HttpGet("ReporteUsuarios/{nombre}")]
        public IActionResult ReporteUsuarioNombre(string nombre)
        {
            // Obtener los datos de la factura específica
            DataTable dt = serviciosBD.ObtenerUsuarioporNombreEmpleado(nombre);

            if (dt.Rows.Count == 0)
            {
                return NotFound("No se encontró el usuario con el nombre de empleado proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Usuarios.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsUsuarios", dt);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1); 

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"Usuario_{nombre}.pdf");
        }

        [HttpGet("ReporteMarca")]
        public IActionResult ObtenerDatosMarca()
        {
            var datos = serviciosBD.ObtenerDatosdeMarca();

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Marca.rdlc");

            LocalReport reporte = new(path);

            reporte.AddDataSource("dsMarca", datos);

            var result = reporte.Execute(RenderType.Pdf);

            return File(result.MainStream, "application/pdf", "ReportedeMarca.pdf");
        }


        [HttpGet("ReporteMarca/{idmarca:int}")]
        public IActionResult ReporteIdMarca(int idmarca)
        {
            // Obtener los datos de la factura específica
            DataTable dt = serviciosBD.ObtenerMarcaPorID(idmarca);

            if (dt.Rows.Count == 0)
            {
                return NotFound("No se encontró la marca con el ID de marca proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Marca.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsMarca", dt);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"Reporte_Marca_{idmarca}.pdf");
        }


        [HttpGet("ReporteMarca/{nombremarca}")]
        public IActionResult ReporteNombreMarca(string nombremarca)
        {
            // Obtener los datos de la factura específica
            DataTable dt = serviciosBD.ObtenerMarcaPorNombre(nombremarca);

            if (dt.Rows.Count == 0)
            {
                return NotFound("No se encontró la marca con el nombre de marca proporcionado.");
            }

            // Ruta al archivo RDLC en el proyecto Reportes2
            string pathRDLC = Path.Combine(Directory.GetCurrentDirectory(), "Reportes", "Marca.rdlc");

            // Configurar LocalReport usando AspNetCore.Reporting
            LocalReport report = new LocalReport(pathRDLC);
            report.AddDataSource("dsMarca", dt);  // Nombre del DataSet en el archivo RDLC

            // Renderizar el reporte en formato PDF
            var result = report.Execute(RenderType.Pdf, 1);

            // Devolver el archivo PDF generado
            return File(result.MainStream, "application/pdf", $"Marca_{nombremarca}.pdf");
        }
    }
}