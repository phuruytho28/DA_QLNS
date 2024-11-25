using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyNhanSu_WebApp.DataAccessLayer
{
    public class DashboardDAL
    { 
        public static DashboardModel Dashboard_GetById(string tbl_CompanyId, string tbl_PhongBanId, string tbl_CoSoId, string tbl_NhanSuId)
        {
            DashboardModel Dashboard = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@tbl_NhanSuId", tbl_NhanSuId ?? ""),
                new SqlParameter("@tbl_PhongBanId", tbl_PhongBanId ?? ""),
                new SqlParameter("@tbl_CoSoId", tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_CompanyId", tbl_CompanyId ?? "")
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("Dashboard_GetData", parameters))
                {
                    if (reader.Read())
                    {
                        Dashboard = new DashboardModel();
                        EntityBase.SetObjectValue(reader, ref Dashboard);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi Dashboard Id: {ex.Message}");
            }

            return Dashboard;
        }  
    }
}
