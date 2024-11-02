using QuanLyNhanSu_WebApp.Models;
using System;
using System.Data.SqlClient;
using System.Security.Principal;
using Microsoft.AspNet.Identity;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Printing;
using System.Web.Razor.Tokenizer.Symbols;

namespace QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL
{
    public class CompanyDAL
    {  
        public static CompanyModel GetCompanyId(string userId)
        {
            CompanyModel infoCompany = null;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@tbl_AccountId", userId ?? "")
            };

            using (var reader = DataAccessHelper.ExecuteReader("tbl_Company_GetById", parameters))
            {
                if (reader.Read())
                {
                    infoCompany = new CompanyModel();
                    EntityBase.SetObjectValue(reader, ref infoCompany);
                }
            }

            return infoCompany;
        }
        public List<CompanyModel> CompanySearch(CompanyModel company, out int totalRows)
        {
            List<CompanyModel> companyList = new List<CompanyModel>();
            totalRows = 0;

            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Keyword", company.Keyword ?? ""),
                new SqlParameter("@tbl_AccountId", company.tbl_AccountId ?? ""), 
                new SqlParameter("@StatusId", company.StatusId),
                new SqlParameter("@PageIndex", company.pageIndex),
                new SqlParameter("@PageSize", company.pageSize),
                new SqlParameter("@TotalRow", SqlDbType.Int) { Direction = ParameterDirection.Output }
            };

            using (SqlDataReader reader = DataAccessHelper.ExecuteReader("tbl_Company_Search", parameters))
            {
                while (reader.Read())
                {
                    CompanyModel newcompany = new CompanyModel();
                    EntityBase.SetObjectValue(reader, ref newcompany);
                    companyList.Add(newcompany);
                }
            }

            totalRows = int.Parse(parameters[parameters.Length - 1].Value.ToString());

            return companyList;
        }
    }
}
