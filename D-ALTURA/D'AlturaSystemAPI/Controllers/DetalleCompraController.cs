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
    public class DetalleCompraController : Controller
    {
        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;
        public DetalleCompraController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }

        [HttpGet]
        [Route("Listado")]
        public IActionResult Lista()
        {
            List<DetalleCompra> listado = new List<DetalleCompra>();

            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_detallecompra", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new DetalleCompra()
                            {
                                iddetallecompra = Convert.ToInt32(rd["iddetallecompra"]),
                                cantidad = Convert.ToInt32(rd["cantidad"]),
                                precio = Convert.ToDecimal(rd["precio"]),
                                total = Convert.ToDecimal(rd["total"]),
                                idcompra = Convert.ToInt32(rd["idcompra"]),
                                idproducto = Convert.ToInt32(rd["idproducto"])
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
        [Route("Obtener/{iddetallecompra:int}")]
        public IActionResult Obtener(int iddetallecompra)
        {
            List<DetalleCompra> listado = new List<DetalleCompra>();
            DetalleCompra detalleCompra = new DetalleCompra();

            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_detallecompra", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new DetalleCompra()
                            {
                                iddetallecompra = Convert.ToInt32(rd["iddetallecompra"]),
                                cantidad = Convert.ToInt32(rd["cantidad"]),
                                precio = Convert.ToDecimal(rd["precio"]),
                                total = Convert.ToDecimal(rd["total"]),
                                idcompra = Convert.ToInt32(rd["idcompra"]),
                                idproducto = Convert.ToInt32(rd["idproducto"])
                            });
                        }
                    }
                }

                detalleCompra = listado.Where(item => item.iddetallecompra == iddetallecompra).FirstOrDefault();
                return StatusCode(StatusCodes.Status200OK, new { message = "ok", response = detalleCompra });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = detalleCompra });
            }
        }

        [HttpPost]
        [Route("Guardar")]
        public IActionResult Guardar([FromBody] DetalleCompra objeto)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_guardar_detallecompra", connection);
                    cmd.Parameters.AddWithValue("cantidad", objeto.cantidad);
                    cmd.Parameters.AddWithValue("precio", objeto.precio);
                    cmd.Parameters.AddWithValue("total", objeto.total);
                    cmd.Parameters.AddWithValue("idcompra", objeto.idcompra);
                    cmd.Parameters.AddWithValue("idproducto", objeto.idproducto);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { message = "ok" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
            }
        }

        [HttpPut]
        [Route("Editar")]
        public IActionResult EditarDatos([FromBody] DetalleCompra objeto)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_editar_detallecompra", connection);
                    cmd.Parameters.AddWithValue("iddetallecompra", objeto.iddetallecompra == 0 ? DBNull.Value : objeto.iddetallecompra);
                    cmd.Parameters.AddWithValue("cantidad", objeto.cantidad == 0 ? DBNull.Value : objeto.cantidad);
                    cmd.Parameters.AddWithValue("precio", objeto.precio == 0 ? DBNull.Value : objeto.precio);
                    cmd.Parameters.AddWithValue("total", objeto.total == 0 ? DBNull.Value : objeto.total);
                    cmd.Parameters.AddWithValue("idcompra", objeto.idcompra == 0 ? DBNull.Value : objeto.idcompra);
                    cmd.Parameters.AddWithValue("idproducto", objeto.idproducto == 0 ? DBNull.Value : objeto.idproducto);
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
        [Route("Eliminar/{iddetallecompra:int}")]
        public IActionResult EliminarDatos(int iddetallecompra)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_eliminar_detallecompra", connection);
                    cmd.Parameters.AddWithValue("iddetallecompra", iddetallecompra);
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
