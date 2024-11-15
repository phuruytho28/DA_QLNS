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
    public class HDLD_lstBangLuongDAL
    {
        public List<HDLD_lstBangLuongModel> HDLD_lstBangLuong_Search(HDLD_lstBangLuongModel HDLD_lstBangLuong, out int totalRows)
        {
            List<HDLD_lstBangLuongModel> HDLD_lstBangLuongList = new List<HDLD_lstBangLuongModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {  
                new SqlParameter("@Keyword", HDLD_lstBangLuong.Keyword ?? ""),
                new SqlParameter("@tbl_CompanyId", HDLD_lstBangLuong.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", HDLD_lstBangLuong.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", HDLD_lstBangLuong.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", HDLD_lstBangLuong.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", HDLD_lstBangLuong.tbl_Category_ChucVuId ?? ""),
                new SqlParameter("@StatusId", HDLD_lstBangLuong.StatusId),
                new SqlParameter("@TinhTrang", HDLD_lstBangLuong.TinhTrang),
                new SqlParameter("@PageIndex", HDLD_lstBangLuong.pageIndex),
                new SqlParameter("@PageSize", HDLD_lstBangLuong.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_HDLD_lstBangLuong_Search", parameters))
            {
                while (reader.Read())
                {
                    HDLD_lstBangLuongModel newHDLD_lstBangLuong = new HDLD_lstBangLuongModel();
                    EntityBase.SetObjectValue(reader, ref newHDLD_lstBangLuong);
                    HDLD_lstBangLuongList.Add(newHDLD_lstBangLuong);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return HDLD_lstBangLuongList;
        } 


        public static string HDLD_lstBangLuong_Insert(HDLD_lstBangLuongModel HDLD_lstBangLuong, ref string newId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@MaHD", HDLD_lstBangLuong.MaHD ?? ""),
                new SqlParameter("@LoaiHD", HDLD_lstBangLuong.LoaiHD),
                new SqlParameter("@TenHD", HDLD_lstBangLuong.TenHD ?? ""),
                new SqlParameter("@NgayTaoHD", HDLD_lstBangLuong.NgayTaoHD ?? ""),
                new SqlParameter("@NgayKyHD", HDLD_lstBangLuong.NgayKyHD ?? ""),
                new SqlParameter("@MucLuongKyHD", HDLD_lstBangLuong.MucLuongKyHD),
                new SqlParameter("@MucTienBH", HDLD_lstBangLuong.MucTienBH),  
                new SqlParameter("@SoCongHangThang", HDLD_lstBangLuong.SoCongHangThang),

                new SqlParameter("@tbl_CompanyId", HDLD_lstBangLuong.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", HDLD_lstBangLuong.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", HDLD_lstBangLuong.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", HDLD_lstBangLuong.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", HDLD_lstBangLuong.tbl_Category_ChucVuId ?? ""),

                new SqlParameter("@StatusId", HDLD_lstBangLuong.StatusId),
                new SqlParameter("@RoleId", HDLD_lstBangLuong.RoleId),
                new SqlParameter("@TinhTrang", HDLD_lstBangLuong.TinhTrang),

                new SqlParameter("@MoTaChiTiet", HDLD_lstBangLuong.MoTaChiTiet ?? ""),
                new SqlParameter("@CreatedDate", HDLD_lstBangLuong.CreatedDate ?? ""),
                new SqlParameter("@CreatedBy", HDLD_lstBangLuong.CreatedBy ?? ""),
                new SqlParameter("@ModifyDate", HDLD_lstBangLuong.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", HDLD_lstBangLuong.ModifyBy ?? ""),
                new SqlParameter("@Note", HDLD_lstBangLuong.Note ?? ""),

                new SqlParameter("@C1", HDLD_lstBangLuong.C1 ?? ""),
                new SqlParameter("@C2", HDLD_lstBangLuong.C2 ?? ""),
                new SqlParameter("@C3", HDLD_lstBangLuong.C3 ?? ""),
                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }  
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_HDLD_lstBangLuong_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();  
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error inserting HDLD_lstBangLuong: {ex.Message}");
            }

            return newId;
        }
        public static void HDLD_lstBangLuong_Update(HDLD_lstBangLuongModel HDLD_lstBangLuong)
        {
            SqlParameter[] parameters = new SqlParameter[]
            { 
                new SqlParameter("@MaHD", HDLD_lstBangLuong.MaHD ?? ""),
                new SqlParameter("@LoaiHD", HDLD_lstBangLuong.LoaiHD),
                new SqlParameter("@TenHD", HDLD_lstBangLuong.TenHD ?? ""),
                new SqlParameter("@NgayTaoHD", HDLD_lstBangLuong.NgayTaoHD ?? ""),
                new SqlParameter("@NgayKyHD", HDLD_lstBangLuong.NgayKyHD ?? ""),
                new SqlParameter("@MucLuongKyHD", HDLD_lstBangLuong.MucLuongKyHD),
                new SqlParameter("@MucTienBH", HDLD_lstBangLuong.MucTienBH),
                new SqlParameter("@SoCongHangThang", HDLD_lstBangLuong.SoCongHangThang),

                new SqlParameter("@tbl_CompanyId", HDLD_lstBangLuong.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", HDLD_lstBangLuong.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", HDLD_lstBangLuong.tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_NhanSuId", HDLD_lstBangLuong.tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_Category_ChucVuId", HDLD_lstBangLuong.tbl_Category_ChucVuId ?? ""),

                new SqlParameter("@StatusId", HDLD_lstBangLuong.StatusId),
                new SqlParameter("@RoleId", HDLD_lstBangLuong.RoleId),
                new SqlParameter("@TinhTrang", HDLD_lstBangLuong.TinhTrang),

                new SqlParameter("@MoTaChiTiet", HDLD_lstBangLuong.MoTaChiTiet ?? ""), 
                new SqlParameter("@ModifyDate", HDLD_lstBangLuong.ModifyDate ?? ""),
                new SqlParameter("@ModifyBy", HDLD_lstBangLuong.CreatedBy ?? ""),
                new SqlParameter("@Note", HDLD_lstBangLuong.Note ?? ""),

                new SqlParameter("@C1", HDLD_lstBangLuong.C1 ?? ""),
                new SqlParameter("@C2", HDLD_lstBangLuong.C2 ?? ""),
                new SqlParameter("@C3", HDLD_lstBangLuong.C3 ?? ""), 
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_HDLD_lstBangLuong_Update", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating HDLD_lstBangLuong: {ex.Message}");
            }
        }


        public static HDLD_lstBangLuongModel HDLD_lstBangLuong_GetById(string id)
        {
            HDLD_lstBangLuongModel HDLD_lstBangLuong = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_HDLD_lstBangLuong_GetById", parameters))
                {
                    if (reader.Read())
                    {
                        HDLD_lstBangLuong = new HDLD_lstBangLuongModel();
                        EntityBase.SetObjectValue(reader, ref HDLD_lstBangLuong);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi HDLD_lstBangLuong Id: {ex.Message}");
            }

            return HDLD_lstBangLuong;
        } 
        public static HDLD_lstBangLuongModel HDLD_lstBangLuong_GetByNhanSuId(string tbl_NhanSuId)
        {
            HDLD_lstBangLuongModel HDLD_lstBangLuong = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@tbl_NhanSuId", tbl_NhanSuId)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_HDLD_lstBangLuong_GetByNhanSuId", parameters))
                {
                    if (reader.Read())
                    {
                        HDLD_lstBangLuong = new HDLD_lstBangLuongModel();
                        EntityBase.SetObjectValue(reader, ref HDLD_lstBangLuong);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi HDLD_lstBangLuong Id: {ex.Message}");
            }

            return HDLD_lstBangLuong;
        } 
        public static void HDLD_lstBangLuong_UpdateStatusId(HDLD_lstBangLuongModel HDLD_lstBangLuong)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", HDLD_lstBangLuong.C1),
                new SqlParameter("@TinhTrang", HDLD_lstBangLuong.TinhTrang), 
                new SqlParameter("@StatusId", HDLD_lstBangLuong.StatusId),
                new SqlParameter("@Note", HDLD_lstBangLuong.Note ?? ""),
                new SqlParameter("@ModifyDate", HDLD_lstBangLuong.ModifyDate),
                new SqlParameter("@ModifyBy", HDLD_lstBangLuong.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_HDLD_lstBangLuong_UpdateTinhTrang", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }

        public static List<HDLD_lstBangLuongModel> GetNhanSuList()
        {
            List<HDLD_lstBangLuongModel> nhanSuList = new List<HDLD_lstBangLuongModel>();

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_HDLD_lstBangLuong_GetByFullNhanSuId", null))
                {
                    while (reader.Read())
                    {
                        HDLD_lstBangLuongModel nhanSu = new HDLD_lstBangLuongModel
                        {
                            tbl_NhanSuName = reader["tbl_NhanSuName"].ToString(),
                            tbl_NhanSuId = reader["tbl_NhanSuId"].ToString()
                        };
                        nhanSuList.Add(nhanSu);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error retrieving NhanSu list: {ex.Message}");
            }

            return nhanSuList;
        }

    }
}
