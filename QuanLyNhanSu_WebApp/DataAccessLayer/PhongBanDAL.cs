using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyNhanSu_WebApp.DataAccessLayer
{
    public class PhongBanDAL
    {
        public List<PhongBanModel> PhongBan_Search(PhongBanModel PhongBan, out int totalRows)
        {
            List<PhongBanModel> PhongBanList = new List<PhongBanModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@TenPhongBan", PhongBan.TenPhongBan ?? ""),
                new SqlParameter("@tbl_CompanyId", PhongBan.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", PhongBan.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_NhanSuId", PhongBan.tbl_NhanSuId ?? ""),
                new SqlParameter("@StatusId", PhongBan.StatusId),
                new SqlParameter("@TinhTrang", PhongBan.TinhTrang),
                new SqlParameter("@PageIndex", PhongBan.pageIndex),
                new SqlParameter("@PageSize", PhongBan.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_PhongBan_Search", parameters))
            {
                while (reader.Read())
                {
                    PhongBanModel newPhongBan = new PhongBanModel();
                    EntityBase.SetObjectValue(reader, ref newPhongBan);

                    //// Đọc thêm các trường mới từ thủ tục
                    //newPhongBan.QueQuanNhanSu = reader["QueQuanNhanSu"] != DBNull.Value ? reader["QueQuanNhanSu"].ToString() : null;
                    //newPhongBan.GioiTinh = reader["GioiTinh"] != DBNull.Value ? reader["GioiTinh"].ToString() : null;

                    PhongBanList.Add(newPhongBan);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return PhongBanList;
        }

        public static string PhongBan_Insert(PhongBanModel PhongBan, ref string newId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@TenPhongBan", PhongBan.TenPhongBan),
                new SqlParameter("@MaPhongBan", PhongBan.MaPhongBan),
                new SqlParameter("@tbl_CompanyId", PhongBan.tbl_CompanyId),
                new SqlParameter("@tbl_CoSoId", PhongBan.tbl_CoSoId),
                new SqlParameter("@tbl_NhanSuId", PhongBan.tbl_NhanSuId ?? ""),
                new SqlParameter("@StatusId", PhongBan.StatusId),
                new SqlParameter("@TinhTrang", PhongBan.TinhTrang),
                new SqlParameter("@CreatedDate", PhongBan.CreatedDate),
                new SqlParameter("@CreatedBy", PhongBan.CreatedBy),
                new SqlParameter("@Note", PhongBan.Note ?? ""),
                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_PhongBan_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error inserting PhongBan: {ex.Message}");
            }

            return newId;
        }

        public static void PhongBan_Update(PhongBanModel PhongBan)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", PhongBan.Id),
                new SqlParameter("@TenPhongBan", PhongBan.TenPhongBan),
                new SqlParameter("@MaPhongBan", PhongBan.MaPhongBan),
                new SqlParameter("@tbl_CompanyId", PhongBan.tbl_CompanyId),
                new SqlParameter("@tbl_CoSoId", PhongBan.tbl_CoSoId),  
                new SqlParameter("@tbl_NhanSuId", PhongBan.tbl_NhanSuId ?? ""),
                new SqlParameter("@TinhTrang", PhongBan.TinhTrang),
                new SqlParameter("@StatusId", PhongBan.StatusId),
                new SqlParameter("@ModifyDate", PhongBan.ModifyDate),
                new SqlParameter("@ModifyBy", PhongBan.CreatedBy),  
                new SqlParameter("@Note", PhongBan.Note ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_PhongBan_Update", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating PhongBan: {ex.Message}");
            }
        }

         
        public static PhongBanModel PhongBan_GetById(string id)
        {
            PhongBanModel PhongBan = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_PhongBan_GetById", parameters))
                {
                    if (reader.Read())
                    {
                        PhongBan = new PhongBanModel();
                        EntityBase.SetObjectValue(reader, ref PhongBan);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi PhongBan Id: {ex.Message}");
            }

            return PhongBan;
        }

        public static void PhongBan_UpdateStatusId(PhongBanModel PhongBan)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", PhongBan.C1),
                new SqlParameter("@StatusId", PhongBan.StatusId),
                new SqlParameter("@Note", PhongBan.Note ?? ""),
                new SqlParameter("@ModifyDate", PhongBan.ModifyDate),
                new SqlParameter("@ModifyBy", PhongBan.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_PhongBan_UpdateStatusId", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }

    }
}
