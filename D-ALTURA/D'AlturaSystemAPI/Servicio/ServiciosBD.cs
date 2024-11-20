using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;

namespace D_AlturaSystemAPI.Servicio
{
    public class ServiciosBD(IConfiguration configuration)
    {
        private readonly IConfiguration confi = configuration;

        public DataTable ObtenerDatosProveedor()
        {
            DataTable dt = new();

            string query = "SELECT * FROM vProveedor";

            string conexion = confi.GetConnectionString("ConnectSQL");

            using (SqlConnection conn = new(conexion))
            {
                using SqlCommand cmd = new (query, conn);
                conn.Open();

                using SqlDataAdapter Da = new(cmd);
                Da.Fill(dt);
            }

            return dt;
        }

        public DataTable ObtenerProveedorPorId(int idproveedor)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vProveedor
            WHERE 
                idproveedor = @idproveedor";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@idproveedor", idproveedor);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerDatosDeVenta()
        {
            DataTable datos = new();

            string query = "SELECT * FROM vVentas";

            string conexion = confi.GetConnectionString("ConnectSQL");

            using (SqlConnection conn = new(conexion))
            {
                using SqlCommand cmd = new(query, conn);
                conn.Open();

                using SqlDataAdapter Data = new(cmd);
                Data.Fill(datos);
            }

            return datos;
        }

        public DataTable ObtenerDatosDeCompra()
        {
            DataTable datos = new();

            string query = "SELECT * FROM vCompras";

            string conexion = confi.GetConnectionString("ConnectSQL");

            using (SqlConnection conn = new(conexion))
            {
                using SqlCommand cmd = new(query, conn);
                conn.Open();

                using SqlDataAdapter Data = new(cmd);
                Data.Fill(datos);
            }

            return datos;
        }
        public DataTable ObtenerCompraPorId(int idcompra)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vCompras
            WHERE 
                idcompra = @idcompra";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@idcompra", idcompra);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerDatosdeProductos()
        {
            DataTable dat = new();

            string query = "select * from vProductos";

            string connect = confi.GetConnectionString("ConnectSQL");

            using (SqlConnection conn = new(connect))
            {
                using SqlCommand cmd = new(new(query), conn);
                conn.Open() ;

                using SqlDataAdapter dato = new(cmd);
                dato.Fill(dat);
            }
            return dat;
        }

        public DataTable ObtenerProductoPorId(int idproducto)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vProductos
            WHERE 
                idproducto = @idproducto";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@idproducto", idproducto);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerProductoPorFechaVencimiento(DateTime f_vencimiento)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT * 
            FROM vProductos
            WHERE f_vencimiento <= @f_vencimiento";
            

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@f_vencimiento", f_vencimiento);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }
        public DataTable DatosdeEmpleados()
        {
            DataTable datos = new();

            string query = "select * from vEmpleados";

            string connect = confi.GetConnectionString("ConnectSQL");

            using (SqlConnection conn = new(connect))
            {
                using SqlCommand cmd = new(new(query), conn);
                conn.Open();

                using SqlDataAdapter dato = new(cmd);
                dato.Fill(datos);
            }
            return datos;
        }

        public DataTable ObtenerEmpleadoPorId(int idempleado)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vEmpleados
            WHERE 
                idempleado = @idempleado";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@idempleado", idempleado);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerEmpleadoPorNombre(string nombre)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vEmpleados
            WHERE 
                nombre = @nombre";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@nombre", nombre);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerEmpleadoPorEstado(string estado)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vEmpleados
            WHERE 
                estado = @estado";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@estado", estado);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerDatosdeUsuarios()
        {
            DataTable datos = new();

            string query = "select * from vUsuarios";

            string connect = confi.GetConnectionString("ConnectSQL");

            using (SqlConnection conn = new(connect))
            {
                using SqlCommand cmd = new(new(query), conn);
                conn.Open();

                using SqlDataAdapter dato = new(cmd);
                dato.Fill(datos);
            }
            return datos;
        }

        public DataTable ObtenerUsuarioporId(int idusuario)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vUsuarios
            WHERE 
                idusuario = @idusuario";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@idusuario", idusuario);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerUsuarioporNombreEmpleado(string nombre)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vUsuarios
            WHERE 
                nombre = @nombre";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@nombre", nombre);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerDatosdeMarca()
        {
            DataTable datos = new();

            string query = "select * from vMarca";

            string connect = confi.GetConnectionString("ConnectSQL");

            using (SqlConnection conn = new(connect))
            {
                using SqlCommand cmd = new(new(query), conn);
                conn.Open();

                using SqlDataAdapter dato = new(cmd);
                dato.Fill(datos);
            }
            return datos;
        }

        public DataTable ObtenerMarcaPorID(int idmarca)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vMarca
            WHERE 
                idmarca = @idmarca";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@idmarca", idmarca);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerMarcaPorNombre(string nombremarca)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vMarca
            WHERE 
                nombremarca = @nombremarca";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@nombremarca", nombremarca);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerDatosdeCliente()
        {
            DataTable datos = new();

            string query = "select * from vCliente";

            string connect = confi.GetConnectionString("ConnectSQL");

            using (SqlConnection conn = new(connect))
            {
                using SqlCommand cmd = new(new(query), conn);
                conn.Open();

                using SqlDataAdapter dato = new(cmd);
                dato.Fill(datos);
            }
            return datos;
        }


        public DataTable ObtenerClientePorId(int idcliente)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vCliente
            WHERE 
                idcliente = @idcliente";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@idcliente", idcliente);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerClientePorNombre(string nombre)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vCliente
            WHERE 
                nombre = @nombre";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@nombre", nombre);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerDatosdeCrédito()
        {
            DataTable datos = new();

            string query = "select * from vCrédito";

            string connect = confi.GetConnectionString("ConnectSQL");

            using (SqlConnection conn = new(connect))
            {
                using SqlCommand cmd = new(new(query), conn);
                conn.Open();

                using SqlDataAdapter dato = new(cmd);
                dato.Fill(datos);
            }
            return datos;
        }

        public DataTable ObtenerCréditoPorID(int IdCrédito)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vCrédito
            WHERE 
                IdCrédito = @IdCrédito";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@IdCrédito", IdCrédito);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerDatosdeCategoria()
        {
            DataTable datos = new();

            string query = "SELECT * FROM vCategoria";

            string connect = confi.GetConnectionString("ConnectSQL");

            using (SqlConnection conn = new(connect))
            {
                using SqlCommand cmd = new(new(query), conn);
                conn.Open();

                using SqlDataAdapter dato = new(cmd);
                dato.Fill(datos);
            }
            return datos;
        }

        public DataTable ObtenerCategoriaporId(int idcategoria)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vCategoria
            WHERE 
                idcategoria = @idcategoria";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@idcategoria", idcategoria);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }

        public DataTable ObtenerVentaPorId(int idventa)
        {
            DataTable table = new DataTable();

            // Definir la consulta SQL para obtener una única factura por ID
            string query = @"
            SELECT  
                *
            FROM 
                vVentas
            WHERE 
                idventa = @idventa";

            // Obtener la cadena de conexión desde appsettings.json
            string connectionString = configuration.GetConnectionString("ConnectSQL");

            // Conectar a la base de datos y ejecutar la consulta
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Agregar parámetro
                    command.Parameters.AddWithValue("@idventa", idventa);

                    connection.Open();

                    // Llenar el DataTable con los datos de la factura
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(table);
                    }
                }
            }

            return table;
        }
    }
}