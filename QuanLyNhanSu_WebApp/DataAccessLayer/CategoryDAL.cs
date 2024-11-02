using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Razor.Tokenizer.Symbols;
using System.Web.Security;
using System.Xml.Linq;

namespace QuanLyNhanSu_WebApp.DataAccessLayer
{
    public class CategoryDAL
    {
        public List<CategoryModel> Category_Search(CategoryModel Category, out int totalRows)
        {
            List<CategoryModel> CategoryList = new List<CategoryModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Keyword", Category.Keyword ?? ""), 
                new SqlParameter("@PhanLoaiDM", Category.PhanLoaiDM ?? ""), 
                new SqlParameter("@RoleId", Category.RoleId),   
                new SqlParameter("@tbl_CompanyId", Category.tbl_CompanyId ?? ""), 
                new SqlParameter("@tbl_CoSoId", Category.tbl_CoSoId ?? ""), 
                new SqlParameter("@tbl_PhongBanId", Category.tbl_PhongBanId ?? ""), 
                new SqlParameter("@TinhTrang", Category.TinhTrang),
                new SqlParameter("@StatusId", Category.StatusId),
                new SqlParameter("@PageIndex", Category.pageIndex),
                new SqlParameter("@PageSize", Category.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_Category_Search", parameters))
            {
                while (reader.Read())
                {
                    CategoryModel newCategory = new CategoryModel();
                    EntityBase.SetObjectValue(reader, ref newCategory);
                    CategoryList.Add(newCategory);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return CategoryList;
        }
        public List<CategoryModel> Category_Search_Private(CategoryModel Category, out int totalRows)
        {
            List<CategoryModel> CategoryList = new List<CategoryModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Keyword", Category.Keyword ?? ""),
                new SqlParameter("@PhanLoaiDM", Category.PhanLoaiDM ?? ""),
                new SqlParameter("@RoleId", Category.RoleId),
                new SqlParameter("@tbl_CompanyId", Category.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", Category.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", Category.tbl_PhongBanId ?? ""),
                new SqlParameter("@TinhTrang", Category.TinhTrang),
                new SqlParameter("@StatusId", Category.StatusId),
                new SqlParameter("@PageIndex", Category.pageIndex),
                new SqlParameter("@PageSize", Category.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_Category_Search_Private", parameters))
            {
                while (reader.Read())
                {
                    CategoryModel newCategory = new CategoryModel();
                    EntityBase.SetObjectValue(reader, ref newCategory);
                    CategoryList.Add(newCategory);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return CategoryList;
        }
        public static string Category_Insert(CategoryModel Category, ref string newId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            { 
                new SqlParameter("@Name", Category.Name),
                new SqlParameter("@MoTa", Category.MoTa),
                new SqlParameter("@PhanLoaiDM", Category.PhanLoaiDM ?? ""),
                new SqlParameter("@RoleId", Category.RoleId),
                new SqlParameter("@tbl_CompanyId", Category.tbl_CompanyId ?? ""), 
                new SqlParameter("@tbl_CoSoId", Category.tbl_CoSoId ?? ""), 
                new SqlParameter("@tbl_PhongBanId", Category.tbl_PhongBanId ?? ""), 
                new SqlParameter("@TinhTrang", Category.TinhTrang), 
                new SqlParameter("@StatusId", Category.StatusId),
                new SqlParameter("@CreatedDate", Category.CreatedDate),
                new SqlParameter("@CreatedBy", Category.CreatedBy), 
                new SqlParameter("@Note", Category.Note ?? ""), 
                new SqlParameter("@DanhMucChaId", Category.DanhMucChaId ?? ""), 
                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }  
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_Category_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();  
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error inserting Category: {ex.Message}");
            }

            return newId;
        } 
        public static void Category_Update(CategoryModel Category)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", Category.Id),
                new SqlParameter("@Name", Category.Name),
                new SqlParameter("@MoTa", Category.MoTa),
                new SqlParameter("@PhanLoaiDM", Category.PhanLoaiDM ?? ""),
                new SqlParameter("@RoleId", Category.RoleId),
                new SqlParameter("@tbl_CompanyId", Category.tbl_CompanyId ?? ""),
                new SqlParameter("@tbl_CoSoId", Category.tbl_CoSoId ?? ""),
                new SqlParameter("@tbl_PhongBanId", Category.tbl_PhongBanId ?? ""),
                new SqlParameter("@TinhTrang", Category.TinhTrang),
                new SqlParameter("@StatusId", Category.StatusId),
                new SqlParameter("@ModifyDate", Category.ModifyDate),
                new SqlParameter("@ModifyBy", Category.CreatedBy),
                new SqlParameter("@Note", Category.Note ?? ""),
                new SqlParameter("@DanhMucChaId", Category.DanhMucChaId ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_Category_Update", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating Category: {ex.Message}");
            }
        }
        
        public static List<CategoryModel> Category_GetById(string id = null)
        {
            List<CategoryModel> categoryList = new List<CategoryModel>();

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id ?? "")
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_Category_GetById", parameters))
                {
                    while (reader.Read())
                    {
                        CategoryModel category = new CategoryModel();
                        EntityBase.SetObjectValue(reader, ref category);
                        categoryList.Add(category);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error retrieving TinhThanh data: {ex.Message}");
            }

            return categoryList;
        }

        public static void Category_UpdateStatusId(CategoryModel Category)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", Category.C1),
                new SqlParameter("@StatusId", Category.StatusId),
                new SqlParameter("@Note", Category.Note ?? ""),
                new SqlParameter("@ModifyDate", Category.ModifyDate),
                new SqlParameter("@ModifyBy", Category.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_Category_UpdateStatusId", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }

    }
}
