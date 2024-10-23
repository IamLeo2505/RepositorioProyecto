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
    public class DetalleVentaController : Controller
    {
        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;
        public DetalleVentaController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }

        [HttpGet]
        [Route("Listado")]
        public IActionResult Lista()
        {
            List<DetalleVenta> listado = new List<DetalleVenta>();

            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_detalleventa", connection); // Cambiar al nombre del procedimiento almacenado correcto
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new DetalleVenta()
                            {
                                iddetalleventa = Convert.ToInt32(rd["iddetalleventa"]),
                                cantidad = Convert.ToInt32(rd["cantidad"]),
                                precio = Convert.ToDecimal(rd["precio"]),
                                total = Convert.ToDecimal(rd["total"]),
                                idventa = Convert.ToInt32(rd["idventa"]),
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
        [Route("Obtener/{iddetalleventa:int}")]
        public IActionResult Obtener(int iddetalleventa)
        {
            List<DetalleVenta> listado = new List<DetalleVenta>();
            DetalleVenta detalleVenta = new DetalleVenta();

            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_detalleventa", connection); // Cambiar al procedimiento almacenado correcto
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new DetalleVenta()
                            {
                                iddetalleventa = Convert.ToInt32(rd["iddetalleventa"]),
                                cantidad = Convert.ToInt32(rd["cantidad"]),
                                precio = Convert.ToDecimal(rd["precio"]),
                                total = Convert.ToDecimal(rd["total"]),
                                idventa = Convert.ToInt32(rd["idventa"]),
                                idproducto = Convert.ToInt32(rd["idproducto"])
                            });
                        }
                    }
                }

                detalleVenta = listado.Where(item => item.iddetalleventa == iddetalleventa).FirstOrDefault();
                return StatusCode(StatusCodes.Status200OK, new { message = "ok", response = detalleVenta });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = detalleVenta });
            }
        }

        [HttpPost]
        [Route("Guardar")]
        public IActionResult Guardar([FromBody] DetalleVenta objeto)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_guardar_detalleventa", connection); // Cambiar al procedimiento almacenado correcto
                    cmd.Parameters.AddWithValue("cantidad", objeto.cantidad);
                    cmd.Parameters.AddWithValue("precio", objeto.precio);
                    cmd.Parameters.AddWithValue("total", objeto.total);
                    cmd.Parameters.AddWithValue("idventa", objeto.idventa);
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

        public IActionResult EditarDatos([FromBody] DetalleVenta objeto)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_editar_detalleventa", connection); // Cambiar al procedimiento almacenado correcto
                    cmd.Parameters.AddWithValue("iddetalleventa", objeto.iddetalleventa == 0 ? DBNull.Value : objeto.iddetalleventa);
                    cmd.Parameters.AddWithValue("cantidad", objeto.cantidad == 0 ? DBNull.Value : objeto.cantidad);
                    cmd.Parameters.AddWithValue("precio", objeto.precio == 0 ? DBNull.Value : objeto.precio);
                    cmd.Parameters.AddWithValue("total", objeto.total == 0 ? DBNull.Value : objeto.total);
                    cmd.Parameters.AddWithValue("idventa", objeto.idventa == 0 ? DBNull.Value : objeto.idventa);
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
        [Route("Eliminar/{iddetalleventa:int}")]

        public IActionResult EliminarDatos(int iddetalleventa)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_eliminar_detalleventa", connection); 
                    cmd.Parameters.AddWithValue("iddetalleventa", iddetalleventa);
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
