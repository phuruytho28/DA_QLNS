using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL
{
    public static class DataAccessHelper
    {
        // Lấy chuỗi kết nối từ file cấu hình
        public static string GetConnectionString()
        {
            return ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        }

        // Thực thi câu lệnh SQL và trả về SqlDataReader
        public static SqlDataReader ExecuteReader(string storedProcedureName, SqlParameter[] parameters)
        {
            SqlConnection connection = new SqlConnection(GetConnectionString());
            SqlCommand command = new SqlCommand(storedProcedureName, connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddRange(parameters);

            try
            {
                connection.Open();
                return command.ExecuteReader(CommandBehavior.CloseConnection);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error executing reader: {ex.Message}");
            }
        }

        // Thực thi câu lệnh SQL không trả về kết quả (Insert, Update, Delete)
        public static int ExecuteNonQuery(string storedProcedureName, SqlParameter[] parameters)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            using (SqlCommand command = new SqlCommand(storedProcedureName, connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddRange(parameters);

                try
                {
                    connection.Open();
                    return command.ExecuteNonQuery();
                }
                catch (SqlException ex)
                {
                    throw new Exception($"Error executing non-query: {ex.Message}");
                }
            }
        }
    }
}