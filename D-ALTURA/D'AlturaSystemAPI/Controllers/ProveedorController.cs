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

    public class ProveedorController : Controller
    {

        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;

        public ProveedorController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }


        [HttpGet]
        [Route("Listado")]
        public IActionResult Listado()
        {
            List<Proveedor> listado = new List<Proveedor>();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_proveedor", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Proveedor()
                            {
                                idproveedor = Convert.ToInt32(rd["idproveedor"]),
                                razonsocial = rd["razonsocial"].ToString(),
                                dni = rd["dni"].ToString(),
                                ruc = rd["ruc"].ToString(),
                                telefono = rd["telefono"].ToString(),
                                direccion = rd["direccion"].ToString(),
                                estado = rd["estado"].ToString()

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
        [Route("Obtener/{idproveedor:int}")]

        public IActionResult Obtener(int idproveedor)
        {
            List<Proveedor> listado = new List<Proveedor>();
            Proveedor proveedor = new Proveedor();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_proveedor", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Proveedor()
                            {
                                idproveedor = Convert.ToInt32(rd["idproveedor"]),
                                razonsocial = rd["razonsocial"].ToString(),
                                dni = rd["dni"].ToString(),
                                ruc = rd["ruc"].ToString(),
                                telefono = rd["telefono"].ToString(),
                                direccion = rd["direccion"].ToString(),
                                estado = rd["estado"].ToString()

                            });
                        }
                    }

                }
                proveedor = listado.Where(item => item.idproveedor == idproveedor).FirstOrDefault();
                return StatusCode(StatusCodes.Status200OK, new { message = "Correcto.", response = proveedor });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = proveedor });
            }
        }

        [HttpPost]
        [Route("Guardar Cambios")]

        public IActionResult Guardar([FromBody] Proveedor objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_guardar_proveedor", connection);
                    cmd.Parameters.AddWithValue("razonsocial", objeto.razonsocial);
                    cmd.Parameters.AddWithValue("dni", objeto.dni);
                    cmd.Parameters.AddWithValue("ruc", objeto.ruc);
                    cmd.Parameters.AddWithValue("telefono", objeto.telefono);
                    cmd.Parameters.AddWithValue("direccion", objeto.direccion);
                    cmd.Parameters.AddWithValue("estado", objeto.estado);
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

        public IActionResult EditarDatos([FromBody] Proveedor objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_editar_proveedor", connection);
                    cmd.Parameters.AddWithValue("idproveedor", objeto.idproveedor == 0 ? DBNull.Value : objeto.idproveedor);
                    cmd.Parameters.AddWithValue("razonsocial", objeto.razonsocial is null ? DBNull.Value : objeto.razonsocial);
                    cmd.Parameters.AddWithValue("dni", objeto.dni is null ? DBNull.Value : objeto.dni);
                    cmd.Parameters.AddWithValue("ruc", objeto.ruc is null ? DBNull.Value : objeto.ruc);
                    cmd.Parameters.AddWithValue("telefono", objeto.telefono is null ? DBNull.Value : objeto.telefono);
                    cmd.Parameters.AddWithValue("direccion", objeto.direccion is null ? DBNull.Value : objeto.direccion);
                    cmd.Parameters.AddWithValue("estado", objeto.estado is null ? DBNull.Value : objeto.estado);
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
        [Route("EliminarDatos/{idproveedor:int}")]

        public IActionResult EliminarDatos(int idproveedor)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_eliminar_proveedor", connection);
                    cmd.Parameters.AddWithValue("idproveedor", idproveedor);
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

