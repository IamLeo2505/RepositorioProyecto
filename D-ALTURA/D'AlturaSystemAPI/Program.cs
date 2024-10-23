using D_AlturaSystemAPI.Servicio;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);
var MisReglasCors = "ReglasCors";



// Configuración de CORS: Permitir solicitudes solo desde http://localhost:5083
builder.Services.AddCors(option => option.AddPolicy(name: MisReglasCors,
    builder =>
    {
    builder.WithOrigins("http://localhost:5083")  // Permite solo solicitudes desde el frontend en el puerto 5083
           .AllowAnyMethod()
           .AllowAnyHeader();
    }
));


builder.Services.AddControllers()
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.WriteIndented = true;

});


// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<ServiciosBD>();

var app = builder.Build();


// Configure the HTTP request pipeline.
// Nota: Swagger se mueve al final para que no sobrescriba la página predeterminada
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors(MisReglasCors); // CORS debe estar antes de MapControllers
app.MapControllers();

// Swagger y Swagger UI solo si es necesario y en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = "swagger"; // Swagger estará disponible en /swagger
    });
}

app.Run();
