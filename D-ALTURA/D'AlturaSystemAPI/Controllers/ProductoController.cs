﻿using Microsoft.AspNetCore.Http;
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
    public class ProductoController : Controller
    {
        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;

        public ProductoController(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }


        [HttpGet]
        [Route("Listado")]
        public IActionResult Lista()
        {
            List<Producto> listado = new List<Producto>();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_productos", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Producto()
                            {
                                idproducto = Convert.ToInt32(rd["idproducto"]),
                                codigo = rd["codigo"].ToString(),
                                nombreproducto = rd["nombreproducto"].ToString(),
                                descripcion = rd["descripcion"].ToString(),
                                f_ingreso = Convert.ToDateTime(rd["f_ingreso"]),
                                f_vencimiento = Convert.ToDateTime(rd["f_vencimiento"]),
                                stock = Convert.ToInt32(rd["stock"]),
                                precio_compra = Convert.ToDecimal(rd["precio_compra"]),
                                precio_venta = Convert.ToDecimal(rd["precio_venta"]),
                                estado = rd["estado"].ToString(),
                                idcategoria = Convert.ToInt32(rd["idcategoria"])

                            });
                        }
                    }

                }
                {

                }
                return StatusCode(StatusCodes.Status200OK, new { message = "Listado de Productos.", response = listado });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = listado });
            }
        }

        [HttpGet]
        [Route("Obtener/{idproducto:int}")]

        public IActionResult Obtener(int idproducto)
        {
            List<Producto> listado = new List<Producto>();
            Producto producto = new Producto();

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_lista_productos", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            listado.Add(new Producto()
                            {
                                idproducto = Convert.ToInt32(rd["idproducto"]),
                                codigo = rd["codigo"].ToString(),
                                nombreproducto = rd["nombreproducto"].ToString(),
                                descripcion = rd["descripcion"].ToString(),
                                f_ingreso = Convert.ToDateTime(rd["f_ingreso"]),
                                f_vencimiento = Convert.ToDateTime(rd["f_vencimiento"]),
                                stock = Convert.ToInt32(rd["stock"]),
                                precio_compra = Convert.ToDecimal(rd["precio_compra"]),
                                precio_venta = Convert.ToDecimal(rd["precio_venta"]),
                                estado = rd["estado"].ToString(),
                                idcategoria = Convert.ToInt32(rd["idcategoria"])

                            });
                        }
                    }

                }
                producto = listado.Where(item => item.idproducto == idproducto).FirstOrDefault();
                return StatusCode(StatusCodes.Status200OK, new { message = "Los datos del producto son: ", response = producto });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = producto });
            } 
        }

        [HttpGet]
        [Route("BuscarProducto/{idproducto:int}")]

        public IActionResult BuscarProductoParaVenta(int idproducto)
        {
            Producto producto = null;  // Producto será nulo hasta que se asigne un valor encontrado en la base de datos

            try
            {
                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_BuscarProductoCodigo", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Agregar parámetro para buscar al producto específico
                    cmd.Parameters.AddWithValue("@idproducto", idproducto);

                    using (var rd = cmd.ExecuteReader())
                    {
                        // Leer los resultados, esperando un único registro
                        if (rd.Read())
                        {
                            producto = new Producto()
                            {
                                idproducto = Convert.ToInt32(rd["idproducto"]),
                                nombreproducto = rd["nombreproducto"].ToString(),
                                stock = Convert.ToInt32(rd["stock"].ToString()),
                                precio_venta = Convert.ToDecimal(rd["precio_venta"].ToString()),
                                idcategoria = Convert.ToInt32(rd["idcategoria"])
                            };
                        }
                    }
                }

                if (producto != null)
                {
                    return StatusCode(StatusCodes.Status200OK, new { message = "Se ha encontrado el producto.", response = producto });
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { message = "Producto no encontrado.", response =  producto });
                }
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message, response = producto });
            }
        }


        [HttpPost]
        [Route("Guardar")]

        public IActionResult Guardar([FromBody] Producto objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_guardar_productos", connection);
                    cmd.Parameters.AddWithValue("codigo", objeto.codigo);
                    cmd.Parameters.AddWithValue("nombreproducto", objeto.nombreproducto);
                    cmd.Parameters.AddWithValue("descripcion", objeto.descripcion);
                    cmd.Parameters.AddWithValue("precio_compra", objeto.precio_compra);
                    cmd.Parameters.AddWithValue("precio_venta", objeto.precio_venta);
                    cmd.Parameters.AddWithValue("f_ingreso", objeto.f_ingreso);
                    cmd.Parameters.AddWithValue("f_vencimiento", objeto.f_vencimiento);
                    cmd.Parameters.AddWithValue("stock", objeto.stock);
                    cmd.Parameters.AddWithValue("estado", objeto.estado);
                    cmd.Parameters.AddWithValue("idcategoria", objeto.idcategoria);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();

                }

                return StatusCode(StatusCodes.Status200OK, new { message = "El producto ha sido guardado con éxito." });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new {message = error.Message});
            }
        }

        [HttpPut]
        [Route("Editar")]

        public IActionResult EditarDatos([FromBody] Producto objeto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_editar_producto", connection);
                    cmd.Parameters.AddWithValue("idproducto", objeto.idproducto == 0 ? DBNull.Value : objeto.idproducto);
                    cmd.Parameters.AddWithValue("codigo", objeto.codigo is null ? DBNull.Value : objeto.codigo);
                    cmd.Parameters.AddWithValue("nombre", objeto.nombreproducto is null ? DBNull.Value : objeto.nombreproducto);
                    cmd.Parameters.AddWithValue("descripcion", objeto.descripcion is null ? DBNull.Value : objeto.descripcion);
                    cmd.Parameters.AddWithValue("f_ingreso", objeto.f_ingreso == DateTime.MinValue ? DateTime.Now : objeto.f_ingreso);
                    cmd.Parameters.AddWithValue("f_vencimiento", objeto.f_vencimiento == DateTime.MinValue ? DateTime.Now : objeto.f_vencimiento);
                    cmd.Parameters.AddWithValue("precio_compra", objeto.precio_compra == 0 ? DBNull.Value : objeto.precio_compra);
                    cmd.Parameters.AddWithValue("precio_venta", objeto.precio_venta == 0 ? DBNull.Value : objeto.precio_venta);
                    cmd.Parameters.AddWithValue("stock", objeto.stock == 0 ? DBNull.Value : objeto.stock);
                    cmd.Parameters.AddWithValue("estado", objeto.estado is null ? DBNull.Value : objeto.estado);
                    cmd.Parameters.AddWithValue("idcategoria", objeto.idcategoria == 0 ? DBNull.Value : objeto.idcategoria);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();

                }

                return StatusCode(StatusCodes.Status200OK, new { message = "Los datos del producto han sido editados con éxito." });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
            }
        }

        [HttpDelete]
        [Route("Eliminar/{idproducto:int}")]

        public IActionResult EliminarDatos(int idproducto)
        {

            try
            {

                using (var connection = new SqlConnection(ConnectSQL))
                {
                    connection.Open();
                    var cmd = new SqlCommand("pA_eliminar_productos", connection);
                    cmd.Parameters.AddWithValue("idproducto", idproducto);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();

                }

                return StatusCode(StatusCodes.Status200OK, new { message = "El producto ha sido eliminado." });

            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = error.Message });
            }
        }
    }
}
