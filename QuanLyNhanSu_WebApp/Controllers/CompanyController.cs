using System;
using System.Web.Mvc;
using QuanLyNhanSu_WebApp.Models;  
using QuanLyNhanSu_WebApp.DataAccessLayer.CommonDAL;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.DataAccessLayer;
using System.Collections.Generic;
using QuanLyNhanSu_WebApp.Controllers.CommonController;
using System.Data.SqlClient;
using Microsoft.AspNet.Identity;

namespace QuanLyNhanSu_WebApp.Controllers
{
    [CustomAuthorize]
    public class CompanyController : Controller
    {
        [CustomAuthorize]
        public ActionResult CompanyView()
        {
            return View();
        }
        public ActionResult CompanyDetailView()
        {
            return View();
        }
        List<CompanyModel> companyList = new List<CompanyModel>();
        private readonly CompanyDAL comapnyDAL = new CompanyDAL(); 
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

        [HttpPost]
        public JsonResult save(CompanyModel obj)
        {
            var response = new JsonResponse();
            try
            {
                if (!string.IsNullOrEmpty(obj.Id))
                {
                    obj.ModifyDate = DateTime.Now.ToString();
                    CompanyDAL.Company_Update(obj);
                    response.Success = true;
                    response.Message = "Cập nhật thành công!";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return Json(response);
        }
        [HttpPost]
        public JsonResult GetCompanyId(string id)
        {
            var response = new JsonResponse();
            try
            {
                var Company = CompanyDAL.GetCompanyId_Info(id);
                if (Company != null)
                {
                    response.Success = true;
                    response.Data = Company;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy dữ liệu với Id này.";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return Json(response);
        }
        [HttpPost]
        public JsonResult UpdateStatusId(CompanyModel Company)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(Company.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (Company.StatusId < 0)
                {
                    response.Success = false;
                    response.Message = "Tình trạng không hợp lệ.";
                    return Json(response);
                }

                Company.ModifyDate = DateTime.Now.ToString();

                CompanyDAL.Company_UpdateStatusId(Company);
                var trangthai = "";
                if (Company.StatusId > 0)
                {
                    switch (Company.StatusId)
                    {
                        case 1:
                            trangthai = "khôi phục trạng thái hoạt động";
                            break;
                        case 2:
                            trangthai = "được chuyển vào thùng rác";
                            break;
                    }
                } 

                response.Success = true;
                response.Message = "Công ty đã " + trangthai;
            }
            catch (SqlException sqlEx)
            {
                response.Success = false;
                response.Message = $"Lỗi SQL: {sqlEx.Message}";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Đã xảy ra lỗi khi cập nhật trạng thái: {ex.Message}";
            }

            return Json(response);
        }


        //dùng tạm controller cho account
        [CustomAuthorize] 
        public ActionResult ListAccountView()
        {
            return View();
        }  

        [HttpPost]
        public JsonResult AccountSearch(AccountModel Account)
        {
            int totalRows = 0;
            List<AccountModel> AccountList = new List<AccountModel>();

            try
            {
                AccountList = AccountDAL.AccountSearch(Account, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = AccountList,
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

        [HttpPost]
        public JsonResult GetAccountById(string id)
        {
            var response = new JsonResponse();
            try
            {
                var Account = AccountDAL.GetAccountById(id);
                if (Account != null)
                {
                    response.Success = true;
                    response.Data = Account;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy tài khoản với Id này.";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return Json(response);
        }

        [HttpPost]
        public JsonResult UpdateACStatusId(AccountModel Account)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(Account.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (Account.StatusId <= 0)
                {
                    response.Success = false;
                    response.Message = "StatusId không hợp lệ.";
                    return Json(response);
                }

                Account.ModifyDate = DateTime.Now.ToString();

                AccountDAL.Account_UpdateStatusId(Account);
                var trangthai = "";
                switch (Account.StatusId)
                {
                    case 1:
                        trangthai = "khôi phục trạng thái hoạt động";
                        break;
                    case 2:
                        trangthai = "được chuyển vào thùng rác";
                        break;
                }

                response.Success = true;
                response.Message = "Tài khoản đã " + trangthai;
            }
            catch (SqlException sqlEx)
            {
                response.Success = false;
                response.Message = $"Lỗi SQL: {sqlEx.Message}";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Đã xảy ra lỗi khi cập nhật trạng thái: {ex.Message}";
            }

            return Json(response);
        }
        [HttpPost]
        public JsonResult saveAC(AccountModel obj)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(obj.Id))
                { 
                   response.Success = false;
                   response.Message = "Id không hợp lệ."; 
                }
                else
                {
                    string nP = obj.oldPassword;
                    obj.ModifyDate = DateTime.Now.ToString();
                    var data1 = AccountDAL.GetAccountById(obj.Id);
                    AccountDAL.Account_Update(obj);
                    if(!string.IsNullOrEmpty(obj.Password) && !string.IsNullOrEmpty(data1.Password))
                    { 
                        var upPass = UpdatePassword(data1.Password, nP, data1.Id);
                    }
                    response.Success = true;
                    response.Message = "Cập nhật thành công!";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return Json(response);
        }

        [HttpPost]
        [CustomAuthorize]
        public ActionResult UpdatePassword(string oldPassword, string newPassword, string accountId)
        { 

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
