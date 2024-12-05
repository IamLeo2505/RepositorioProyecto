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
    public class CategoríaController : Controller
    {
        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;

        public CategoríaController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }


        [HttpGet]
        [Route("ListadodeCategorías")]
        public IActionResult Listado()
        {
            List<Categoría> listado = new List<Categoría>();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_categoria", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Categoría()
                            {
                                idcategoria = Convert.ToInt32(rd["idcategoria"]),
                                descripcion = rd["descripcion"].ToString(),
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
        [Route("Obtener/{idcategoria:int}")]

        public IActionResult Obtener(int idcategoria)
        {
            List<Categoría> listado = new List<Categoría>();
            Categoría categoría = new Categoría();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_categoria", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Categoría()
                            {
                                idcategoria = Convert.ToInt32(rd["idcategoria"]),
                                descripcion = rd["descripcion"].ToString()
                            });
                        }
                    }

                }
                categoría = listado.Where(item => item.idcategoria == idcategoria).FirstOrDefault();
                return StatusCode(StatusCodes.Status200OK, new { message = "Correcto.", response = categoría });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = categoría });
            }
        }

        [HttpGet]
        [Route("BuscarCategoria/{idcategoria:int}")]

        public IActionResult BuscarCategoria(int idcategoria)
        {
            Categoría categoría = null;  // Categoria será nulo hasta que se asigne un valor encontrado en la base de datos

            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_BuscarCategoriaID", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Agregar parámetro para buscar ala Categoria específico
                    cmd.Parameters.AddWithValue("@idcategoria", idcategoria);

                    using (var rd = cmd.ExecuteReader())
                    {
                        // Leer los resultados, esperando un único registro
                        if (rd.Read())
                        {
                            categoría = new Categoría()
                            {
                                idcategoria = Convert.ToInt32(rd["idcategoria"]),
                                descripcion = rd["descripcion"].ToString()
                            };
                        }
                    }
                }

                if (categoría != null)
                {
                    return StatusCode(StatusCodes.Status200OK, new { message = "Se ha encontrado el categoria.", response = categoría });
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { message = "Categoria no encontrado.", response = categoría });
                }
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = categoría });
            }
        }

        [HttpPost]
        [Route("GuardarCambios")]

        public IActionResult Guardar([FromBody] Categoría objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_guardar_categoria", connection);
                    cmd.Parameters.AddWithValue("descripcion", objeto.descripcion);
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

        public IActionResult EditarDatos([FromBody] Categoría objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_editar_categoria", connection);
                    cmd.Parameters.AddWithValue("idcategoria", objeto.idcategoria == 0 ? DBNull.Value : objeto.idcategoria);
                    cmd.Parameters.AddWithValue("descripcion", objeto.descripcion is null ? DBNull.Value : objeto.descripcion);
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
        [Route("EliminarDatos/{idcategoria:int}")]

        public IActionResult EliminarDatos(int idcategoria)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_eliminar_categoria", connection);
                    cmd.Parameters.AddWithValue("idcategoria", idcategoria);
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
