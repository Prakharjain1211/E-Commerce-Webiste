using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingCartAPI.DTO;
using ShoppingCartAPI.Models;
using ShoppingCartAPI.Repository;

namespace ShoppingCartAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IProductCategoryRepository _productCategoryRepository;

        //* Constructor: Injecting the repository dependencies
        public ProductsController(IProductRepository productRepository, IProductCategoryRepository productCategoryRepository)
        {
            _productRepository = productRepository;
            _productCategoryRepository = productCategoryRepository;
        }

        //* GET: {apibaseURL}/api/Products
        //* Retrieves all products
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            //* Call product repository to get all products
            var products = await _productRepository.GetAllAsync();

            //* Convert Domain models to DTOs
            var response = products.Select(product => new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                FeaturedImageUrl = product.FeaturedImageUrl,
                Categories = product.Categories.Select(category => new ProductCategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                }).ToList()
            }).ToList();

            return Ok(response); //* Return the list of products
        }

        //* GET: {apibaseURL}/api/Products/{id}
        //* Retrieves a single product by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            //* Call product repository to get the product by ID
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(); //* Return 404 if the product is not found
            }

            //* Convert Domain model to DTO
            var response = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                ShortDescription = product.ShortDescription,
                Price = product.Price,
                FeaturedImageUrl = product.FeaturedImageUrl,
                Categories = product.Categories.Select(category => new ProductCategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                }).ToList()
            };

            return Ok(response); //* Return the product details
        }

        //* GET: {apibaseURL}/api/Products/searchByCategory/{category}
        //* Retrieves products by category
        [HttpGet("searchByCategory/{category}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategory(string category)
        {
            //* Call product repository to get products by category
            var products = await _productRepository.GetProductsByCategoryAsync(category);
            if (!products.Any())
            {
                return NotFound(); //* Return 404 if no products are found
            }
            return Ok(products); //* Return the list of products in the category
        }

        //* POST: {apibaseURL}/api/Products
        //* Creates a new product (Admin only)
        [HttpPost]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequestDto productDto)
        {
            //* Create a new Product domain model
            var product = new Product
            {
                Name = productDto.Name,
                ShortDescription = productDto.ShortDescription,
                Price = productDto.Price,
                FeaturedImageUrl = productDto.FeaturedImageUrl,
                Categories = new List<ProductCategory>()
            };

            //* Add categories to the product
            foreach (var item in productDto.Categories)
            {
                var existingCategory = await _productCategoryRepository.GetByIdAsync(item);
                if (existingCategory != null)
                {
                    product.Categories.Add(existingCategory);
                }
            }

            //* Save the new product to the repository
            product = await _productRepository.AddAsync(product);

            //* Convert Domain model to DTO
            var response = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                ShortDescription = product.ShortDescription,
                Price = product.Price,
                FeaturedImageUrl = product.FeaturedImageUrl,
                Categories = product.Categories.Select(category => new ProductCategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                }).ToList()
            };

            return Ok(response); //* Return the created product details
        }

        //* PUT: {apibaseURL}/api/Products/{id}
        //* Updates an existing product (Admin only)
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto productDto)
        {
            //* Create a new Product domain model with the updated details
            var product = new Product
            {
                Id = id,
                Name = productDto.Name,
                ShortDescription = productDto.ShortDescription,
                Price = productDto.Price,
                FeaturedImageUrl = productDto.FeaturedImageUrl,
                Categories = new List<ProductCategory>()
            };

            //* Add categories to the product
            foreach (var item in productDto.Categories)
            {
                var existingCategory = await _productCategoryRepository.GetByIdAsync(item);
                if (existingCategory != null)
                {
                    product.Categories.Add(existingCategory);
                }
            }

            //* Update the product in the repository
            var updatedProduct = await _productRepository.UpdateAsync(product);

            if (updatedProduct == null)
            {
                return NotFound(); //* Return 404 if the product is not found
            }

            //* Convert Domain model to DTO
            var response = new ProductDto
            {
                Id = updatedProduct.Id,
                Name = updatedProduct.Name,
                ShortDescription = updatedProduct.ShortDescription,
                Price = updatedProduct.Price,
                FeaturedImageUrl = updatedProduct.FeaturedImageUrl,
                Categories = updatedProduct.Categories.Select(category => new ProductCategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                }).ToList()
            };

            return Ok(response); //* Return the updated product details
        }

        //* DELETE: {apibaseURL}/api/Products/{id}
        //* Deletes a product by ID (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            //* Delete the product from the repository
            var deletedProduct = await _productRepository.DeleteAsync(id);
            if (deletedProduct == null)
            {
                return NotFound(); //* Return 404 if the product is not found
            }

            //* Convert Domain model to DTO
            var response = new ProductDto
            {
                Id = deletedProduct.Id,
                Name = deletedProduct.Name,
                ShortDescription = deletedProduct.ShortDescription,
                Price = deletedProduct.Price,
                FeaturedImageUrl = deletedProduct.FeaturedImageUrl
            };

            return Ok(response); //* Return the deleted product details
        }
    }
}
