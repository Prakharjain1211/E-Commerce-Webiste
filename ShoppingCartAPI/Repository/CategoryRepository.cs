using Microsoft.EntityFrameworkCore;
using ShoppingCartAPI.Data;
using ShoppingCartAPI.Models;

namespace ShoppingCartAPI.Repository
{
    public class ProductCategoryRepository : IProductCategoryRepository
    {
        private readonly ApplicationDbContext _context;

        // Constructor to inject the ApplicationDbContext
        public ProductCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Retrieves all product categories from the database
        public async Task<IEnumerable<ProductCategory>> GetAllAsync()
        {
            return await _context.ProductCategories.ToListAsync();  // Fetch all product categories and convert to a list
        }

        // Retrieves a product category by its ID
        public async Task<ProductCategory> GetByIdAsync(int id)
        {
            return await _context.ProductCategories.FindAsync(id);  // Find and return the product category by ID
        }

        // Adds a new product category to the database
        public async Task AddAsync(ProductCategory productCategory)
        {
            _context.ProductCategories.Add(productCategory);  // Add the new product category to the context
            await _context.SaveChangesAsync();  // Save the changes to the database
        }

        // Updates an existing product category
        public async Task<ProductCategory?> UpdateAsync(ProductCategory productCategory)
        {
            // Fetch the existing category by its ID
            var existingCategory = await _context.ProductCategories.FirstOrDefaultAsync(x => x.Id == productCategory.Id);
            if(existingCategory != null)
            {
                // Update the existing category with the new values
                _context.Entry(existingCategory).CurrentValues.SetValues(productCategory);
                await _context.SaveChangesAsync();  // Save the changes to the database
                return productCategory;  // Return the updated product category
            }
            return null;  // Return null if the category was not found
        }

        // Deletes a product category by its ID
        public async Task DeleteAsync(int id)
        {
            var productCategory = await _context.ProductCategories.FindAsync(id);  // Find the category by ID
            if (productCategory != null)
            {
                _context.ProductCategories.Remove(productCategory);  // Remove the category from the context
                await _context.SaveChangesAsync();  // Save the changes to the database
            }
        }
    }
}

