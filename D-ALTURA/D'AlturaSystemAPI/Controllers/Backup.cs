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

    public class Backup : Controller
    {

        private readonly string ConnectSQL, ConnectSQLTwo, ConnectSQLThree;

        public Backup(IConfiguration configuration)
        {
            ConnectSQL = configuration.GetConnectionString("ConnectSQL");
            ConnectSQLTwo = configuration.GetConnectionString("ConnectSQLTwo");
            ConnectSQLThree = configuration.GetConnectionString("ConnectSQLThree");
        }

        [HttpGet]
        [Route("CrearBackup")]
        public async Task<IActionResult> CrearBackup()
        {
            try
            {
                // Ruta para almacenar el backup temporalmente
                var rutaBackup = Path.Combine(Directory.GetCurrentDirectory(), "Respaldos", $"backup_{DateTime.Now:yyyyMMddHHmmss}.bak");

                // Comando SQL para crear el backup
                var sqlComando = $@"
            BACKUP DATABASE [SystemAlturaCoffee] 
            TO DISK = '{rutaBackup}' 
            WITH FORMAT, INIT, NAME = 'Backup-{DateTime.Now:yyyyMMddHHmmss}'";

                using (var conexion = new SqlConnection("ConnectSQL"))
                {
                    using (var comando = new SqlCommand(sqlComando, conexion))
                    {
                        conexion.Open();
                        await comando.ExecuteNonQueryAsync();
                    }
                }

                // Leer el archivo para enviarlo como respuesta
                var archivoBytes = System.IO.File.ReadAllBytes(rutaBackup);
                var nombreArchivo = Path.GetFileName(rutaBackup);
                return File(archivoBytes, "application/octet-stream", nombreArchivo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear el respaldo.", error = ex.Message });
            }
        }

        [HttpPost("restaurar-backup")]
        public async Task<IActionResult> RestaurarBackup(IFormFile backup)
        {
            try
            {
                if (backup == null || backup.Length == 0)
                {
                    return BadRequest(new { message = "No se recibió un archivo válido." });
                }

                // Guardar el archivo recibido temporalmente
                var rutaTemporal = Path.Combine(Directory.GetCurrentDirectory(), "Respaldos", backup.FileName);
                using (var stream = new FileStream(rutaTemporal, FileMode.Create))
                {
                    await backup.CopyToAsync(stream);
                }

                // Comando SQL para restaurar la base de datos
                var sqlComando = $@"
            RESTORE DATABASE [SystemAlturaCoffee]
            FROM DISK = '{rutaTemporal}'
            WITH REPLACE";

                using (var conexion = new SqlConnection("ConnectSQL"))
                {
                    using (var comando = new SqlCommand(sqlComando, conexion))
                    {
                        conexion.Open();
                        await comando.ExecuteNonQueryAsync();
                    }
                }

                return Ok(new { message = "La base de datos ha sido restaurada exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al restaurar el respaldo.", error = ex.Message });
            }
        }

    }
}