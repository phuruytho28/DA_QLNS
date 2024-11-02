using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyTinhHuyen_WebApp.DataAccessLayer
{
    public class TinhHuyenDAL
    {
        public static List<TinhHuyenModel> Tinh_GetById(string id = null)
        {
            List<TinhHuyenModel> tinhHuyenList = new List<TinhHuyenModel>();

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id ?? "")  
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_Tinh_GetById", parameters))
                {
                    while (reader.Read())
                    {
                        TinhHuyenModel tinhHuyen = new TinhHuyenModel();
                        EntityBase.SetObjectValue(reader, ref tinhHuyen);
                        tinhHuyenList.Add(tinhHuyen);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error retrieving TinhThanh data: {ex.Message}");
            }

            return tinhHuyenList;
        }


        public static List<TinhHuyenModel> Huyen_GetById(string id)
        {
            List<TinhHuyenModel> danhSachTinhHuyen = new List<TinhHuyenModel>();  

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_Huyen_GetById", parameters))
                {
                    while (reader.Read())  
                    {
                        TinhHuyenModel TinhHuyen = new TinhHuyenModel();
                        EntityBase.SetObjectValue(reader, ref TinhHuyen);
                        danhSachTinhHuyen.Add(TinhHuyen);  
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi TinhHuyen Id: {ex.Message}");
            }

            return danhSachTinhHuyen;  
        }

    }
}
