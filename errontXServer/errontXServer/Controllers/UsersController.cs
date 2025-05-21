using errontXServer.Contracts;
using errontXServer.DataAcsess;
using errontXServer.Models;
using errontXServer.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace errontXServer.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly UsersDBContext _usersDBContext;
    
    public UsersController(UsersDBContext context)
    {
        _usersDBContext = context;
    }

    
    // регистрация пользователя 
    [HttpPost("register")]
    public async Task<IActionResult> AddUser([FromBody] CreateUserRequest request , CancellationToken cancellationToken)
    {
        var user = new UserModel(request.Email, request.Password);
        bool emaildent = await _usersDBContext.Users.AnyAsync(u => u.Email == request.Email, cancellationToken);

        if (!emaildent)
        {
            await _usersDBContext.Users.AddAsync(user, cancellationToken);
            await _usersDBContext.SaveChangesAsync(cancellationToken);
            EmailServic emailServic = new EmailServic();
            emailServic.SendEmail(request.Email, "Успешная регистрация");
            return Ok();
        }
        return NotFound();
    }

    // проверка полльзователя при фходе в аккаунт
    [HttpPost("login")]
    public async Task<IActionResult> LoginIdent([FromBody] CreateUserRequest request , CancellationToken cancellationToken)
    {
        var user = new UserModel(request.Email, request.Password);
        bool emaildent = await _usersDBContext.Users.AnyAsync(u => u.Email == request.Email, cancellationToken);
        var identUser = await _usersDBContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        
        if (emaildent)
        {
            if (identUser.Password == request.Password)
            {
                EmailServic emailServic = new EmailServic();
                emailServic.SendEmail(request.Email, "Успешный вход");
                return Ok(new { id = identUser.Id });
            }
        }
        return NotFound();
    }
    
    [HttpGet("all")]
    public async Task<IActionResult> GetUsers2()
    {
        // Получаем все пользователи из таблицы Users
        var users = await _usersDBContext.Users.ToListAsync();

        // Если список пользователей пуст, возвращаем 404
        if (users == null || !users.Any())
        {
            return NotFound("No users found.");
        }

        // Возвращаем список пользователей в формате JSON
        return Ok(users);
    }
 
    [HttpDelete]
    public async Task<IActionResult> DeleteUsers([FromBody] CreateUserRequest request , CancellationToken cancellationToken)
    {
        var user = await _usersDBContext.Users
            .FirstOrDefaultAsync(u => u.Password == request.Password && u.Email == request.Email, cancellationToken);

        // Если пользователь не найден
        if (user == null)
        {
            return NotFound($"User with Name {request.Password} and Email {request.Email} not found.");
        }

        // Удаляем пользователя
        _usersDBContext.Users.Remove(user);
        await _usersDBContext.SaveChangesAsync(cancellationToken);

        // Возвращаем успешный ответ
        return Ok($"User with Name {request.Password} and Email {request.Email} has been deleted.");
    }
}