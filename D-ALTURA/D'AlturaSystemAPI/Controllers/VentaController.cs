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
    public class VentaController : Controller
    {
        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;
        public VentaController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }

        [HttpGet]
        [Route("Listado")]
        public IActionResult Lista()
        {
            List<Venta> listado = new List<Venta>();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_venta", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Venta()
                            {
                                idventa = Convert.ToInt32(rd["idventa"]),
                                fecha = Convert.ToDateTime(rd["fecha"]),
                                serie = rd["serie"].ToString(),
                                num_documento = rd["num_documento"].ToString(),
                                subtotal = Convert.ToDecimal(rd["subtotal"]),
                                iva = Convert.ToDecimal(rd["iva"]),
                                total = Convert.ToDecimal(rd["total"]),
                                estado = rd["estado"].ToString(),
                                idusuario = Convert.ToInt32(rd["idusuario"]),
                                idcliente = Convert.ToInt32(rd["idcliente"])
                            });
                        }

                    }

                }
                {

                }
                return StatusCode(StatusCodes.Status200OK, new { message = "ok", response = listado });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = listado });
            }
        }


        [HttpGet]
        [Route("Obtener/{idventa:int}")]

        public IActionResult Obtener(int idventa)
        {
            List<Venta> listado = new List<Venta>();
            Venta venta = new Venta();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_venta", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Venta()
                            {
                                idventa = Convert.ToInt32(rd["idventa"]),
                                fecha = Convert.ToDateTime(rd["fecha"]),
                                serie = rd["serie"].ToString(),
                                num_documento = rd["num_documento"].ToString(),
                                subtotal = Convert.ToDecimal(rd["subtotal"]),
                                iva = Convert.ToDecimal(rd["iva"]),
                                total = Convert.ToDecimal(rd["total"]),
                                estado = rd["estado"].ToString(),
                                idusuario = Convert.ToInt32(rd["idusuario"]),
                                idcliente = Convert.ToInt32(rd["idcliente"])
                            });
                        }
                    }

                }
                venta = listado.Where(item => item.idventa == idventa).FirstOrDefault();
                return StatusCode(StatusCodes.Status200OK, new { message = "ok", response = venta });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = venta });
            }
        }

        [HttpPost]
        [Route("Guardar")]

        public IActionResult Guardar([FromBody] Venta objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_guardar_venta", connection);
                    cmd.Parameters.AddWithValue("fecha", objeto.fecha);
                    cmd.Parameters.AddWithValue("serie", objeto.serie);
                    cmd.Parameters.AddWithValue("num_documento", objeto.num_documento);
                    cmd.Parameters.AddWithValue("subtotal", objeto.subtotal);
                    cmd.Parameters.AddWithValue("iva", objeto.iva);
                    cmd.Parameters.AddWithValue("total", objeto.total);
                    cmd.Parameters.AddWithValue("estado", objeto.estado);
                    cmd.Parameters.AddWithValue("idusuario", objeto.idusuario);
                    cmd.Parameters.AddWithValue("idcliente", objeto.idcliente);
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

        public IActionResult EditarDatos([FromBody] Venta objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_editar_venta", connection); 
                    cmd.Parameters.AddWithValue("idventa", objeto.idventa == 0 ? DBNull.Value : objeto.idventa);
                    cmd.Parameters.AddWithValue("fecha", objeto.fecha == DateTime.MinValue ? DBNull.Value : objeto.fecha);
                    cmd.Parameters.AddWithValue("serie", objeto.serie is null ? DBNull.Value : objeto.serie);
                    cmd.Parameters.AddWithValue("num_documento", objeto.num_documento is null ? DBNull.Value : objeto.num_documento);
                    cmd.Parameters.AddWithValue("subtotal", objeto.subtotal == 0 ? DBNull.Value : objeto.subtotal);
                    cmd.Parameters.AddWithValue("iva", objeto.iva == 0 ? DBNull.Value : objeto.iva);
                    cmd.Parameters.AddWithValue("total", objeto.total == 0 ? DBNull.Value : objeto.total);
                    cmd.Parameters.AddWithValue("estado", objeto.estado is null ? DBNull.Value : objeto.estado);
                    cmd.Parameters.AddWithValue("idusuario", objeto.idusuario == 0 ? DBNull.Value : objeto.idusuario);
                    cmd.Parameters.AddWithValue("idcliente", objeto.idcliente == 0 ? DBNull.Value : objeto.idcliente);
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
        [Route("Eliminar/{idventa:int}")]

        public IActionResult EliminarDatos(int idventa)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_eliminar_venta", connection);
                    cmd.Parameters.AddWithValue("idventa", idventa);
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
