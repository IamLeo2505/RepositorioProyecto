using D_AlturaSystemAPI.Modelos;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Cors;

namespace D_AlturaSystemAPI.Controllers
{
    [EnableCors("ReglasCors")]
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : Controller
    {

        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;

        public ClienteController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }

        [HttpGet]
        [Route("Listado de Clientes")]
        public IActionResult Listado()
        {
            List<Cliente> listado = new List<Cliente>();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_clientes", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Cliente()
                            {
                                idcliente = Convert.ToInt32(rd["idcliente"]),
                                nombre = rd["nombre"].ToString(),
                                dni = rd["dni"].ToString(),
                                ruc = rd["ruc"].ToString(),
                                telefono = rd["telefono"].ToString(),
                                apellidos = rd["apellidos"].ToString(),
                                activo = Convert.ToInt32(rd["activo"]),

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
        [Route("Obtener/{idcliente:int}")]

        public IActionResult Obtener(int idcliente)
        {
            List<Cliente> listado = new List<Cliente>();
            Cliente cliente = new Cliente();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_clientes", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Cliente()
                            {
                                idcliente = Convert.ToInt32(rd["idcliente"]),
                                apellidos = rd["apellidos"].ToString(),
                                dni = rd["dni"].ToString(),
                                ruc = rd["ruc"].ToString(),
                                telefono = rd["telefono"].ToString(),
                                nombre = rd["nombre"].ToString(),
                                activo = Convert.ToInt32(rd["estado"].ToString())

                            });
                        }
                    }

                }
                cliente = listado.Where(item => item.idcliente == idcliente).FirstOrDefault();
                return StatusCode(StatusCodes.Status200OK, new { message = "Correcto.", response = cliente });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = cliente });
            }
        }

        [HttpPost]
        [Route("GuardarCambios")]

        public IActionResult Guardar([FromBody] Cliente objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_guardar_cliente", connection);
                    cmd.Parameters.AddWithValue("nombre", objeto.nombre);
                    cmd.Parameters.AddWithValue("apellidos", objeto.apellidos);
                    cmd.Parameters.AddWithValue("dni", objeto.dni);
                    cmd.Parameters.AddWithValue("ruc", objeto.ruc);
                    cmd.Parameters.AddWithValue("telefono", objeto.telefono);
                    cmd.Parameters.AddWithValue("activo", objeto.activo);
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

        public IActionResult EditarDatos([FromBody] Cliente objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_editar_cliente", connection);
                    cmd.Parameters.AddWithValue("idcliente", objeto.idcliente == 0 ? DBNull.Value : objeto.idcliente);
                    cmd.Parameters.AddWithValue("nombre", objeto.nombre is null ? DBNull.Value : objeto.nombre);
                    cmd.Parameters.AddWithValue("apellidos", objeto.apellidos is null ? DBNull.Value : objeto.apellidos);
                    cmd.Parameters.AddWithValue("dni", objeto.dni is null ? DBNull.Value : objeto.dni);
                    cmd.Parameters.AddWithValue("ruc", objeto.ruc is null ? DBNull.Value : objeto.ruc);
                    cmd.Parameters.AddWithValue("telefono", objeto.telefono is null ? DBNull.Value : objeto.telefono);
                    cmd.Parameters.AddWithValue("activo", objeto.activo == 0 ? DBNull.Value : objeto.activo);
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
        [Route("EliminarDatos/{idcliente:int}")]

        public IActionResult EliminarDatos(int idcliente)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_eliminar_cliente", connection);
                    cmd.Parameters.AddWithValue("idcliente", idcliente);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();

                }

                return StatusCode(StatusCodes.Status200OK, new { message = "Cliente marcado como inactivo." });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
            }
        }
    }
}
