using D_AlturaSystemAPI.Modelos;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Cors;
using D_AlturaSystemAPI.Modelos.D_AlturaSystemAPI.Modelos;

namespace D_AlturaSystemAPI.Controllers
{
    [EnableCors("ReglasCors")]
    [Route("api/[controller]")]
    [ApiController]
    public class CreditoController : Controller
    {

        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;

        public CreditoController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }

        [HttpGet]
        [Route("Listado de Créditos")]
        public IActionResult ListadoCréditos()
            {
                List<Crédito> listado = new List<Crédito>();

                try
                {

                    using (var connection = new SqlConnection(ConnectSQL))
                    {
                        connection.Open();
                        var cmd = new SqlCommand("pA_lista_credito", connection);
                        cmd.CommandType = CommandType.StoredProcedure;

                        using (var rd = cmd.ExecuteReader())
                        {
                            while (rd.Read())
                            {
                                listado.Add(new Crédito()
                                {
                                    idcrédito = Convert.ToInt32(rd["idcrédito"]),
                                    PlazoPago = Convert.ToInt32(rd["PlazoPago"].ToString()),
                                    TasaInteres = Convert.ToInt32(rd["TasaInteres"].ToString()),
                                    Monto = Convert.ToInt32(rd["Monto"].ToString()),
                                    FechaInicio = Convert.ToDateTime(rd["FechaInicio"].ToString()),
                                });
                            }
                        }

                    }
                    return StatusCode(StatusCodes.Status200OK, new { message = "Correcto.", response = listado });
                }
                catch (Exception error)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = listado });
                }
            }

            [HttpGet]
            [Route("Obtener/{idcrédito:int}")]

            public IActionResult Obtener(int idcrédito)
            {
                List<Crédito> listado = new List<Crédito>();
                Crédito crédito = new Crédito();

                try
                {

                    using (var connection = new SqlConnection(ConnectSQL))
                    {
                        connection.Open();
                        var cmd = new SqlCommand("pA_lista_credito", connection);
                        cmd.CommandType = CommandType.StoredProcedure;

                        using (var rd = cmd.ExecuteReader())
                        {
                            while (rd.Read())
                            {
                                listado.Add(new Crédito()
                                {
                                    idcrédito = Convert.ToInt32(rd["idcrédito"]),
                                    PlazoPago = Convert.ToInt32(rd["PlazoPago"].ToString()),
                                    TasaInteres = Convert.ToInt32(rd["TasaInteres"].ToString()),
                                    Monto = Convert.ToInt32(rd["Monto"].ToString()),
                                    FechaInicio = Convert.ToDateTime(rd["FechaInicio"].ToString()),     
                                });
                            }
                        }

                    }
                    crédito = listado.Where(item => item.idcrédito == idcrédito).FirstOrDefault();
                    return StatusCode(StatusCodes.Status200OK, new { message = "Correcto.", response = crédito });

                }
                catch (Exception error)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = crédito });
                }
            }
        [HttpPost]
        [Route("Guardar")]
        public IActionResult GuardarCreditoYDetalles([FromBody] CreditoCompleta creditoCompleta)
        {
            try
            {
                using (var connection = new SqlConnection(ConnectSQLThree))
                {
                    connection.Open();

                    // Guardar el crédito (maestro)
                    var cmd = new SqlCommand("pA_guardar_credito", connection);
                    cmd.Parameters.AddWithValue("PlazoPago", creditoCompleta.Crédito.PlazoPago);
                    cmd.Parameters.AddWithValue("TasaInteres", creditoCompleta.Crédito.TasaInteres);
                    cmd.Parameters.AddWithValue("Monto", creditoCompleta.Crédito.Monto);
                    cmd.Parameters.AddWithValue("FechaInicio", creditoCompleta.Crédito.FechaInicio);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Ejecutar y obtener el idcrédito generado usando SCOPE_IDENTITY
                    var idCredito = Convert.ToInt32(cmd.ExecuteScalar());

                    // Guardar cada detalle de crédito
                    foreach (var detalle in creditoCompleta.Detalles)
                    {
                        var cmdDetalle = new SqlCommand("pA_guardar_detallecredito", connection);
                        cmdDetalle.Parameters.AddWithValue("FechaPago", detalle.FechaPago);
                        cmdDetalle.Parameters.AddWithValue("MontoAbono", detalle.MontoAbono);
                        cmdDetalle.Parameters.AddWithValue("IdCrédito", idCredito); // Pasamos el idcrédito generado
                        cmdDetalle.CommandType = CommandType.StoredProcedure;

                        cmdDetalle.ExecuteNonQuery();
                    }
                }

                return StatusCode(StatusCodes.Status200OK, new { message = "Crédito y detalles guardados con éxito." });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
            }
        }


        [HttpPut]
            [Route("EditarCrédito")]

            public IActionResult EditarCrédito([FromBody] Crédito objeto)
            {

                try
                {

                    using (var connection = new SqlConnection(ConnectSQL))
                    {
                        connection.Open();
                        var cmd = new SqlCommand("pA_editar_credito", connection);
                        cmd.Parameters.AddWithValue("idcrédito", objeto.idcrédito == 0 ? DBNull.Value : objeto.idcrédito);
                        cmd.Parameters.AddWithValue("PlazoPago", objeto.PlazoPago == 0 ? DBNull.Value : objeto.PlazoPago);
                        cmd.Parameters.AddWithValue("TasaInteres", objeto.TasaInteres == 0 ? DBNull.Value : objeto.TasaInteres);
                        cmd.Parameters.AddWithValue("Monto", objeto.Monto == 0 ? DBNull.Value : objeto.Monto);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.ExecuteNonQuery();

                    }

                    return StatusCode(StatusCodes.Status200OK, new { message = "Datos editados." });

                }
                catch (Exception error)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
                }
            }

            [HttpDelete]
            [Route("EliminarCrédito/{idcrédito:int}")]

            public IActionResult EliminarCrédito(int idcrédito)
            {

                try
                {

                    using (var connection = new SqlConnection(ConnectSQL))
                    {
                        connection.Open();
                        var cmd = new SqlCommand("pA_eliminar_credito", connection);
                        cmd.Parameters.AddWithValue("idcrédito", idcrédito);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.ExecuteNonQuery();

                    }

                    return StatusCode(StatusCodes.Status200OK, new { message = "Credito eliminado." });

                }
                catch (Exception error)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
                }
            }
        
    }
}
