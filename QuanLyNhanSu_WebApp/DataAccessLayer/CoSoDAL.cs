using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace QuanLyNhanSu_WebApp.DataAccessLayer
{
    public class CoSoDAL
    {
        public List<CoSoModel> CoSo_Search(CoSoModel coSo, out int totalRows)
        {
            List<CoSoModel> coSoList = new List<CoSoModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@TenCoSo", coSo.TenCoSo ?? ""), 
                new SqlParameter("@tbl_CompanyId", coSo.tbl_CompanyId ?? ""), 
                new SqlParameter("@TinhTrang", coSo.TinhTrang),
                new SqlParameter("@StatusId", coSo.StatusId),
                new SqlParameter("@PageIndex", coSo.pageIndex),
                new SqlParameter("@PageSize", coSo.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_CoSo_Search", parameters))
            {
                while (reader.Read())
                {
                    CoSoModel newCoSo = new CoSoModel();
                    EntityBase.SetObjectValue(reader, ref newCoSo);
                    coSoList.Add(newCoSo);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());
            return coSoList;
        } 
        public static string CoSo_Insert(CoSoModel coSo, ref string newId)
        {
            SqlParameter[] parameters = new SqlParameter[]
            { 
                new SqlParameter("@TenCoSo", coSo.TenCoSo),
                new SqlParameter("@tbl_CompanyId", coSo.tbl_CompanyId), 
                new SqlParameter("@DiaChi", coSo.DiaChi ?? ""),
                new SqlParameter("@tbl_NhanSuId", coSo.tbl_NhanSuId ?? ""), 
                new SqlParameter("@StatusId", coSo.StatusId),
                new SqlParameter("@CreatedDate", coSo.CreatedDate),
                new SqlParameter("@CreatedBy", coSo.CreatedBy), 
                new SqlParameter("@Note", coSo.Note ?? ""), 
                new SqlParameter("@Id", SqlDbType.VarChar, 36) { Direction = ParameterDirection.Output }  
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_CoSo_Insert", parameters);
                newId = parameters[parameters.Length - 1].Value.ToString();  
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error inserting CoSo: {ex.Message}");
            }

            return newId;
        }
        public static void CoSo_Update(CoSoModel coSo)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", coSo.Id),
                new SqlParameter("@TenCoSo", coSo.TenCoSo),
                new SqlParameter("@tbl_CompanyId", coSo.tbl_CompanyId),
                new SqlParameter("@DiaChi", coSo.DiaChi ?? ""),
                new SqlParameter("@tbl_NhanSuId", coSo.tbl_NhanSuId ?? ""),
                new SqlParameter("@TinhTrang", coSo.TinhTrang),
                new SqlParameter("@StatusId", coSo.StatusId),
                new SqlParameter("@ModifyDate", coSo.ModifyDate),
                new SqlParameter("@ModifyBy", coSo.CreatedBy),
                new SqlParameter("@Note", coSo.Note ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_CoSo_Update", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating CoSo: {ex.Message}");
            }
        }
        public static CoSoModel CoSo_GetById(string id)
        {
            CoSoModel coSo = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            try
            {
                using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_CoSo_GetById", parameters))
                {
                    if (reader.Read())
                    {
                        coSo = new CoSoModel();
                        EntityBase.SetObjectValue(reader, ref coSo);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception($"lỗi CoSo Id: {ex.Message}");
            }

            return coSo;
        } 
        public static void CoSo_UpdateStatusId(CoSoModel coSo)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Id", coSo.C1),
                new SqlParameter("@StatusId", coSo.StatusId),
                new SqlParameter("@Note", coSo.Note ?? ""),
                new SqlParameter("@ModifyDate", coSo.ModifyDate),
                new SqlParameter("@ModifyBy", coSo.ModifyBy ?? "")
            };

            try
            {
                DataAccessHelper.ExecuteNonQuery("tbl_CoSo_UpdateStatusId", parameters);
            }
            catch (SqlException ex)
            {
                throw new Exception($"Error updating status: {ex.Message}");
            }
        }

    }
}
