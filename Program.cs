using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.HttpOverrides;
using System.Data;
using System.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container. Use AddControllers for API.
builder.Services.AddControllers(); // For API controllers

// Register DapperContext as a singleton so it's available throughout the app
builder.Services.AddSingleton<DapperContext>();

// Configure the connection string in DapperContext
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

// Register logging service (you can customize as per your needs)
builder.Services.AddLogging(config =>
{
    config.AddConsole();
    config.AddDebug();
});

// Register the repositories
builder.Services.AddScoped<KipreLoginRepository>();
builder.Services.AddScoped<KipreHomeRepository>();

// Register IDbConnection (SqlConnection) as a scoped service
builder.Services.AddScoped<IDbConnection>(provider =>
    new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Add CORS policy (to allow the React app to connect)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder
            .AllowAnyOrigin() // Can change to a specific origin if you want more restrictive access
            .AllowAnyMethod()  // Allow any HTTP method (GET, POST, etc.)
            .AllowAnyHeader(); // Allow any header (you can restrict if needed)
    });
});

// Configure the HTTP request pipeline.
var app = builder.Build();

// Use forward headers if behind a reverse proxy (like in Azure or Docker)
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// Enable CORS to allow connections from the React app
app.UseCors("AllowReactApp");

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// Use routing for API controllers (no need for static files or views)
app.UseRouting();

// Add the controllers to the request pipeline
app.MapControllers();

// Run the application
app.Run();
