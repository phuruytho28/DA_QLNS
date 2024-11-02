using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.Controllers.CommonController;
using QuanLyNhanSu_WebApp.DataAccessLayer;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp.Controllers
{
    public class PhongBanController : Controller
    {
        [CustomAuthorize]
        // GET: PhongBan
        public ActionResult PhongBanView()
        {
            return View();
        }

        private readonly PhongBanDAL PhongBanDAL = new PhongBanDAL();

        [HttpPost]
        public JsonResult FilterPhongBan(PhongBanModel PhongBan)
        {
            int totalRows = 0;  
            List<PhongBanModel> PhongBanList = new List<PhongBanModel>();

            try
            {
                PhongBanList = PhongBanDAL.PhongBan_Search(PhongBan, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = PhongBanList,
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
        public JsonResult save(PhongBanModel obj)
        {
            var response = new JsonResponse();
            try
            {
                string newId = null;
                if (string.IsNullOrEmpty(obj.Id))
                {
                    obj.CreatedDate = DateTime.Now.ToString(); 
                    var result = PhongBanDAL.PhongBan_Insert(obj, ref newId);
                    if (!string.IsNullOrEmpty(newId))
                    {
                        response.Success = true;
                        response.Message = "Thêm mới thành công!";
                        response.NewId = newId;
                    }
                    else
                    {
                        response.Success = false;
                        response.Message = "Thêm mới thất bại";
                    }
                }
                else
                { 
                    obj.ModifyDate = DateTime.Now.ToString();
                    PhongBanDAL.PhongBan_Update(obj);   
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
        public JsonResult GetPhongBanById(string id)
        {
            var response = new JsonResponse();
            try
            {
                var PhongBan = PhongBanDAL.PhongBan_GetById(id);
                if (PhongBan != null)
                {
                    response.Success = true;
                    response.Data = PhongBan;
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

        [HttpPost]
        public JsonResult UpdateStatusId(PhongBanModel PhongBan)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(PhongBan.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (PhongBan.StatusId <= 0)
                {
                    response.Success = false;
                    response.Message = "StatusId không hợp lệ.";
                    return Json(response);
                }

                PhongBan.ModifyDate = DateTime.Now.ToString(); 

                PhongBanDAL.PhongBan_UpdateStatusId(PhongBan);
                var trangthai = ""; 
                switch (PhongBan.StatusId) {
                    case 1:
                        trangthai = "khôi phục trạng thái hoạt động";
                            break;
                    case 2:
                        trangthai = "được chuyển vào thùng rác";
                            break; 
                }

                response.Success = true;
                response.Message = "Cơ sở đã " + trangthai;
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

    }
}
