using ASMPRN232.Data;
using ASMPRN232.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ASMPRN232.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // Lấy lịch sử orders của user
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            int userId = GetCurrentUserId();

            var orders = await _context.Orders
                .Include(o => o.Products)  // Include OrderItems
                .ThenInclude(oi => oi.Product)  // Include Product trong OrderItem
                .Where(o => o.UserId == userId)
                .ToListAsync();

            return Ok(orders);
        }

        // Đặt order từ giỏ hàng
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Order>> PlaceOrder()
        {
            int userId = GetCurrentUserId();

            // Lấy giỏ hàng
            var cartItems = await _context.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
            {
                return BadRequest(new { message = "Cart is empty" });
            }

            // Tính total
            decimal totalAmount = cartItems.Sum(ci => ci.Quantity * ci.Product.Price);

            // Tạo order
            var order = new Order
            {
                UserId = userId,
                TotalAmount = totalAmount,
                Status = "pending",
                Products = cartItems.Select(ci => new OrderItem
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    Price = ci.Product.Price  // Lưu price tại thời điểm order để tránh thay đổi sau
                }).ToList()
            };

            _context.Orders.Add(order);

            // Xóa giỏ hàng sau khi đặt order
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        // Lấy chi tiết một order (optional, để xem detail)
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            int userId = GetCurrentUserId();

            var order = await _context.Orders
                .Include(o => o.Products)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(order);
        }

        // Helper để lấy userId từ token
        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }
    }
}