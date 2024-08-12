using Microsoft.EntityFrameworkCore;
using ShoppingCartAPI.Data;
using ShoppingCartAPI.Models;

namespace ShoppingCartAPI.Repository
{
    public class CartRepository : ICartRepository
    {
        private readonly ApplicationDbContext _context;

        // Constructor to inject the ApplicationDbContext
        public CartRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Retrieves a cart for a specific user by their UserId
        public async Task<Cart> GetCartByUserId(string userId)
        {
            return await _context.Carts
                .Include(c => c.CartItems)          
                .ThenInclude(ci => ci.Product)        
                .FirstOrDefaultAsync(c => c.UserId == userId); 
        }

        // Adds an item to the cart or updates the quantity if the item already exists
        public async Task AddCartItem(int cartId, CartItem cartItem)
        {
            var cart = await _context.Carts.FindAsync(cartId);  // Retrieve the cart by its ID
            if (cart != null)
            {
                var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == cartItem.ProductId);
                if (existingItem != null)
                {
                    // Update the quantity if the item already exists in the cart
                    existingItem.Quantity += cartItem.Quantity;
                }
                else
                {
                    // Add the new item to the cart
                    cart.CartItems.Add(cartItem);
                }
                await _context.SaveChangesAsync();  
            }
        }

        // Updates an existing cart item
        public async Task UpdateCartItem(CartItem cartItem)
        {
            _context.CartItems.Update(cartItem);  // Mark the cart item as modified
            await _context.SaveChangesAsync();  
        }

        // Removes an item from the cart by its product ID
        public async Task RemoveCartItem(int cartId, int productId)
        {
            var cart = await _context.Carts.FindAsync(cartId);  // Retrieve the cart by its ID
            if (cart != null)
            {
                var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
                if (cartItem != null)
                {
                    // Remove the item from the cart
                    cart.CartItems.Remove(cartItem);
                    await _context.SaveChangesAsync();  
                }
            }
        }

        // Creates a new cart and adds it to the database
        public async Task CreateCart(Cart cart)
        {
            await _context.Carts.AddAsync(cart);  // Add the new cart to the context
            await _context.SaveChangesAsync();  
        }

        // Clears all items from the cart for a specific user
        public async Task ClearCart(string userId)
        {
            var cart = await GetCartByUserId(userId);  // Retrieve the cart for the user
            if (cart != null)
            {
                _context.CartItems.RemoveRange(cart.CartItems);  // Remove all items from the cart
                await _context.SaveChangesAsync();  
            }
        }

        // Updates an existing cart
        public async Task UpdateCart(Cart cart)
        {
            _context.Carts.Update(cart);  // Mark the cart as modified
            await _context.SaveChangesAsync();  
        }
    }
}
