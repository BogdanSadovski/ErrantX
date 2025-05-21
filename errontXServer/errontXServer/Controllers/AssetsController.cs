using errontXServer.Contracts;
using errontXServer.DataAcsess;
using errontXServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace errontXServer.Controllers;

[ApiController]
[Route("[controller]")]
public class AssetsController:ControllerBase
{
    private readonly UsersDBContext _usersDBContext;

    public AssetsController(UsersDBContext context)
    {
        _usersDBContext = context;
    }
    
    [HttpGet("all")]
    public async Task<IActionResult> GetUsers2()
    {
        // Получаем все пользователи из таблицы Users
        var assets = await _usersDBContext.Asset.ToListAsync();

        // Если список пользователей пуст, возвращаем 404
        if (assets == null || !assets.Any())
        {
            return NotFound("No users found.");
        }

        // Возвращаем список пользователей в формате JSON
        return Ok(assets);
    }

    [HttpPost("addAsset")]
    public async Task<IActionResult> AddAsset([FromBody] CreateAssetRequest request,
        CancellationToken cancellationToken)
    {
        // var user = new UserModel();
        // string userId = Convert.ToString(user.Id);
        
        var asset = new AssetModel(request.userId, request.assetName, request.assetAmount, request.assetPrice,
            request.assetDate);

        try
        {
                await _usersDBContext.Asset.AddAsync(asset, cancellationToken);
                await _usersDBContext.SaveChangesAsync(cancellationToken);
                return Ok();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500);
        }
    }

    [HttpGet("getAsset")]
    public async Task<IActionResult> GetAsset(string userId, CancellationToken cancellationToken)
    {
        
        var assets = await _usersDBContext.Asset.Where(a => a.UserId == userId).ToListAsync();
        return Ok(assets);
    }
    
    [HttpGet("allUsers")]
    public async Task<IActionResult> GetUsers3()
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
    
    [HttpDelete("deleteAsset")]
    public async Task<IActionResult> DeleteUsers([FromBody] CreateAssetRequest request , CancellationToken cancellationToken)
    {
        var asset = await _usersDBContext.Asset
            .FirstOrDefaultAsync(u => u.AssetName == request.assetName && u.AssetAmount == request.assetAmount && u.AssetPrice == request.assetPrice, cancellationToken);

        // Если пользователь не найден
        if (asset == null)
        {
            return NotFound($"User with Name {request.assetName} and Email {request.assetAmount} not found.");
        }
        
        _usersDBContext.Asset.Remove(asset);
        await _usersDBContext.SaveChangesAsync(cancellationToken);
        
        return Ok($"User with Name {request.assetName} and Email {request.assetAmount} has been deleted.");
    }
    
    
    
}