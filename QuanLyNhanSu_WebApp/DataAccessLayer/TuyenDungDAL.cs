using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Models; 
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Helpers;

namespace QuanLyTuyenDung_WebApp.DataAccessLayer
{
    public class TuyenDungDAL
    {
        public List<TuyenDungModel> TuyenDung_Search(TuyenDungModel TuyenDung, out int totalRows)
        {
            List<TuyenDungModel> TuyenDungList = new List<TuyenDungModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Keyword", TuyenDung.Keyword ?? ""),
                new SqlParameter("@tbl_CompanyId", TuyenDung.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", TuyenDung.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", TuyenDung.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", TuyenDung.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@TinhTrangHoSoTD", TuyenDung.TinhTrangHoSoTD),   
                new SqlParameter("@MucLuong", TuyenDung.MucLuong),   
                new SqlParameter("@TinhTrang", TuyenDung.TinhTrang),
                new SqlParameter("@StatusId", TuyenDung.StatusId),
                new SqlParameter("@PageIndex", TuyenDung.pageIndex),
                new SqlParameter("@PageSize", TuyenDung.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_TuyenDung_Search", parameters))
            {
                while (reader.Read())
                {
                    TuyenDungModel newTuyenDung = new TuyenDungModel();
                    EntityBase.SetObjectValue(reader, ref newTuyenDung);
                    TuyenDungList.Add(newTuyenDung);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return TuyenDungList;
        }
        public static string TuyenDung_Insert(TuyenDungModel TuyenDung, ref string newId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@MaTuyenDung", TuyenDung.MaTuyenDung ?? ""),
                new SqlParameter("@TenTuyenDung", TuyenDung.TenTuyenDung ?? ""),
                new SqlParameter("@MoTa", TuyenDung.MoTa ?? ""),
                new SqlParameter("@YeuCau", TuyenDung.YeuCau ?? ""),
                new SqlParameter("@tbl_CompanyId", TuyenDung.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CompanyName", TuyenDung.tbl_CompanyName ?? ""),
                new SqlParameter("@tbl_CoSoId", TuyenDung.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_CoSoName", TuyenDung.tbl_CoSoName ?? ""),
                new SqlParameter("@tbl_PhongBanId", TuyenDung.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_PhongBanName", TuyenDung.tbl_PhongBanName ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", TuyenDung.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuName", TuyenDung.tbl_Category_ChucVuName ?? ""),
                new SqlParameter("@tbl_NhanSuPhuTrachId", TuyenDung.tbl_NhanSuPhuTrachId ?? ""),
                new SqlParameter("@tbl__NhanSuPhuTrachName", TuyenDung.tbl__NhanSuPhuTrachName ?? ""),
                new SqlParameter("@SoLuong", TuyenDung.SoLuong != 0 ? (object)TuyenDung.SoLuong : DBNull.Value),
                new SqlParameter("@MucLuongTu", TuyenDung.MucLuongTu != 0 ? (object)TuyenDung.MucLuongTu : DBNull.Value),
                new SqlParameter("@MucLuongDen", TuyenDung.MucLuongDen != 0 ? (object)TuyenDung.MucLuongDen : DBNull.Value),
                new SqlParameter("@LinkTuyenDung", TuyenDung.LinkTuyenDung ?? ""),
                new SqlParameter("@NgayBatDau", TuyenDung.NgayBatDau ?? ""),
                new SqlParameter("@HanNopHoSo", TuyenDung.HanNopHoSo ?? ""),
                new SqlParameter("@NgayKetThuc", TuyenDung.NgayKetThuc ?? ""),
                new SqlParameter("@StatusId", TuyenDung.StatusId),
                new SqlParameter("@TinhTrang", TuyenDung.TinhTrang),
                new SqlParameter("@TinhTrangHoSoTD", TuyenDung.TinhTrangHoSoTD),
                new SqlParameter("@CreatedDate", TuyenDung.CreatedDate ?? ""),
                new SqlParameter("@CreatedBy", TuyenDung.CreatedBy ?? ""),
                new SqlParameter("@ModifyDate", TuyenDung.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", TuyenDung.ModifyBy ?? ""),
                new SqlParameter("@Note", TuyenDung.Note ?? ""),
                new SqlParameter("@C1", TuyenDung.C1 ?? ""),
                new SqlParameter("@C2", TuyenDung.C2 ?? ""),
                new SqlParameter("@C3", TuyenDung.C3 ?? ""),

                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_TuyenDung_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error inserting TuyenDung: {ex.Message}");
            }

            return newId;
        }
        public static void TuyenDung_Update(TuyenDungModel TuyenDung)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", TuyenDung.Id),
                new SqlParameter("@MaTuyenDung", TuyenDung.MaTuyenDung ?? ""),
                new SqlParameter("@TenTuyenDung", TuyenDung.TenTuyenDung ?? ""),
                new SqlParameter("@MoTa", TuyenDung.MoTa ?? ""),
                new SqlParameter("@YeuCau", TuyenDung.YeuCau ?? ""),
                new SqlParameter("@tbl_CompanyId", TuyenDung.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CompanyName", TuyenDung.tbl_CompanyName ?? ""),
                new SqlParameter("@tbl_CoSoId", TuyenDung.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_CoSoName", TuyenDung.tbl_CoSoName ?? ""),
                new SqlParameter("@tbl_PhongBanId", TuyenDung.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_PhongBanName", TuyenDung.tbl_PhongBanName ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", TuyenDung.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuName", TuyenDung.tbl_Category_ChucVuName ?? ""),
                new SqlParameter("@tbl_NhanSuPhuTrachId", TuyenDung.tbl_NhanSuPhuTrachId ?? ""),
                new SqlParameter("@tbl__NhanSuPhuTrachName", TuyenDung.tbl__NhanSuPhuTrachName ?? ""),
                new SqlParameter("@SoLuong", TuyenDung.SoLuong != 0 ? (object)TuyenDung.SoLuong : DBNull.Value),
                new SqlParameter("@MucLuongTu", TuyenDung.MucLuongTu != 0 ? (object)TuyenDung.MucLuongTu : DBNull.Value),
                new SqlParameter("@MucLuongDen", TuyenDung.MucLuongDen != 0 ? (object)TuyenDung.MucLuongDen : DBNull.Value),
                new SqlParameter("@LinkTuyenDung", TuyenDung.LinkTuyenDung ?? ""),
                new SqlParameter("@NgayBatDau", TuyenDung.NgayBatDau ?? ""),
                new SqlParameter("@HanNopHoSo", TuyenDung.HanNopHoSo ?? ""),
                new SqlParameter("@NgayKetThuc", TuyenDung.NgayKetThuc ?? ""),
                new SqlParameter("@StatusId", TuyenDung.StatusId),
                new SqlParameter("@TinhTrang", TuyenDung.TinhTrang),
                new SqlParameter("@TinhTrangHoSoTD", TuyenDung.TinhTrangHoSoTD), 
                new SqlParameter("@ModifyDate", TuyenDung.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", TuyenDung.ModifyBy ?? ""),
                new SqlParameter("@Note", TuyenDung.Note ?? ""),
                new SqlParameter("@C1", TuyenDung.C1 ?? ""),
                new SqlParameter("@C2", TuyenDung.C2 ?? ""),
                new SqlParameter("@C3", TuyenDung.C3 ?? ""),
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_TuyenDung_Update", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating TuyenDung: {ex.Message}");
            }
        }
        public static TuyenDungModel TuyenDung_GetById(string id)
        {
            TuyenDungModel TuyenDung = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_TuyenDung_GetById", parameters))
                {
                    if (reader.Read())
                    {
                        TuyenDung = new TuyenDungModel();
                        EntityBase.SetObjectValue(reader, ref TuyenDung);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi TuyenDung Id: {ex.Message}");
            }

            return TuyenDung;
        } 
        public static void TuyenDung_UpdateStatusId(TuyenDungModel TuyenDung)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", TuyenDung.C1),
                new SqlParameter("@StatusId", TuyenDung.StatusId),
                new SqlParameter("@Note", TuyenDung.Note ?? ""),
                new SqlParameter("@ModifyDate", TuyenDung.ModifyDate),
                new SqlParameter("@ModifyBy", TuyenDung.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_TuyenDung_UpdateStatusById", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }  
        public static void TuyenDung_UpdateTinhTrangYeuCauTD(TuyenDungModel TuyenDung)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", TuyenDung.C1),
                new SqlParameter("@TinhTrang", TuyenDung.TinhTrang),
                new SqlParameter("@Note", TuyenDung.Note ?? ""),
                new SqlParameter("@ModifyDate", TuyenDung.ModifyDate),
                new SqlParameter("@ModifyBy", TuyenDung.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_TuyenDung_UpdateTinhTrangYeuCauTD", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        } 

    }
}
