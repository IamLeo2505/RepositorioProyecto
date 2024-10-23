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

    public class DevolucionesController : Controller
    {

        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;

        public DevolucionesController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }


        [HttpGet]
        [Route("Lista de Devoluciones")]
        public IActionResult Listado()
        {
            List<Devoluciones> listado = new List<Devoluciones>();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_devolucion", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Devoluciones()
                            {
                                IdDevolución = Convert.ToInt32(rd["IdDevolución"]),
                                FechaDevolución = Convert.ToDateTime(rd["FechaDevolución"]),
                                Motivo = rd["Motivo"].ToString()                              
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
        [Route("Obtener/{IdDevolución:int}")]

        public IActionResult Obtener(int IdDevolución)
        {
            List<Devoluciones> listado = new List<Devoluciones>();
            Devoluciones Devolución = new Devoluciones();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_devolucion", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Devoluciones()
                            {
                                IdDevolución = Convert.ToInt32(rd["IdDevolución"]),
                                FechaDevolución = Convert.ToDateTime(rd["FechaDevolución"]),
                                Motivo = rd["Motivo"].ToString()
                            });
                        }
                    }

                }
                Devolución = listado.Where(item => item.IdDevolución == IdDevolución).FirstOrDefault();
                return StatusCode(StatusCodes.Status200OK, new { message = "Correcto.", response = Devolución });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = Devolución });
            }
        }

        [HttpPost]
        [Route("Guardar Cambios")]

        public IActionResult Guardar([FromBody] Devoluciones objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_guardar_devolucion", connection);
                    cmd.Parameters.AddWithValue("IdDevolución", objeto.IdDevolución);
                    cmd.Parameters.AddWithValue("FechaDevolución", objeto.FechaDevolución);
                    cmd.Parameters.AddWithValue("Motivo", objeto.Motivo);                    
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();

                }

                return StatusCode(StatusCodes.Status200OK, new { message = "Correcto." });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
            }
        }

        [HttpPut]
        [Route("EditarDatos")]

        public IActionResult EditarDatos([FromBody]  Devoluciones objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_editar_devolucion", connection);                  
                    cmd.Parameters.AddWithValue("IdDevolución", objeto.IdDevolución == 0 ? DBNull.Value : objeto.IdDevolución);
                    cmd.Parameters.AddWithValue("FechaDevolución", objeto.FechaDevolución.HasValue ? (object)objeto.FechaDevolución.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("Motivo", objeto.Motivo is null ? DBNull.Value : objeto.Motivo);
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
        [Route("EliminarDatos/{IdDevolución:int}")]

        public IActionResult EliminarDatos(int IdDevolución)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_eliminar_devolucion", connection);
                    cmd.Parameters.AddWithValue("IdDevolución", IdDevolución);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();

                }

                return StatusCode(StatusCodes.Status200OK, new { message = "Dato eliminado." });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
            }
        }
    }
}



