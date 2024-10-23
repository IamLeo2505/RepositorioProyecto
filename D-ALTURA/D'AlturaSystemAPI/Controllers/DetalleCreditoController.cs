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
    public class DetalleCreditoController : Controller
    {
        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;
        public DetalleCreditoController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }

        [HttpGet]
        [Route("Listado")]
        public IActionResult Lista()
        {
            List<DetalleCredito> listado = new List<DetalleCredito>();

            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_detallecredito", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new DetalleCredito()
                            {
                                idDetalleCrédito = Convert.ToInt32(rd["IdDetalleCrédito"]),
                                FechaPago = Convert.ToDateTime(rd["FechaPago"]),
                                MontoAbono = Convert.ToDouble(rd["MontoAbono"]),
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
        [Route("Obtener/{IdDetalleCrédito:int}")]
        public IActionResult Obtener(int idDetalleCrédito)
        {
            List<DetalleCredito> listado = new List<DetalleCredito>();
            DetalleCredito DetalleCrédito = new DetalleCredito();

            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_detallecredito", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new DetalleCredito()
                            {
                                idDetalleCrédito = Convert.ToInt32(rd["IdDetalleCrédito"]),
                                FechaPago = Convert.ToDateTime(rd["FechaPago"]),
                                MontoAbono = Convert.ToDouble(rd["MontoAbono"]),
                            });
                        }
                    }
                }

                DetalleCrédito = listado.Where(item => item.idDetalleCrédito == idDetalleCrédito).FirstOrDefault();
                return StatusCode(StatusCodes.Status200OK, new { message = "ok", response = DetalleCrédito });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = DetalleCrédito });
            }
        }

        [HttpPost]
        [Route("Guardar")]
        public IActionResult Guardar([FromBody] DetalleCredito objeto)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_guardar_detallecredito", connection);
                    cmd.Parameters.AddWithValue("FechaPago", objeto.FechaPago);
                    cmd.Parameters.AddWithValue("MontoAbono", objeto.MontoAbono);
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
        public IActionResult EditarDatos([FromBody] DetalleCredito objeto)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_editar_detallecredito", connection);
                    cmd.Parameters.AddWithValue("IdDetalleCrédito", objeto.idDetalleCrédito);
                    cmd.Parameters.AddWithValue("FechaPago", objeto.FechaPago == DateTime.MinValue ? DateTime.Now : objeto.FechaPago);
                    cmd.Parameters.AddWithValue("MontoAbono", objeto.MontoAbono);
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
        [Route("Eliminar/{IdDetalleCrédito:int}")]
        public IActionResult EliminarDatos(int idDetalleCredito)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_eliminar_detallecredito", connection);
                    cmd.Parameters.AddWithValue("IdDetalleCrédito", idDetalleCredito);
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
