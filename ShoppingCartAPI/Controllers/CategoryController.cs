using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoppingCartAPI.DTO;
using ShoppingCartAPI.Models;
using ShoppingCartAPI.Repository;


namespace ShoppingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductCategoriesController : ControllerBase
    {
        private readonly IProductCategoryRepository _productCategoryRepository;

        // Constructor: Injecting the repository dependency
        public ProductCategoriesController(IProductCategoryRepository productCategoryRepository)
        {
            _productCategoryRepository = productCategoryRepository;
        }

        // GET: api/ProductCategories
        // Retrieves all product categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductCategoryDto>>> GetProductCategories()
        {
            var productCategories = await _productCategoryRepository.GetAllAsync();
            
            // Convert domain models to DTOs
            return productCategories.Select(pc => new ProductCategoryDto
            {
                Id = pc.Id,
                Name = pc.Name
            }).ToList();
        }

        // GET: api/ProductCategories/{id}
        // Retrieves a single product category by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductCategoryDto>> GetProductCategory(int id)
        {
            var productCategory = await _productCategoryRepository.GetByIdAsync(id);
            if (productCategory == null)
            {
                return NotFound(); // Return 404 if the category is not found
            }

            // Convert domain model to DTO
            return new ProductCategoryDto
            {
                Id = productCategory.Id,
                Name = productCategory.Name
            };
        }

        // POST: api/ProductCategories
        // Creates a new product category (Admin only)
        [HttpPost]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<ProductCategoryDto>> CreateProductCategory(ProductCategoryDto productCategoryDto)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var productCategory = new ProductCategory
                    {
                        Name = productCategoryDto.Name
                    };

                    await _productCategoryRepository.AddAsync(productCategory);

                    // Return the created category with a 201 status code
                    return CreatedAtAction(nameof(GetProductCategory), new { id = productCategory.Id }, productCategoryDto);
                }
                catch (DbUpdateException ex)
                {
                    // Handle unique constraint violation
                    if (ex.InnerException?.Message.Contains("UNIQUE constraint failed") ?? false)
                    {
                        ModelState.AddModelError("UniqueProperty", "The value must be unique.");
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
                    }
                }
            }
            return BadRequest(ModelState); // Return 400 if the model state is invalid
        }

        // PUT: api/ProductCategories/{id}
        // Updates an existing product category (Admin only)
        [HttpPut("{id:int}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> UpdateProductCategory([FromRoute] int id, UpdateCategoryDto updateCategoryDto)
        {
            var category = new ProductCategory
            {
                Id = id,
                Name = updateCategoryDto.Name,
            };

            await _productCategoryRepository.UpdateAsync(category);

            if (category == null)
            {
                return NotFound(); // Return 404 if the category is not found
            }

            // Convert updated domain model to DTO
            var response = new ProductCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
            };

            return Ok(response); // Return 200 with the updated category
        }

        // DELETE: api/ProductCategories/{id}
        // Deletes a product category by ID (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> DeleteProductCategory(int id)
        {
            await _productCategoryRepository.DeleteAsync(id);
            return NoContent(); // Return 204 when the deletion is successful
        }
    }
}
