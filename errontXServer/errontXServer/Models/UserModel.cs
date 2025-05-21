namespace errontXServer.Models;

public class UserModel
{
     public UserModel(string email, string password)
     {
           Email = email;
           Password = password;
     }
     
     public UserModel( ) { }
     
     public Guid Id { get; init; }
     
     public string Email { get; init; }
     
     public string Password { get; init; }
}