using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingCartAPI.DTO;
using ShoppingCartAPI.Models;
using ShoppingCartAPI.Repository;
using System.Security.Claims;

namespace ShoppingAPI.Controllers
{
    [Authorize]
    [ApiController] 
    [Route("api/[controller]")] 
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;

        public CartController(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        // GET: api/cart/{userId}
        // Retrieves the cart for a specific user by userId
        [HttpGet("{userId}")]
        public async Task<ActionResult<CartDto>> GetCart(string userId)
        {
            var cart = await _cartRepository.GetCartByUserId(userId);
            if (cart == null)
            {
                return NotFound();
            }

            return Ok(cart);
        }

        // POST: api/cart/{userId}/items
        // Adds an item to the user's cart
        [HttpPost("{userId}/items")]
        public async Task<ActionResult> AddCartItem(string userId, [FromBody] AddCartItemDto cartItemDTO)
        {
            // Validates the incoming model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Retrieves the cart for the specified user
            var cart = await _cartRepository.GetCartByUserId(userId);
            if (cart == null)
            {
                // Creates a new cart if one does not exist
                var user = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (user == null)
                {
                    return NotFound();
                }

                cart = new Cart { UserId = userId, CartItems = new List<CartItem>() };
                await _cartRepository.CreateCart(cart);
            }

            // Checks if the item already exists in the cart
            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == cartItemDTO.ProductId);
            if (cartItem != null)
            {
                // Increases the quantity if the item is already in the cart
                cartItem.Quantity += cartItemDTO.Quantity;
            }
            else
            {
                // Adds the new item to the cart
                cart.CartItems.Add(new CartItem
                {
                    CartId = cart.Id,
                    ProductId = cartItemDTO.ProductId,
                    Quantity = cartItemDTO.Quantity
                });
            }

            // Updates the cart in the repository
            await _cartRepository.UpdateCart(cart);

            // Returns a 200 OK response
            return Ok();
        }

        // DELETE: api/cart/{userId}/items/{productId}
        // Removes an item from the user's cart
        [HttpDelete("{userId}/items/{productId}")]
        public async Task<ActionResult> RemoveCartItem(string userId, int productId)
        {
            // Retrieves the cart for the specified user
            var cart = await _cartRepository.GetCartByUserId(userId);
            if (cart == null)
            {
                // Returns a 404 Not Found response if the cart does not exist
                return NotFound();
            }

            // Removes the specified item from the cart
            await _cartRepository.RemoveCartItem(cart.Id, productId);

            // Returns a 204 No Content response indicating the item was successfully removed
            return NoContent();
        }

        // POST: api/cart/{userId}/items/{productId}/increment
        // Increments the quantity of an item in the user's cart
        [HttpPost("{userId}/items/{productId}/increment")]
        public async Task<ActionResult> IncrementCartItem(string userId, int productId)
        {
            // Retrieves the cart for the specified user
            var cart = await _cartRepository.GetCartByUserId(userId);
            if (cart == null)
            {
                // Returns a 404 Not Found response if the cart does not exist
                return NotFound();
            }

            // Finds the specified item in the cart
            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
            if (cartItem == null)
            {
                // Returns a 404 Not Found response if the item does not exist in the cart
                return NotFound();
            }

            // Increments the item's quantity
            cartItem.Quantity++;
            // Updates the item in the repository
            await _cartRepository.UpdateCartItem(cartItem);

            // Returns a 204 No Content response indicating the item quantity was successfully incremented
            return NoContent();
        }

        // POST: api/cart/{userId}/items/{productId}/decrement
        // Decrements the quantity of an item in the user's cart
        [HttpPost("{userId}/items/{productId}/decrement")]
        public async Task<ActionResult> DecrementCartItem(string userId, int productId)
        {
            // Retrieves the cart for the specified user
            var cart = await _cartRepository.GetCartByUserId(userId);
            if (cart == null)
            {
                // Returns a 404 Not Found response if the cart does not exist
                return NotFound();
            }

            // Finds the specified item in the cart
            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == productId);
            if (cartItem == null)
            {
                // Returns a 404 Not Found response if the item does not exist in the cart
                return NotFound();
            }

            // Checks if the item's quantity is greater than one
            if (cartItem.Quantity > 1)
            {
                // Decrements the item's quantity
                cartItem.Quantity--;
                // Updates the item in the repository
                await _cartRepository.UpdateCartItem(cartItem);
            }
            else
            {
                // Removes the item from the cart if the quantity is one or less
                await _cartRepository.RemoveCartItem(cart.Id, productId);
            }

            // Returns a 204 No Content response indicating the item quantity was successfully decremented or removed
            return NoContent();
        }

        // POST: api/cart/{userId}/merge
        // Merges a local cart with the user's existing cart
        [HttpPost("{userId}/merge")]
        public async Task<ActionResult> MergeCart(string userId, [FromBody] CartDto localCart)
        {
            // Retrieves the cart for the specified user
            var cart = await _cartRepository.GetCartByUserId(userId);
            if (cart == null)
            {
                // Creates a new cart if one does not exist
                cart = new Cart { UserId = userId, CartItems = new List<CartItem>() };
                await _cartRepository.CreateCart(cart);
            }

            // Iterates through each item in the local cart
            foreach (var localCartItem in localCart.CartItems)
            {
                // Checks if the item already exists in the user's cart
                var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == localCartItem.ProductId);
                if (cartItem != null)
                {
                    // Increases the quantity if the item is already in the cart
                    cartItem.Quantity += localCartItem.Quantity;
                }
                else
                {
                    // Adds the new item to the user's cart
                    cart.CartItems.Add(new CartItem
                    {
                        CartId = cart.Id,
                        ProductId = localCartItem.ProductId,
                        Quantity = localCartItem.Quantity,
                        Product = new Product 
                        {
                            Id = localCartItem.Product.Id,
                            Name = localCartItem.Product.Name,
                            Price = localCartItem.Product.Price,
                            Categories = (ICollection<ProductCategory>)localCartItem.Product.Categories.Select(c => new ProductCategoryDto
                            {
                                Id = c.Id,
                                Name = c.Name,
                            })
                        }
                    });
                }
            }

            // Updates the user's cart in the repository
            await _cartRepository.UpdateCart(cart);

            // Returns a 200 OK response indicating the carts were successfully merged
            return Ok();
        }
    }
}
