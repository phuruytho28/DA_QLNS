using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.DataAccessLayer
{
    public class RoleInNavbarDAL
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        // Phương thức để lấy tất cả bản ghi
        public List<RoleInNavbarModel> GetAll()
        {
            List<RoleInNavbarModel> roles = new List<RoleInNavbarModel>();
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("SELECT * FROM tbl_RoleInNavbar", con))
                    {
                        con.Open();
                        using (SqlDataReader rdr = cmd.ExecuteReader())
                        {
                            while (rdr.Read())
                            {
                                roles.Add(new RoleInNavbarModel
                                {
                                    Id = rdr["Id"].ToString(),
                                    FunctionName = rdr["FunctionName"].ToString(),
                                    tblAcconut_RoleId = rdr["tblAcconut_RoleId"].ToString(),
                                    BranchInNav = Convert.ToInt32(rdr["BranchInNav"]),
                                    PositionInNav = Convert.ToInt32(rdr["PositionInNav"]),
                                    PathInFolder = rdr["PathInFolder"].ToString(),
                                    StatusId = Convert.ToInt32(rdr["StatusId"]),
                                    CreatedDate = Convert.ToDateTime(rdr["CreatedDate"]),
                                    Note = rdr["Note"].ToString(),
                                    C1 = rdr["C1"].ToString(),
                                    C2 = rdr["C2"].ToString(),
                                    C3 = rdr["C3"].ToString()
                                });
                            }
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception("Error in GetAll: " + ex.Message);
            }
            return roles;
        }
    }
}