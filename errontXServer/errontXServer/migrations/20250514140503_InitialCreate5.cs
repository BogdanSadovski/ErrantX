using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace errontXServer.migrations
{
    /// <inheritdoc />
    public partial class InitialCreate5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"ALTER TABLE ""Asset"" ALTER COLUMN ""AssetPrice"" TYPE integer USING ""AssetPrice""::integer;");

            migrationBuilder.Sql(
                @"ALTER TABLE ""Asset"" ALTER COLUMN ""AssetAmount"" TYPE integer USING ""AssetAmount""::integer;");
            
            migrationBuilder.AlterColumn<int>(
                name: "AssetPrice",
                table: "Asset",
                type: "integer",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<int>(
                name: "AssetAmount",
                table: "Asset",
                type: "integer",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "AssetPrice",
                table: "Asset",
                type: "real",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<float>(
                name: "AssetAmount",
                table: "Asset",
                type: "real",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
