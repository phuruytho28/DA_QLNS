using QuanLyNhanSu_WebApp.Controllers.CommonController;
using QuanLyNhanSu_WebApp.DataAccessLayer;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp.Controllers
{
    [CustomAuthorize]
    public class DashboardController : Controller
    { 
        // GET: Dashboard
        public ActionResult DashboardView()
        {
            return View();
        }


        [HttpPost]
        public JsonResult GetDashboardById(string tbl_CompanyId, string tbl_PhongBanId, string tbl_CoSoId, string tbl_NhanSuId)
        {
            var response = new JsonResponse();
            try
            {
                var Dashboard = DashboardDAL.Dashboard_GetById(tbl_CompanyId, tbl_PhongBanId, tbl_CoSoId, tbl_NhanSuId);
                if (Dashboard != null)
                {
                    response.Success = true;
                    response.Data = Dashboard;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy cơ sở với Id này.";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return Json(response);
        }
    }
}