using QuanLyNhanSu_WebApp.Models;
using System;
using System.Data.SqlClient;
using System.Security.Principal;
using Microsoft.AspNet.Identity;
using System.ComponentModel.Design;
using System.Web.Security;
using System.Xml.Linq;

namespace QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL
{
    public static class AccountDAL
    {

        public static string InsertAccount(AccountModel account)
        {
            string newId = null;
            var passwordHasher = new PasswordHasher(); // Create an instance of PasswordHasher
             
            // Hash the password
            account.HasPassword = passwordHasher.HashPassword(account.Password);

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Name", account.Name),
                new SqlParameter("@Password", account.Password),
                new SqlParameter("@HasPassword", account.HasPassword),
                new SqlParameter("@RoleId", account.RoleId),
                new SqlParameter("@Gmail", account.Gmail),
                new SqlParameter("@CompanyId", account.CompanyId ?? ""),
                new SqlParameter("@CoSoId", account.CoSoId ?? ""),
                new SqlParameter("@PhongBanId", account.PhongBanId ?? ""),
                new SqlParameter("@NhanSuId", account.NhanSuId ?? ""),
                new SqlParameter("@StatusId", account.StatusId),
                new SqlParameter("@CreatedDate", account.CreatedDate),
                new SqlParameter("@Note", account.Note ?? ""),  
                new SqlParameter("@C1", account.C1 ?? ""),
                new SqlParameter("@C2", account.C2 ?? ""),
                new SqlParameter("@C3", account.C3 ?? ""),

                // đây là phần của bảng Company
                new SqlParameter("@TenCongTy", account.TenCongTy),
                new SqlParameter("@DiaChi", account.DiaChi),
                new SqlParameter("@SoDienThoai", account.SoDienThoai),

                new SqlParameter("@Id", System.Data.SqlDbType.VarChar, 36) { Direction = System.Data.ParameterDirection.Output }
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_Account_Insert", parameters);

                newId = parameters[parameters.Length - 1].Value.ToString();
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("Email đã tồn tại!!!"))
                {
                    throw new Exception("Email đã tồn tại, vui lòng thử với email khác.");
                }
                else
                {
                    throw new Exception($"Error inserting account: {ex.Message}");
                }
            }

            return newId;
        }
        public static string InsertAccount_NhanVien(AccountModel account)
        {
            string newId = null;
            var passwordHasher = new PasswordHasher(); // Create an instance of PasswordHasher
             
            // Hash the password
            account.HasPassword = passwordHasher.HashPassword(account.Password);

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Name", account.Name),
                new SqlParameter("@Password", account.Password),
                new SqlParameter("@HasPassword", account.HasPassword),
                new SqlParameter("@RoleId", account.RoleId),
                new SqlParameter("@Gmail", account.Gmail),
                new SqlParameter("@CompanyId", account.CompanyId ?? ""),
                new SqlParameter("@CoSoId", account.CoSoId ?? ""),
                new SqlParameter("@PhongBanId", account.PhongBanId ?? ""),
                new SqlParameter("@ChucVuId", account.ChucVuId ?? ""),
                new SqlParameter("@NhanSuId", account.NhanSuId ?? ""),
                new SqlParameter("@StatusId", account.StatusId),
                new SqlParameter("@CreatedDate", account.CreatedDate),
                new SqlParameter("@CreatedBy", account.CreatedBy),
                new SqlParameter("@Note", account.Note ?? ""),  
                new SqlParameter("@C1", account.C1 ?? ""),
                new SqlParameter("@C2", account.C2 ?? ""),
                new SqlParameter("@C3", account.C3 ?? ""),   
                new SqlParameter("@Id", System.Data.SqlDbType.VarChar, 36) { Direction = System.Data.ParameterDirection.Output }
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_Account_Insert_NhanVien", parameters);

                newId = parameters[parameters.Length - 1].Value.ToString();
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("Email đã tồn tại!!!"))
                {
                    throw new Exception("Email đã tồn tại, vui lòng thử với email khác.");
                }
                else
                {
                    throw new Exception($"Error inserting account: {ex.Message}");
                }
            }

            return newId;
        }

        public static AccountModel VerifyLogin(string gmail, string password)
        {
            AccountModel account = null;

            // Lấy thông tin tài khoản từ cơ sở dữ liệu dựa trên Gmail
            SqlParameter[] parameters = new SqlParameter[] { new SqlParameter("@Gmail", gmail) };

            using (var reader = DataAccessHelper.ExecuteReader("tblAccount_GetByGmail", parameters))
            {
                if (reader.Read())
                {
                    account = new AccountModel();
                    EntityBase.SetObjectValue(reader, ref account);
                }
            }

            // Nếu tài khoản tồn tại, kiểm tra mật khẩu
            if (account != null)
            {
                var passwordHasher = new PasswordHasher();
                var result = passwordHasher.VerifyHashedPassword(account.HasPassword, password);

                if (result == PasswordVerificationResult.Success)
                {
                    // Mật khẩu hợp lệ, trả về tài khoản
                    return account;
                }
                else
                {
                    // Mật khẩu không đúng
                    return null;
                }
            }

            // Trả về null nếu không tìm thấy tài khoản
            return null;
        }
         
        public static bool UpdateAccountPassword(AccountModel account)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", account.Id),
                new SqlParameter("@Password", account.Password),
                new SqlParameter("@HasPassword", account.HasPassword)
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_Account_UpdatePassword", parameters);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating password: {ex.Message}");
            }
        }

        public static AccountModel GetAccountById(string userId)
        {
            AccountModel account = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", userId)
            };

            using (var reader = DataAccessHelper.ExecuteReader("tbl_Account_GetById", parameters))
            {
                if (reader.Read())
                {
                    account = new AccountModel();
                    EntityBase.SetObjectValue(reader, ref account);
                }
            }

            return account;
        }

    }
}
