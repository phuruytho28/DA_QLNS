using QuanLyNhanSu_WebApp.Controllers.CommonController;
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp.Controllers
{
    public class RegisterController : Controller
    {
        [AllowAnonymous]
        // GET: Register
        public ActionResult RegisterView()
        {
            if (Session["RoleId"] != null)
            {
                // Nếu đã đăng nhập, chuyển hướng đến trang Home
                return RedirectToAction("DashboardView", "Dashboard");
            }
            return View();
        }
        [HttpPost]
        [AllowAnonymous]
        public JsonResult Save(AccountModel account)
        {
            var response = new JsonResponse();
            try
            {
                string result = string.Empty; 
                account.CreatedDate = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss");

                if (string.IsNullOrEmpty(account.Id))  
                {
                    string newAccountId = AccountDAL.InsertAccount(account);

                    string test = account.Id;
                    if (!string.IsNullOrEmpty(newAccountId))
                    {
                        response.Success = true;
                        response.Message = "Đăng ký tài khoản thành công!";
                        response.Data = newAccountId; 
                    }
                    else
                    {
                        response.Success = false;
                        response.Message = "Email đã tồn tại";
                    }
                }
                else
                {
                     
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return Json(response);
        }

        [CustomAuthorize]
        public JsonResult Save_NhanVien(AccountModel account)
        {
            var response = new JsonResponse();
            try
            {
                string result = string.Empty;
                account.CreatedDate = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss");

                if (string.IsNullOrEmpty(account.Id))
                {
                    string newAccountId = AccountDAL.InsertAccount_NhanVien(account);

                    string test = account.Id;
                    if (!string.IsNullOrEmpty(newAccountId))
                    {
                        response.Success = true;
                        response.Message = "Đăng ký tài khoản thành công!";
                        response.Data = newAccountId;
                    }
                    else
                    {
                        response.Success = false;
                        response.Message = "Email đã tồn tại";
                    }
                }
                else
                {

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