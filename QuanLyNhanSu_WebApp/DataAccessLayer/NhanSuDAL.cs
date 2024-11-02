using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyNhanSu_WebApp.DataAccessLayer
{
    public class NhanSuDAL
    {
        public List<NhanSuModel> NhanSu_Search(NhanSuModel NhanSu, out int totalRows)
        {
            List<NhanSuModel> NhanSuList = new List<NhanSuModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Keyword", NhanSu.Keyword ?? ""),
                new SqlParameter("@tbl_CompanyId", NhanSu.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", NhanSu.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", NhanSu.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", NhanSu.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@tblCategory_Que_TinhId", NhanSu.tblCategory_Que_TinhId ?? ""),   
                new SqlParameter("@TinhTrang", NhanSu.TinhTrang),
                new SqlParameter("@StatusId", NhanSu.StatusId),
                new SqlParameter("@PageIndex", NhanSu.pageIndex),
                new SqlParameter("@PageSize", NhanSu.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_NhanSu_Search", parameters))
            {
                while (reader.Read())
                {
                    NhanSuModel newNhanSu = new NhanSuModel();
                    EntityBase.SetObjectValue(reader, ref newNhanSu);
                    NhanSuList.Add(newNhanSu);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return NhanSuList;
        }
        public static string NhanSu_Insert(NhanSuModel NhanSu, ref string newId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@MaNhanVien", NhanSu.MaNhanVien ?? ""),
                new SqlParameter("@HoTen", NhanSu.HoTen ?? ""),
                new SqlParameter("@GioiTinh", NhanSu.GioiTinh ?? ""),
                new SqlParameter("@NgaySinh", NhanSu.NgaySinh ?? ""),
                new SqlParameter("@tblCategory_Que_TinhId", NhanSu.tblCategory_Que_TinhId ?? ""),
                new SqlParameter("@tblCategory_Que_HuyenId", NhanSu.tblCategory_Que_HuyenId ?? ""),
                new SqlParameter("@DiaChi_Que", NhanSu.DiaChi_Que ?? ""),
                new SqlParameter("@tblCategory_HienTai_TinhId", NhanSu.tblCategory_HienTai_TinhId ?? ""),
                new SqlParameter("@tblCategory_HienTai_HuyenId", NhanSu.tblCategory_HienTai_HuyenId ?? ""),
                new SqlParameter("@DiaChi_HienTai", NhanSu.DiaChi_HienTai ?? ""),
                new SqlParameter("@tbl_CompanyId", NhanSu.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", NhanSu.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", NhanSu.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", NhanSu.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@SoCCCD", NhanSu.SoCCCD != 0 ? (object)NhanSu.SoCCCD : DBNull.Value),
                new SqlParameter("@tbl_Category_DanTocId", NhanSu.tbl_Category_DanTocId ?? ""),
                new SqlParameter("@tbl_Category_TonGiaoId", NhanSu.tbl_Category_TonGiaoId ?? ""),
                new SqlParameter("@tbl_Category_HocVanId", NhanSu.tbl_Category_HocVanId ?? ""),
                new SqlParameter("@tblCategory_NoiCap_TinhId", NhanSu.tblCategory_NoiCap_TinhId ?? ""),
                new SqlParameter("@Email", NhanSu.Email ?? ""),
                new SqlParameter("@SDT", NhanSu.SDT != 0 ? (object)NhanSu.SDT : DBNull.Value),
                new SqlParameter("@NgayBatDauLamViec", NhanSu.NgayBatDauLamViec ?? ""),
                new SqlParameter("@StatusId", NhanSu.StatusId),
                new SqlParameter("@TinhTrang", NhanSu.TinhTrang),
                new SqlParameter("@CreatedDate", NhanSu.CreatedDate ?? ""),
                new SqlParameter("@CreatedBy", NhanSu.CreatedBy ?? ""),
                new SqlParameter("@Note", NhanSu.Note ?? ""),
                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_NhanSu_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error inserting NhanSu: {ex.Message}");
            }

            return newId;
        }
        public static void NhanSu_Update(NhanSuModel NhanSu)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", NhanSu.Id),
                new SqlParameter("@MaNhanVien", NhanSu.MaNhanVien ?? ""),
                new SqlParameter("@HoTen", NhanSu.HoTen ?? ""),
                new SqlParameter("@GioiTinh", NhanSu.GioiTinh ?? ""),
                new SqlParameter("@NgaySinh", NhanSu.NgaySinh ?? ""),
                new SqlParameter("@tblCategory_Que_TinhId", NhanSu.tblCategory_Que_TinhId ?? ""),
                new SqlParameter("@tblCategory_Que_HuyenId", NhanSu.tblCategory_Que_HuyenId ?? ""),
                new SqlParameter("@DiaChi_Que", NhanSu.DiaChi_Que ?? ""),
                new SqlParameter("@tblCategory_HienTai_TinhId", NhanSu.tblCategory_HienTai_TinhId ?? ""),
                new SqlParameter("@tblCategory_HienTai_HuyenId", NhanSu.tblCategory_HienTai_HuyenId ?? ""),
                new SqlParameter("@DiaChi_HienTai", NhanSu.DiaChi_HienTai ?? ""),
                new SqlParameter("@tbl_CompanyId", NhanSu.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", NhanSu.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", NhanSu.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", NhanSu.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@SoCCCD", NhanSu.SoCCCD != 0 ? (object)NhanSu.SoCCCD : DBNull.Value),
                new SqlParameter("@tbl_Category_DanTocId", NhanSu.tbl_Category_DanTocId ?? ""),
                new SqlParameter("@tbl_Category_TonGiaoId", NhanSu.tbl_Category_TonGiaoId ?? ""),
                new SqlParameter("@tbl_Category_HocVanId", NhanSu.tbl_Category_HocVanId ?? ""),
                new SqlParameter("@tblCategory_NoiCap_TinhId", NhanSu.tblCategory_NoiCap_TinhId ?? ""),
                new SqlParameter("@Email", NhanSu.Email ?? ""),
                new SqlParameter("@SDT", NhanSu.SDT != 0 ? (object)NhanSu.SDT : DBNull.Value),
                new SqlParameter("@NgayBatDauLamViec", NhanSu.NgayBatDauLamViec ?? ""),
                new SqlParameter("@StatusId", NhanSu.StatusId),
                new SqlParameter("@TinhTrang", NhanSu.TinhTrang),
                new SqlParameter("@CreatedDate", NhanSu.CreatedDate ?? ""),
                new SqlParameter("@CreatedBy", NhanSu.CreatedBy ?? ""),
                new SqlParameter("@Note", NhanSu.Note ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_NhanSu_Update", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating NhanSu: {ex.Message}");
            }
        }
        public static NhanSuModel NhanSu_GetById(string id)
        {
            NhanSuModel NhanSu = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_NhanSu_GetById", parameters))
                {
                    if (reader.Read())
                    {
                        NhanSu = new NhanSuModel();
                        EntityBase.SetObjectValue(reader, ref NhanSu);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi NhanSu Id: {ex.Message}");
            }

            return NhanSu;
        } 
        public static void NhanSu_UpdateStatusId(NhanSuModel NhanSu)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", NhanSu.C1),
                new SqlParameter("@StatusId", NhanSu.StatusId),
                new SqlParameter("@Note", NhanSu.Note ?? ""),
                new SqlParameter("@ModifyDate", NhanSu.ModifyDate),
                new SqlParameter("@ModifyBy", NhanSu.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_NhanSu_UpdateStatusId", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }

    }
}
