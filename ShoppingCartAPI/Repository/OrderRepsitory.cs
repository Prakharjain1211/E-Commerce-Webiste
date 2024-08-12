using Microsoft.EntityFrameworkCore;
using ShoppingCartAPI.Data;
using ShoppingCartAPI.Models;

namespace ShoppingCartAPI.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        // Constructor to inject the ApplicationDbContext
        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Retrieves all orders including their items and associated products
        public async Task<IEnumerable<Order>> GetAllOrders()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)          // Include the order items associated with each order
                .ThenInclude(oi => oi.Product)       // Include the product details for each order item
                .ToListAsync();                      // Convert the result to a list asynchronously
        }

        // Retrieves a specific order by its ID, including its items and associated products
        public async Task<Order> GetOrderById(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)          // Include the order items associated with the order
                .ThenInclude(oi => oi.Product)       // Include the product details for each order item
                .FirstOrDefaultAsync(o => o.Id == id);  // Find the order with the specified ID
        }

        // Adds a new order to the database
        public async Task AddOrder(Order order)
        {
            await _context.Orders.AddAsync(order);  // Add the new order to the context
            await _context.SaveChangesAsync();      // Save the changes to the database
        }

        // Retrieves orders for a specific user by their UserId, including their items and associated products
        public async Task<IEnumerable<Order>> GetOrdersByUserId(string userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)          // Include the order items associated with each order
                .ThenInclude(oi => oi.Product)       // Include the product details for each order item
                .Where(o => o.UserId == userId)      // Filter orders by the user's ID
                .ToListAsync();                      // Convert the result to a list asynchronously
        }
    }
}
