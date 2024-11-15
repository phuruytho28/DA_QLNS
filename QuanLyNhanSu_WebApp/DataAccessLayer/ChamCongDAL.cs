using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Models;
using Swashbuckle.Swagger;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.Web.Razor.Tokenizer.Symbols;

namespace QuanLyNhanSu_WebApp.DataAccessLayer
{
    public class ChamCongDAL
    { 
        public List<ChamCongModel> ChamCong_Search(ChamCongModel ChamCong, out int totalRows)
        {
            List<ChamCongModel> ChamCongList = new List<ChamCongModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@tbl_CompanyId", ChamCong.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", ChamCong.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", ChamCong.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", ChamCong.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", ChamCong.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@Ngay", ChamCong.Ngay),
                new SqlParameter("@Thang", ChamCong.Thang),
                new SqlParameter("@Nam", ChamCong.Nam),
                new SqlParameter("@StatusId", ChamCong.StatusId),
                new SqlParameter("@TinhTrang", ChamCong.TinhTrang),
                new SqlParameter("@PageIndex", ChamCong.pageIndex),
                new SqlParameter("@PageSize", ChamCong.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_ChamCong_Search", parameters))
            {
                while (reader.Read())
                {
                    ChamCongModel newChamCong = new ChamCongModel();
                    EntityBase.SetObjectValue(reader, ref newChamCong);
                    ChamCongList.Add(newChamCong);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return ChamCongList;
        }
        public static string ChamCong_Insert(ChamCongModel ChamCong, ref string newId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Ngay", ChamCong.Ngay),
                new SqlParameter("@Thang", ChamCong.Thang),
                new SqlParameter("@Nam", ChamCong.Nam),
                new SqlParameter("@GioVao", ChamCong.GioVao ?? ""),
                new SqlParameter("@GioRa", ChamCong.GioRa ?? ""),
                new SqlParameter("@TongSoGio", ChamCong.TongSoGio),
                new SqlParameter("@LuongTamTinh", ChamCong.LuongTamTinh), 
                new SqlParameter("@LuongThangHDLD", ChamCong.LuongThangHDLD),
                new SqlParameter("@SoCongHDLD", ChamCong.SoCongHDLD),
                new SqlParameter("@tbl_CompanyId", ChamCong.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", ChamCong.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", ChamCong.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", ChamCong.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", ChamCong.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@TinhTrang", ChamCong.TinhTrang),
                new SqlParameter("@RoleId", ChamCong.RoleId),
                new SqlParameter("@StatusId", ChamCong.StatusId),
                new SqlParameter("@CreatedDate", ChamCong.CreatedDate ?? ""),
                new SqlParameter("@CreatedBy", ChamCong.CreatedBy ?? ""),
                new SqlParameter("@ModifyDate", ChamCong.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", ChamCong.ModifyBy ?? ""),
                new SqlParameter("@Note", ChamCong.Note ?? ""),
                new SqlParameter("@C1", ChamCong.C1 ?? ""),
                new SqlParameter("@C2", ChamCong.C2 ?? ""),
                new SqlParameter("@C3", ChamCong.C3 ?? ""),
                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }  
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_ChamCong_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();  
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error inserting ChamCong: {ex.Message}");
            }

            return newId;
        }
        public static void ChamCong_Update(ChamCongModel ChamCong)
        {
            SqlParameter[] parameters = new SqlParameter[]
            { 
                new SqlParameter("@Ngay", ChamCong.Ngay),
                new SqlParameter("@Thang", ChamCong.Thang),
                new SqlParameter("@Nam", ChamCong.Nam),
                new SqlParameter("@GioVao", ChamCong.GioVao ?? ""),
                new SqlParameter("@GioRa", ChamCong.GioRa ?? ""),
                new SqlParameter("@TongSoGio", ChamCong.TongSoGio),
                new SqlParameter("@LuongTamTinh", ChamCong.LuongTamTinh), 
                new SqlParameter("@LuongThangHDLD", ChamCong.LuongThangHDLD),
                new SqlParameter("@SoCongHDLD", ChamCong.SoCongHDLD),

                new SqlParameter("@tbl_CompanyId", ChamCong.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", ChamCong.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", ChamCong.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", ChamCong.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", ChamCong.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@TinhTrang", ChamCong.TinhTrang),
                new SqlParameter("@RoleId", ChamCong.RoleId),
                new SqlParameter("@StatusId", ChamCong.StatusId),

                new SqlParameter("@ModifyDate", ChamCong.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", ChamCong.ModifyBy ?? ""),
                new SqlParameter("@Note", ChamCong.Note ?? ""),

                new SqlParameter("@C1", ChamCong.C1 ?? ""),
                new SqlParameter("@C2", ChamCong.C2 ?? ""),
                new SqlParameter("@C3", ChamCong.C3 ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_ChamCong_Update", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating ChamCong: {ex.Message}");
            }
        }
        public static ChamCongModel ChamCong_GetById(string id)
        {
            ChamCongModel ChamCong = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_ChamCong_GetById", parameters))
                {
                    if (reader.Read())
                    {
                        ChamCong = new ChamCongModel();
                        EntityBase.SetObjectValue(reader, ref ChamCong);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi ChamCong Id: {ex.Message}");
            }

            return ChamCong;
        }
        public static ChamCongModel ChamCong_GetByNhanSuId(string tbl_NhanSuId)
        {
            ChamCongModel ChamCong = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@tbl_NhanSuId", tbl_NhanSuId)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_ChamCong_GetByNhanSuId", parameters))
                {
                    if (reader.Read())
                    {
                        ChamCong = new ChamCongModel();
                        EntityBase.SetObjectValue(reader, ref ChamCong);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi ChamCong Id: {ex.Message}");
            }

            return ChamCong;
        }
        public static void ChamCong_UpdateStatusId(ChamCongModel ChamCong)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", ChamCong.C1),
                new SqlParameter("@TinhTrang", ChamCong.TinhTrang), 
                new SqlParameter("@StatusId", ChamCong.StatusId),
                new SqlParameter("@Note", ChamCong.Note ?? ""),
                new SqlParameter("@ModifyDate", ChamCong.ModifyDate),
                new SqlParameter("@ModifyBy", ChamCong.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_ChamCong_UpdateTinhTrang", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }
        public static ChamCongModel ChamCong_GetByDate(int Ngay, int Thang, int Nam, string tbl_NhanSuId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Ngay", Ngay),
                new SqlParameter("@Thang", Thang),
                new SqlParameter("@Nam", Nam),
                new SqlParameter("@tbl_NhanSuId", tbl_NhanSuId ?? "")
            };

            ChamCongModel chamCong = null;

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_ChamCong_GetByDate", parameters))
            {
                if (reader.Read())
                {
                    chamCong = new ChamCongModel();
                    EntityBase.SetObjectValue(reader, ref chamCong);
                }
            }

            return chamCong;
        }




        //Chấm công theo tháng: Là số tiền tổng kết
        public static string ChamCongTheoThang_Insert(ChamCongModel ChamCong, ref string newId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Ngay", ChamCong.Ngay),
                new SqlParameter("@Thang", ChamCong.Thang),
                new SqlParameter("@Nam", ChamCong.Nam), 
                new SqlParameter("@Thuong1", ChamCong.Thuong1),
                new SqlParameter("@Thuong2", ChamCong.Thuong2),
                new SqlParameter("@Thuong3", ChamCong.Thuong3),
                new SqlParameter("@PhuCap1", ChamCong.PhuCap1),
                new SqlParameter("@PhuCap2", ChamCong.PhuCap2),
                new SqlParameter("@PhuCap3", ChamCong.PhuCap3),
                new SqlParameter("@KhoanTru1", ChamCong.KhoanTru1),
                new SqlParameter("@KhoanTru2", ChamCong.KhoanTru2),
                new SqlParameter("@KhoanTru3", ChamCong.KhoanTru3),
                new SqlParameter("@TongNgayLamThucTe", ChamCong.TongNgayLamThucTe),
                new SqlParameter("@TongLuongTamThoiThucTe", ChamCong.TongLuongTamThoiThucTe),

                new SqlParameter("@TongGioLamThucTe", ChamCong.TongGioLamThucTe),
                new SqlParameter("@TongLuongThucTe", ChamCong.TongLuongThucTe),
                new SqlParameter("@LuongThangHDLD", ChamCong.LuongThangHDLD),
                new SqlParameter("@SoCongHDLD", ChamCong.SoCongHDLD),
                new SqlParameter("@tbl_CompanyId", ChamCong.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", ChamCong.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", ChamCong.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", ChamCong.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", ChamCong.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@TinhTrang", ChamCong.TinhTrang),
                new SqlParameter("@RoleId", ChamCong.RoleId),
                new SqlParameter("@StatusId", ChamCong.StatusId),
                new SqlParameter("@CreatedDate", ChamCong.CreatedDate ?? ""),
                new SqlParameter("@CreatedBy", ChamCong.CreatedBy ?? ""),
                new SqlParameter("@ModifyDate", ChamCong.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", ChamCong.ModifyBy ?? ""),
                new SqlParameter("@Note", ChamCong.Note ?? ""),
                new SqlParameter("@C1", ChamCong.C1 ?? ""),
                new SqlParameter("@C2", ChamCong.C2 ?? ""),
                new SqlParameter("@C3", ChamCong.C3 ?? ""),
                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_ChamCongTheoThang_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error inserting ChamCong: {ex.Message}");
            }

            return newId;
        }
        public static void ChamCongTheoThang_Update(ChamCongModel ChamCong)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Ngay", ChamCong.Ngay),
                new SqlParameter("@Thang", ChamCong.Thang),
                new SqlParameter("@Nam", ChamCong.Nam), 
                new SqlParameter("@Thuong1", ChamCong.Thuong1),
                new SqlParameter("@Thuong2", ChamCong.Thuong2),
                new SqlParameter("@Thuong3", ChamCong.Thuong3),
                new SqlParameter("@PhuCap1", ChamCong.PhuCap1),
                new SqlParameter("@PhuCap2", ChamCong.PhuCap2),
                new SqlParameter("@PhuCap3", ChamCong.PhuCap3),
                new SqlParameter("@KhoanTru1", ChamCong.KhoanTru1),
                new SqlParameter("@KhoanTru2", ChamCong.KhoanTru2),
                new SqlParameter("@KhoanTru3", ChamCong.KhoanTru3),
                new SqlParameter("@TongNgayLamThucTe", ChamCong.TongNgayLamThucTe),
                new SqlParameter("@TongLuongTamThoiThucTe", ChamCong.TongLuongTamThoiThucTe),
                new SqlParameter("@TongGioLamThucTe", ChamCong.TongGioLamThucTe),
                new SqlParameter("@TongLuongThucTe", ChamCong.TongLuongThucTe),
                new SqlParameter("@LuongThangHDLD", ChamCong.LuongThangHDLD),
                new SqlParameter("@SoCongHDLD", ChamCong.SoCongHDLD),

                new SqlParameter("@tbl_CompanyId", ChamCong.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", ChamCong.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", ChamCong.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", ChamCong.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", ChamCong.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@TinhTrang", ChamCong.TinhTrang),
                new SqlParameter("@RoleId", ChamCong.RoleId),
                new SqlParameter("@StatusId", ChamCong.StatusId),

                new SqlParameter("@ModifyDate", ChamCong.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", ChamCong.ModifyBy ?? ""),
                new SqlParameter("@Note", ChamCong.Note ?? ""),

                new SqlParameter("@C1", ChamCong.C1 ?? ""),
                new SqlParameter("@C2", ChamCong.C2 ?? ""),
                new SqlParameter("@C3", ChamCong.C3 ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_ChamCongTheoThang_Update", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating ChamCong: {ex.Message}");
            }
        }
        public static ChamCongModel ChamCongTheoThang_GetByDate(int Ngay, int Thang, int Nam, string tbl_NhanSuId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Thang", Thang),
                new SqlParameter("@Nam", Nam),
                new SqlParameter("@tbl_NhanSuId", tbl_NhanSuId ?? "")
            };

            ChamCongModel chamCong = null;

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_ChamCongTheoThang_GetByDate", parameters))
            {
                if (reader.Read())
                {
                    chamCong = new ChamCongModel();
                    EntityBase.SetObjectValue(reader, ref chamCong);
                }
            }

            return chamCong;
        }
        public List<ChamCongModel> ChamCongTheoThang_Search(ChamCongModel ChamCong, out int totalRows)
        {
            List<ChamCongModel> ChamCongList = new List<ChamCongModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Keyword", ChamCong.Keyword ?? ""),
                new SqlParameter("@tbl_CoSoId", ChamCong.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", ChamCong.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", ChamCong.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", ChamCong.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@Ngay", ChamCong.Ngay),
                new SqlParameter("@Thang", ChamCong.Thang),
                new SqlParameter("@Nam", ChamCong.Nam),
                new SqlParameter("@StatusId", ChamCong.StatusId),
                new SqlParameter("@TinhTrang", ChamCong.TinhTrang),
                new SqlParameter("@PageIndex", ChamCong.pageIndex),
                new SqlParameter("@PageSize", ChamCong.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_ChamCongTheoThang_Search", parameters))
            {
                while (reader.Read())
                {
                    ChamCongModel newChamCong = new ChamCongModel();
                    EntityBase.SetObjectValue(reader, ref newChamCong);
                    ChamCongList.Add(newChamCong);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return ChamCongList;
        }

    }
}
