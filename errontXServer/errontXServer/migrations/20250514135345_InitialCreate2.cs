using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace errontXServer.migrations
{
    /// <inheritdoc />
    public partial class InitialCreate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"ALTER TABLE ""Asset"" ALTER COLUMN ""AssetPrice"" TYPE integer USING ""AssetPrice""::integer;");

            migrationBuilder.Sql(
                @"ALTER TABLE ""Asset"" ALTER COLUMN ""AssetAmount"" TYPE integer USING ""AssetAmount""::integer;");

            
            migrationBuilder.AlterColumn<float>(
                name: "AssetPrice",
                table: "Asset",
                type: "real",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<float>(
                name: "AssetAmount",
                table: "Asset",
                type: "real",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "AssetPrice",
                table: "Asset",
                type: "real",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<string>(
                name: "AssetAmount",
                table: "Asset",
                type: "real",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");
        }
    }
}
