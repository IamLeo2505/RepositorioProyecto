
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddCors(option =>
option.AddPolicy("ReglasCors", 
    builder =>
    {
        builder.WithOrigins("http://localhost:5083")  // Permite solo solicitudes desde el frontend en el puerto 5083
               .AllowAnyMethod()
               .AllowAnyHeader();
    }
));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseCors("ReglasCors");

app.MapRazorPages();
app.UseStaticFiles();
app.UseAuthorization();
app.UseRouting();

app.MapControllers();

app.Run();
