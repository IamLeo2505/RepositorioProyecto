using System.Data.SqlClient;
using System.Data;

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
    }
}