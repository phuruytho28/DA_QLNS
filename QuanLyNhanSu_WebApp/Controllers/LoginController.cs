using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.Controllers.CommonController;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Services.Description;

namespace QuanLyNhanSu_WebApp.Controllers
{
    public class LoginController : Controller
    {
        [AllowAnonymous]
        // GET: Login
        public ActionResult LoginView()
        {
            if(Session["RoleId"] != null) { 
                return RedirectToAction("DashboardView", "Dashboard");
            }
            return View();
        }

        

        [HttpPost]
        [AllowAnonymous]
        public ActionResult CheckLogin(string gmail, string password)
        {
            var account = AccountDAL.VerifyLogin(gmail, password);

            if (account != null)
            {
                if (account.StatusId != 1)
                {
                    return Json(new { Success = false, Message = "Tài khoản chưa được kích hoạt hoặc đã bị vô hiệu hóa, vui lòng liên hệ Admin để thử lại!" });
                }
                else { 
                // Đăng nhập thành công
                Session["RoleId"] = account.RoleId;
                Session["UserId"] = account.Id;
                Session["UserName"] = account.Name;
                Session["CompanyId"] = account.CompanyId;

                //var infoCompany = CompanyDAL.GetCompanyId(account.Id);
                //if(infoCompany != null)
                //{
                //    Session["CompanyId"] =  infoCompany.Id;
                //}

                return Json(new { Success = true, Account = account, RedirectUrl = Url.Action("DasboardView", "Dasboard") });
                }
            }
            else
            { 
                return Json(new { Success = false, Message = "Sai email hoặc mật khẩu, vui lòng kiểm tra lại." });
            }
        }

        [HttpGet]
        public JsonResult GetSessionVariables()
        {
            var sessionVariables = new
            {
                CompanyId = Session["CompanyId"],
                RoleId = Session["RoleId"],
                UserId = Session["UserId"],
                UserName = Session["UserName"]
            };

            return Json(sessionVariables, JsonRequestBehavior.AllowGet);
        }


        public ActionResult Logout()
        { 
            Session["RoleId"] = null;
            Session["UserId"] = null;
             
            return RedirectToAction("LoginView");
        }
        [CustomAuthorize]
        [HttpGet]
        public ActionResult UpdateAcountView()
        {
            return View();
        }

        [HttpPost]
        [CustomAuthorize]  
        public ActionResult UpdatePassword(string oldPassword, string newPassword)
        {
            var accountId = Session["UserId"]?.ToString();  

            if (accountId == null)
            {
                return Json(new { Success = false, Message = "Người dùng không được xác thực." });
            }

            var account = AccountDAL.GetAccountById(accountId); 

            if (account == null)
            {
                return Json(new { Success = false, Message = "Không tìm thấy tài khoản." });
            }

            var passwordHasher = new PasswordHasher();
            var result = passwordHasher.VerifyHashedPassword(account.HasPassword, oldPassword);

            if (result != PasswordVerificationResult.Success)
            {
                return Json(new { Success = false, Message = "Mật khẩu cũ không chính xác." });
            }
            account.Password = newPassword;
            account.HasPassword = passwordHasher.HashPassword(newPassword);

            bool isUpdated = AccountDAL.UpdateAccountPassword(account);  

            if (isUpdated)
            {
                return Json(new { Success = true });
            }
            else
            {
                return Json(new { Success = false, Message = "Có lỗi xảy ra khi cập nhật mật khẩu." });
            }
        }

    }
}
