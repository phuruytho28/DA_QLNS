using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;

namespace QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL
{
    public static class EntityBase
    {
        // Hàm ánh xạ dữ liệu từ SqlDataReader vào đối tượng entity
        public static void SetObjectValue<T>(SqlDataReader reader, ref T entity) where T : new()
        {
            // Lấy tất cả các thuộc tính của entity
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            // Lặp qua từng thuộc tính
            foreach (var property in properties)
            {
                // Kiểm tra xem SqlDataReader có chứa cột tương ứng với thuộc tính không
                if (!reader.HasColumn(property.Name) || reader[property.Name] == DBNull.Value)
                    continue;

                // Gán giá trị từ reader cho thuộc tính
                property.SetValue(entity, reader[property.Name]);
            }
        }

        // Hàm kiểm tra xem SqlDataReader có cột hay không
        private static bool HasColumn(this SqlDataReader reader, string columnName)
        {
            for (int i = 0; i < reader.FieldCount; i++)
            {
                if (reader.GetName(i).Equals(columnName, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            return false;
        }
    }
}