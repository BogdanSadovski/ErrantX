using errontXServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace errontXServer.DataAcsess;

public class UsersDBContext : DbContext
{
     
     private readonly IConfiguration _configuration;
     
     public UsersDBContext(IConfiguration configuration)
     {
          _configuration = configuration;
     }

     public DbSet<UserModel> Users => Set<UserModel>() ;
     public DbSet<AssetModel> Asset => Set<AssetModel>() ;
     
     protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
     {
          optionsBuilder.UseNpgsql(_configuration.GetConnectionString("Database"));
     }
}