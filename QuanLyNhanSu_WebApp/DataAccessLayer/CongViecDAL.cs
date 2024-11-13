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
    public class CongViecDAL
    {
        public List<CongViecModel> CongViec_Search(CongViecModel CongViec, out int totalRows)
        {
            List<CongViecModel> CongViecList = new List<CongViecModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {  
                new SqlParameter("@Keyword", CongViec.Keyword ?? ""),
                new SqlParameter("@tbl_CompanyId", CongViec.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", CongViec.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", CongViec.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", CongViec.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", CongViec.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@StatusId", CongViec.StatusId),
                new SqlParameter("@TinhTrang", CongViec.TinhTrang),
                new SqlParameter("@PageIndex", CongViec.pageIndex),
                new SqlParameter("@PageSize", CongViec.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_CongViec_Search", parameters))
            {
                while (reader.Read())
                {
                    CongViecModel newCongViec = new CongViecModel();
                    EntityBase.SetObjectValue(reader, ref newCongViec);
                    CongViecList.Add(newCongViec);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return CongViecList;
        } 
        public static string CongViec_Insert(CongViecModel CongViec, ref string newId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@MaCongViec", ""),
                new SqlParameter("@TenCongViec", CongViec.TenCongViec),
                new SqlParameter("@tbl_CompanyId", CongViec.tbl_CompanyId ?? ""), 
                new SqlParameter("@tbl_CoSoId", CongViec.tbl_CoSoId ?? ""), 
                new SqlParameter("@tbl_PhongBanId", CongViec.tbl_PhongBanId ?? ""), 
                new SqlParameter("@tbl_NhanSuId", CongViec.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", CongViec.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@StatusId", CongViec.StatusId),
                new SqlParameter("@TinhTrang", CongViec.TinhTrang),
                new SqlParameter("@MucDo", CongViec.MucDo),
                new SqlParameter("@RoleId", CongViec.RoleId),
                new SqlParameter("@MoTaChiTiet", CongViec.MoTaChiTiet ?? ""),
                new SqlParameter("@NgayBatDau", CongViec.NgayBatDau ?? ""),
                new SqlParameter("@NgayKetThuc", CongViec.NgayKetThuc ?? ""),
                new SqlParameter("@LinkThucHien", CongViec.LinkThucHien ?? ""),
                new SqlParameter("@CreatedDate", CongViec.CreatedDate ?? ""),
                new SqlParameter("@CreatedBy", CongViec.CreatedBy ?? ""),
                new SqlParameter("@Note", CongViec.Note ?? ""),
                //new SqlParameter("@C1", CongViec.C1 ?? ""),
                //new SqlParameter("@C2", CongViec.C2 ?? ""),
                //new SqlParameter("@C3", CongViec.C3 ?? ""), 
                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }  
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_CongViec_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();  
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error inserting CongViec: {ex.Message}");
            }

            return newId;
        }
        public static void CongViec_Update(CongViecModel CongViec)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", CongViec.Id),
                new SqlParameter("@MaCongViec", CongViec.MaCongViec ?? ""),
                new SqlParameter("@TenCongViec", CongViec.TenCongViec),
                new SqlParameter("@tbl_CompanyId", CongViec.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", CongViec.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", CongViec.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", CongViec.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", CongViec.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@StatusId", CongViec.StatusId),
                new SqlParameter("@TinhTrang", CongViec.TinhTrang),
                new SqlParameter("@MucDo", CongViec.MucDo),
                new SqlParameter("@RoleId", CongViec.RoleId),
                new SqlParameter("@MoTaChiTiet", CongViec.MoTaChiTiet ?? ""),
                new SqlParameter("@NgayBatDau", CongViec.NgayBatDau ?? ""),
                new SqlParameter("@NgayKetThuc", CongViec.NgayKetThuc ?? ""),
                new SqlParameter("@LinkThucHien", CongViec.LinkThucHien ?? ""), 
                new SqlParameter("@ModifyDate", CongViec.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", CongViec.CreatedBy ?? ""),
                new SqlParameter("@Note", CongViec.Note ?? ""),
                //new SqlParameter("@C1", CongViec.C1 ?? ""),
                //new SqlParameter("@C2", CongViec.C2 ?? ""),
                //new SqlParameter("@C3", CongViec.C3 ?? ""), 
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_CongViec_Update", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating CongViec: {ex.Message}");
            }
        }
        public static CongViecModel CongViec_GetById(string id)
        {
            CongViecModel CongViec = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_CongViec_GetById", parameters))
                {
                    if (reader.Read())
                    {
                        CongViec = new CongViecModel();
                        EntityBase.SetObjectValue(reader, ref CongViec);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi CongViec Id: {ex.Message}");
            }

            return CongViec;
        } 
        public static void CongViec_UpdateStatusId(CongViecModel CongViec)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", CongViec.C1),
                new SqlParameter("@TinhTrang", CongViec.TinhTrang),
                new SqlParameter("@MucDo", CongViec.MucDo),
                new SqlParameter("@StatusId", CongViec.StatusId),
                new SqlParameter("@Note", CongViec.Note ?? ""),
                new SqlParameter("@ModifyDate", CongViec.ModifyDate),
                new SqlParameter("@ModifyBy", CongViec.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_CongViec_UpdateTinhTrang", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }

    }
}
