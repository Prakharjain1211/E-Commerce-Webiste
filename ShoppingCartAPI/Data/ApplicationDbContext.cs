using ShoppingCartAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore; 

namespace ShoppingCartAPI.Data
{
    //* ApplicationDbContext inherits from IdentityDbContext, which provides identity-related features
    //* and is used to manage the application's database context.
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        //* Represents the Products table
        public DbSet<Product> Products { get; set; }

        //* Represents the ProductCategories table
        public DbSet<ProductCategory> ProductCategories { get; set; }



        //* Represents the Carts table
        public DbSet<Cart> Carts { get; set; }

        //* Represents the CartItems table
        public DbSet<CartItem> CartItems { get; set; }

        //* Represents the Orders table
        public DbSet<Order> Orders { get; set; }

        //* Represents the OrderItems table
        public DbSet<OrderItem> OrderItems { get; set; }

        //* Method to configure the model's relationships, constraints, and data types
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //* Configure precision and scale for the TotalAmount property of the Order entity
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2); 

            //* Configure precision and scale for the UnitPrice property of the OrderItem entity
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice)
                .HasPrecision(18, 2); 
                
            //* Configure precision and scale for the Price property of the Product entity
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2); 

            //* Call the base class's OnModelCreating method to apply any configuration provided by the base class
            base.OnModelCreating(modelBuilder);
        }
    }
}

