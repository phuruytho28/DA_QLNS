using System;
using System.Web.Mvc;
using QuanLyNhanSu_WebApp.Models;  
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.DataAccessLayer;
using System.Collections.Generic;

namespace QuanLyNhanSu_WebApp.Controllers
{
    public class CompanyController : Controller
    {
        List<CompanyModel> companyList = new List<CompanyModel>();
        private readonly CompanyDAL comapnyDAL = new CompanyDAL();
        [CustomAuthorize]
        // GET: Company  


        [HttpPost]
        public JsonResult CompanySearch(CompanyModel company)
        {
            int totalRows = 0;
            List<CompanyModel> companyList = new List<CompanyModel>();

            try
            {
                companyList = comapnyDAL.CompanySearch(company, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = companyList,
                    TotalRows = totalRows
                });
            }
            catch (Exception ex)
            {

                return Json(new
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi tìm kiếm dữ liệu.",
                    ErrorDetails = ex.Message
                });
            }
        }

    }
}
