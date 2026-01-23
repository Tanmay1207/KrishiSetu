using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KrishiSetu.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMachineryAvailableDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AvailableDate",
                table: "Machineries",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableDate",
                table: "Machineries");
        }
    }
}
