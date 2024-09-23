using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using AuthService = ExcelApp.Core.Services.AuthService;
using IUser = ExcelApp.Shared.Interfaces.IUser;
using UserDTO = ExcelApp.Web.Server.Models.UserDTO;
using LoginRequestDTO = ExcelApp.Web.Server.Models.LoginRequestDTO;
using RegisterRequestDTO = ExcelApp.Web.Server.Models.RegisterRequestDTO;
using ChangePasswordDTO = ExcelApp.Web.Server.Models.ChangePasswordDTO;

namespace ExcelApp.Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> Login([FromBody] LoginRequestDTO loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.Login(loginRequest.Email, loginRequest.Password);
            if (!result.Success)
            {
                return Unauthorized(result.Message);
            }

            var token = _authService.GenerateJwtToken(result.User);
            return Ok(token);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> Register([FromBody] RegisterRequestDTO registerRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.Register(registerRequest.Name, registerRequest.Email, registerRequest.Password);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            var userDto = MapToUserDTO(result.User);
            return CreatedAtAction(nameof(GetCurrentUser), new { id = userDto.Id }, userDto);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await _authService.GetCurrentUser(User);
            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(MapToUserDTO(user));
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var user = await _authService.GetCurrentUser(User);
            if (user == null)
            {
                return Unauthorized();
            }

            await _authService.Logout(user.Id);
            // Note: JWT token invalidation should be handled by the client
            return Ok();
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _authService.GetCurrentUser(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var result = await _authService.ChangePassword(user.Id, changePasswordRequest.CurrentPassword, changePasswordRequest.NewPassword);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok();
        }

        private UserDTO MapToUserDTO(IUser user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}