using Microsoft.EntityFrameworkCore;
using ShoppingCartAPI.Data;
using ShoppingCartAPI.Models;

namespace ShoppingCartAPI.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        // Constructor to inject the ApplicationDbContext
        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Adds a new product to the database and returns the added product
        public async Task<Product> AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);  // Add the new product to the context
            await _context.SaveChangesAsync();          // Save changes to the database
            return product;                            // Return the added product
        }

        // Retrieves all products from the database including their categories
        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products
                .Include(x => x.Categories)             // Include the product categories
                .ToListAsync();                         // Convert the result to a list asynchronously
        }

        // Retrieves a specific product by its ID, including its categories
        public async Task<Product> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(x => x.Categories)             // Include the product categories
                .FirstOrDefaultAsync(x => x.Id == id);  // Find the product with the specified ID
        }

        // Retrieves products that belong to a specific category
        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            var categoryLower = category.ToLower();   // Convert the category name to lowercase for case-insensitive comparison

            return await _context.Products
                .Where(p => p.Categories.Any(c => c.Name.ToLower() == categoryLower)) // Filter products by category name
                .ToListAsync();                       // Convert the result to a list asynchronously
        }

        // Updates an existing product. Returns the updated product if successful, otherwise null
        public async Task<Product?> UpdateAsync(Product product)
        {
            // Retrieve the existing product with its categories
            var existingProduct = await _context.Products
                .Include(x => x.Categories)
                .FirstOrDefaultAsync(x => x.Id == product.Id);

            if (existingProduct == null)
            {
                return null;  // Return null if the product does not exist
            }

            // Update the existing product with new values
            _context.Entry(existingProduct).CurrentValues.SetValues(product);
            existingProduct.Categories = product.Categories;  // Update categories

            await _context.SaveChangesAsync();  // Save changes to the database
            return product;                    // Return the updated product
        }

        // Deletes a product by its ID and returns the deleted product if successful, otherwise null
        public async Task<Product> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);  // Find the product by its ID
            if (product != null)
            {
                _context.Products.Remove(product);  // Remove the product from the context
                await _context.SaveChangesAsync();  // Save changes to the database
                return product;                    // Return the deleted product
            }
            return null;  // Return null if the product was not found
        }
    }
}
