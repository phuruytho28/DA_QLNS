using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Helpers;

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
                new SqlParameter("@tbl_TuyenDungId", NhanSu.tbl_TuyenDungId ?? ""),   
                new SqlParameter("@TinhTrang", NhanSu.TinhTrang),
                new SqlParameter("@TinhTrangHoSoTD", NhanSu.TinhTrangHoSoTD),
                new SqlParameter("@RoleId", NhanSu.RoleId),
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

                new SqlParameter("@TinhTrangHoSoTD", NhanSu.TinhTrangHoSoTD),
                new SqlParameter("@tbl_TuyenDungId", NhanSu.tbl_TuyenDungId ?? ""),
                new SqlParameter("@RoleId", NhanSu.RoleId),
                new SqlParameter("@C3", NhanSu.C3),
                new SqlParameter("@LinkHoSoUngVien", NhanSu.LinkHoSoUngVien),

                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_NhanSu_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();
            }
            catch (SqlException ex)
            { 
                if (ex.Number == 50001 && ex.Message.Contains("Email"))
                {
                    throw new Exception("Email đã tồn tại. Vui lòng chọn Email khác.");
                }
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
                new SqlParameter("@Note", NhanSu.Note ?? ""),
                new SqlParameter("@ModifyDate", NhanSu.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", NhanSu.ModifyBy ?? ""),


                new SqlParameter("@TinhTrangHoSoTD", NhanSu.TinhTrangHoSoTD),
                new SqlParameter("@tbl_TuyenDungId", NhanSu.tbl_TuyenDungId ?? ""),
                new SqlParameter("@RoleId", NhanSu.RoleId),
                new SqlParameter("@C3", NhanSu.C3),
                new SqlParameter("@LinkHoSoUngVien", NhanSu.LinkHoSoUngVien),
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
                DataAccessHelper.ExecuteNonQuery("tbl_NhanSu_UpdateStatusById", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }
        public static void UpdateTinhTrangNS(NhanSuModel NhanSu)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", NhanSu.C1),
                new SqlParameter("@TinhTrang", NhanSu.TinhTrang),
                new SqlParameter("@Note", NhanSu.Note ?? ""),
                new SqlParameter("@ModifyDate", NhanSu.ModifyDate),
                new SqlParameter("@ModifyBy", NhanSu.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_NhanSu_XetDuyet_NhanSu", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }
        public static void NhanSu_DeleteById(string id)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_NhanSu_DeleteById", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error deleting NhanSu: {ex.Message}");
            }
        }


        public List<NhanSu_LichSuDuyetModel> LichSuXetDuyet_Search(NhanSu_LichSuDuyetModel LichSuDuyet, out int totalRows)
        {
            List<NhanSu_LichSuDuyetModel> LichSuList = new List<NhanSu_LichSuDuyetModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@tbl_NhanSuId", LichSuDuyet.tbl_NhanSuId ?? ""),  
                new SqlParameter("@PageIndex", LichSuDuyet.pageIndex),
                new SqlParameter("@PageSize", LichSuDuyet.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_LichSuXetDuyet_Search", parameters))
            {
                while (reader.Read())
                {
                    NhanSu_LichSuDuyetModel newLichSu = new NhanSu_LichSuDuyetModel();
                    EntityBase.SetObjectValue(reader, ref newLichSu);
                    LichSuList.Add(newLichSu);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return LichSuList;
        }
        public List<NhanSu_LichSuThayDoiModel> LichSuThayDoi_Search(NhanSu_LichSuThayDoiModel LichSuThayDoi, out int totalRows)
        {
            List<NhanSu_LichSuThayDoiModel> LichSuList = new List<NhanSu_LichSuThayDoiModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@tbl_NhanSuId", LichSuThayDoi.tbl_NhanSuId ?? ""),  
                new SqlParameter("@PageIndex", LichSuThayDoi.pageIndex),
                new SqlParameter("@PageSize", LichSuThayDoi.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_LichSuThayDoi_Search", parameters))
            {
                while (reader.Read())
                {
                    NhanSu_LichSuThayDoiModel newLichSu = new NhanSu_LichSuThayDoiModel();
                    EntityBase.SetObjectValue(reader, ref newLichSu);
                    LichSuList.Add(newLichSu);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return LichSuList;
        }



           
        public static void LichSu_ThayDoi_Insert(string tbl_NhanSuId, string HoTenNguoiThayDoi, string tbl_Category_ChucVuId,
                                                string tbl_Category_ChucVuNguoiThayDoiId, string tbl_PhongBanId, string tbl_CoSoId,
                                                string Note, string ModifyDate, string C3, int RoleId, int checkTD)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@tbl_NhanSuId", tbl_NhanSuId ?? ""),
                new SqlParameter("@HoTenNguoiThayDoi", HoTenNguoiThayDoi ?? ""),
                new SqlParameter("@tbl_Category_ChucVuNguoiThayDoiId", tbl_Category_ChucVuNguoiThayDoiId ?? ""), 
                new SqlParameter("@tbl_Category_ChucVuId", tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@tbl_PhongBanId", tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_CoSoId", tbl_CoSoId ?? ""),
                new SqlParameter("@Note", Note ?? ""),
                new SqlParameter("@ModifyDate", ModifyDate ?? ""),
                new SqlParameter("@C3", C3 ?? ""),
                new SqlParameter("@RoleId", RoleId),
                new SqlParameter("@checkTD", checkTD),
            };
            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_LichSu_ThayDoi_Insert", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }

    }
}
