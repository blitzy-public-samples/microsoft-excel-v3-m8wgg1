using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WorkbookService;
using AuthService;
using CalculationService;
using VisualizationService;
using DataManagementService;

namespace Microsoft.Excel.Web.Server
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Add controllers and API explorer services
            services.AddControllers();
            services.AddEndpointsApiExplorer();

            // Configure JWT authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration["Jwt:Issuer"],
                        ValidAudience = Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                    };
                });

            // Add CORS policies
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("http://localhost:3000")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod());
            });

            // Configure Swagger/OpenAPI
            services.AddSwaggerGen();

            // Register application services
            services.AddScoped<IWorkbookService, WorkbookService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICalculationService, CalculationService>();
            services.AddScoped<IVisualizationService, VisualizationService>();
            services.AddScoped<IDataManagementService, DataManagementService>();

            // Add database context
            // TODO: Add your database context configuration here

            // Configure caching
            services.AddMemoryCache();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Configure error handling and development environment
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            // Enable HTTPS redirection
            app.UseHttpsRedirection();

            // Configure routing
            app.UseRouting();

            // Enable CORS
            app.UseCors("AllowSpecificOrigin");

            // Enable authentication and authorization
            app.UseAuthentication();
            app.UseAuthorization();

            // Configure Swagger UI
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Microsoft Excel API V1"));

            // Map controllers
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}