using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using D_AlturaSystemAPI.Modelos;

using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Cors;

namespace D_AlturaSystemAPI.Controllers
{
    [EnableCors("ReglasCors")]
    [Route("api/[controller]")]
    [ApiController]
    public class ComprasController : Controller
    {
        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;
        public ComprasController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }

        [HttpGet]
        [Route("Listado")]
        public IActionResult Lista()
        {
            List<Compra> listado = new List<Compra>();

            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_compra", connection); 
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Compra()
                            {
                                idcompra = Convert.ToInt32(rd["idcompra"]),
                                fecha = Convert.ToDateTime(rd["fecha"]),
                                num_documento = rd["num_documento"].ToString(),
                                subtotal = Convert.ToDecimal(rd["subtotal"]),
                                iva = Convert.ToDecimal(rd["iva"]),
                                total = Convert.ToDecimal(rd["total"]),
                                estado = rd["estado"].ToString(),
                                idusuario = Convert.ToInt32(rd["idusuario"]),
                                idproveedor = Convert.ToInt32(rd["idproveedor"]) 
                            });
                        }
                    }
                }

                return StatusCode(StatusCodes.Status200OK, new { message = "ok", response = listado });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = listado });
            }
        }

        [HttpGet]
        [Route("Obtener/{idcompra:int}")]
        public IActionResult Obtener(int idcompra)
        {
            List<Compra> listado = new List<Compra>();
            Compra compra = new Compra();

            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_compra", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Compra()
                            {
                                idcompra = Convert.ToInt32(rd["idcompra"]),
                                fecha = Convert.ToDateTime(rd["fecha"]),
                                num_documento = rd["num_documento"].ToString(),
                                subtotal = Convert.ToDecimal(rd["subtotal"]),
                                iva = Convert.ToDecimal(rd["iva"]),
                                total = Convert.ToDecimal(rd["total"]),
                                estado = rd["estado"].ToString(),
                                idusuario = Convert.ToInt32(rd["idusuario"]),
                                idproveedor = Convert.ToInt32(rd["idproveedor"])
                            });
                        }
                    }
                }
                compra = listado.Where(item => item.idcompra == idcompra).FirstOrDefault();
                return StatusCode(StatusCodes.Status200OK, new { message = "ok", response = compra });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = compra });
            }
        }

        [HttpPost]
        [Route("RegistrarCompraCompleta")]
        public IActionResult RegistrarCompraCompleta([FromBody] CompraCompleta compraCompleta)
        {
            using (var connection = new SqlConnection(ConnectSQLThree))
            {
                connection.Open();
                var transaction = connection.BeginTransaction();

                try
                {
                    // 1. Guardar la Compra y obtener idcompra
                    var cmdCompra = new SqlCommand("pA_guardar_compra", connection, transaction);
                    cmdCompra.CommandType = CommandType.StoredProcedure;

                    cmdCompra.Parameters.AddWithValue("@fecha", compraCompleta.Compra.fecha);
                    cmdCompra.Parameters.AddWithValue("@num_documento", compraCompleta.Compra.num_documento);
                    cmdCompra.Parameters.AddWithValue("@subtotal", compraCompleta.Compra.subtotal);
                    cmdCompra.Parameters.AddWithValue("@iva", compraCompleta.Compra.iva);
                    cmdCompra.Parameters.AddWithValue("@total", compraCompleta.Compra.total);
                    cmdCompra.Parameters.AddWithValue("@estado", compraCompleta.Compra.estado);
                    cmdCompra.Parameters.AddWithValue("@idusuario", compraCompleta.Compra.idusuario);
                    cmdCompra.Parameters.AddWithValue("@idproveedor", compraCompleta.Compra.idproveedor);

                    var idCompraParam = new SqlParameter("@idcompra", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    cmdCompra.Parameters.Add(idCompraParam);

                    cmdCompra.ExecuteNonQuery();
                    var idCompra = (int)idCompraParam.Value;

                    // 2. Guardar cada Detalle de la Compra
                    foreach (var detalle in compraCompleta.DetalleCompras)
                    {
                        var cmdDetalle = new SqlCommand("pA_guardar_detallecompra", connection, transaction);
                        cmdDetalle.CommandType = CommandType.StoredProcedure;

                        cmdDetalle.Parameters.AddWithValue("@cantidad", detalle.cantidad);
                        cmdDetalle.Parameters.AddWithValue("@precio", detalle.precio);
                        cmdDetalle.Parameters.AddWithValue("@total", detalle.total);
                        cmdDetalle.Parameters.AddWithValue("@idcompra", idCompra);
                        cmdDetalle.Parameters.AddWithValue("@idproducto", detalle.idproducto);

                        cmdDetalle.ExecuteNonQuery();
                    }

                    // Confirmar la transacción
                    transaction.Commit();
                    return StatusCode(StatusCodes.Status200OK, new { message = "Compra y detalles guardados con éxito" });
                }
                catch (Exception ex)
                {
                    // Revertir la transacción en caso de error
                    transaction.Rollback();
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
                }
            }
        }


        [HttpPut]
        [Route("Editar")]
        public IActionResult EditarDatos([FromBody] Compra objeto)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_editar_compra", connection);
                    cmd.Parameters.AddWithValue("idcompra", objeto.idcompra == 0 ? DBNull.Value : objeto.idcompra);
                    cmd.Parameters.AddWithValue("fecha", objeto.fecha == DateTime.MinValue ? DBNull.Value : objeto.fecha);
                    cmd.Parameters.AddWithValue("num_documento", objeto.num_documento is null ? DBNull.Value : objeto.num_documento);
                    cmd.Parameters.AddWithValue("subtotal", objeto.subtotal == 0 ? DBNull.Value : objeto.subtotal);
                    cmd.Parameters.AddWithValue("iva", objeto.iva == 0 ? DBNull.Value : objeto.iva);
                    cmd.Parameters.AddWithValue("total", objeto.total == 0 ? DBNull.Value : objeto.total);
                    cmd.Parameters.AddWithValue("estado", objeto.estado is null ? DBNull.Value : objeto.estado);
                    cmd.Parameters.AddWithValue("idusuario", objeto.idusuario == 0 ? DBNull.Value : objeto.idusuario);
                    cmd.Parameters.AddWithValue("idproveedor", objeto.idproveedor == 0 ? DBNull.Value : objeto.idproveedor);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();
                }
                return StatusCode(StatusCodes.Status200OK, new { message = "Editado" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
            }
        }

        [HttpDelete]
        [Route("Eliminar/{idcompra:int}")]
        public IActionResult EliminarDatos(int idcompra)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_eliminar_compra", connection);
                    cmd.Parameters.AddWithValue("idcompra", idcompra);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();
                }
                return StatusCode(StatusCodes.Status200OK, new { message = "Eliminado" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
            }
        }



    }
}
