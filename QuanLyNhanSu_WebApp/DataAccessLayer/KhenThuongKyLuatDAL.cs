using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.Web.Razor.Tokenizer.Symbols;

namespace QuanLyNhanSu_WebApp.DataAccessLayer
{
    public class KhenThuongKyLuatDAL
    {
        public List<KhenThuongKyLuatModel> KhenThuongKyLuat_Search(KhenThuongKyLuatModel KhenThuongKyLuat, out int totalRows)
        {
            List<KhenThuongKyLuatModel> KhenThuongKyLuatList = new List<KhenThuongKyLuatModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {  
                new SqlParameter("@Keyword", KhenThuongKyLuat.Keyword ?? ""),
                new SqlParameter("@tbl_CompanyId", KhenThuongKyLuat.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", KhenThuongKyLuat.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", KhenThuongKyLuat.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", KhenThuongKyLuat.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", KhenThuongKyLuat.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@StatusId", KhenThuongKyLuat.StatusId),
                new SqlParameter("@HinhThuc", KhenThuongKyLuat.HinhThuc),
                new SqlParameter("@TinhTrang", KhenThuongKyLuat.TinhTrang),
                new SqlParameter("@PageIndex", KhenThuongKyLuat.pageIndex),
                new SqlParameter("@PageSize", KhenThuongKyLuat.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_KhenThuongKyLuat_Search", parameters))
            {
                while (reader.Read())
                {
                    KhenThuongKyLuatModel newKhenThuongKyLuat = new KhenThuongKyLuatModel();
                    EntityBase.SetObjectValue(reader, ref newKhenThuongKyLuat);
                    KhenThuongKyLuatList.Add(newKhenThuongKyLuat);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return KhenThuongKyLuatList;
        }  

        public static string KhenThuongKyLuat_Insert(KhenThuongKyLuatModel KhenThuongKyLuat, ref string newId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@MaKT_KL", KhenThuongKyLuat.MaKT_KL ?? ""),
                new SqlParameter("@TenKTKL", KhenThuongKyLuat.TenKTKL ?? ""),
                new SqlParameter("@tbl_CompanyId", KhenThuongKyLuat.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", KhenThuongKyLuat.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", KhenThuongKyLuat.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", KhenThuongKyLuat.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", KhenThuongKyLuat.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@StatusId", KhenThuongKyLuat.StatusId),
                new SqlParameter("@TinhTrang", KhenThuongKyLuat.TinhTrang),
                new SqlParameter("@RoleId", KhenThuongKyLuat.RoleId),
                new SqlParameter("@MoTaChiTiet", KhenThuongKyLuat.MoTaChiTiet ?? ""),
                new SqlParameter("@NgayKhoiTao", KhenThuongKyLuat.NgayKhoiTao ?? ""),
                new SqlParameter("@HinhThuc", KhenThuongKyLuat.HinhThuc),
                new SqlParameter("@SoQuyetDinh", KhenThuongKyLuat.SoQuyetDinh ?? ""),
                new SqlParameter("@NgayQuyetDinh", KhenThuongKyLuat.NgayQuyetDinh ?? ""), 
                new SqlParameter("@CreatedDate", KhenThuongKyLuat.CreatedDate ?? ""),
                new SqlParameter("@CreatedBy", KhenThuongKyLuat.CreatedBy ?? ""),
                new SqlParameter("@Note", KhenThuongKyLuat.Note ?? ""),
                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }  
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_KhenThuongKyLuat_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();  
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error inserting KhenThuongKyLuat: {ex.Message}");
            }

            return newId;
        }
        public static void KhenThuongKyLuat_Update(KhenThuongKyLuatModel KhenThuongKyLuat)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", KhenThuongKyLuat.Id),
                new SqlParameter("@MaKT_KL", KhenThuongKyLuat.MaKT_KL ?? ""),
                new SqlParameter("@TenKTKL", KhenThuongKyLuat.TenKTKL ?? ""),
                new SqlParameter("@tbl_CompanyId", KhenThuongKyLuat.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", KhenThuongKyLuat.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", KhenThuongKyLuat.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", KhenThuongKyLuat.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", KhenThuongKyLuat.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@StatusId", KhenThuongKyLuat.StatusId),
                new SqlParameter("@TinhTrang", KhenThuongKyLuat.TinhTrang),
                new SqlParameter("@RoleId", KhenThuongKyLuat.RoleId),
                new SqlParameter("@MoTaChiTiet", KhenThuongKyLuat.MoTaChiTiet ?? ""),
                new SqlParameter("@NgayKhoiTao", KhenThuongKyLuat.NgayKhoiTao ?? ""),
                new SqlParameter("@HinhThuc", KhenThuongKyLuat.HinhThuc),
                new SqlParameter("@SoQuyetDinh", KhenThuongKyLuat.SoQuyetDinh ?? ""),
                new SqlParameter("@NgayQuyetDinh", KhenThuongKyLuat.NgayQuyetDinh ?? ""),
                new SqlParameter("@ModifyDate", KhenThuongKyLuat.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", KhenThuongKyLuat.CreatedBy ?? ""),
                new SqlParameter("@Note", KhenThuongKyLuat.Note ?? ""),
                new SqlParameter("@C1", KhenThuongKyLuat.C1 ?? ""),
                new SqlParameter("@C2", KhenThuongKyLuat.C2 ?? ""),
                new SqlParameter("@C3", KhenThuongKyLuat.C3 ?? ""),

            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_KhenThuongKyLuat_Update", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating KhenThuongKyLuat: {ex.Message}");
            }
        }
        public static KhenThuongKyLuatModel KhenThuongKyLuat_GetById(string id)
        {
            KhenThuongKyLuatModel KhenThuongKyLuat = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_KhenThuongKyLuat_GetById", parameters))
                {
                    if (reader.Read())
                    {
                        KhenThuongKyLuat = new KhenThuongKyLuatModel();
                        EntityBase.SetObjectValue(reader, ref KhenThuongKyLuat);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi KhenThuongKyLuat Id: {ex.Message}");
            }

            return KhenThuongKyLuat;
        } 
        public static void KhenThuongKyLuat_UpdateStatusId(KhenThuongKyLuatModel KhenThuongKyLuat)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", KhenThuongKyLuat.C1),
                new SqlParameter("@TinhTrang", KhenThuongKyLuat.TinhTrang), 
                new SqlParameter("@StatusId", KhenThuongKyLuat.StatusId),
                new SqlParameter("@Note", KhenThuongKyLuat.Note ?? ""),
                new SqlParameter("@ModifyDate", KhenThuongKyLuat.ModifyDate),
                new SqlParameter("@ModifyBy", KhenThuongKyLuat.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_KhenThuongKyLuat_UpdateTinhTrang", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }

    }
}
