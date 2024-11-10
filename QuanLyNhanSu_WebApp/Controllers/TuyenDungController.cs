using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.Controllers.CommonController;
using QuanLyNhanSu_WebApp.DataAccessLayer;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.Models;
using QuanLyTuyenDung_WebApp.DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp.Controllers
{
    [CustomAuthorize]
    public class TuyenDungController : Controller
    {
        // GET: TuyenDung
        public ActionResult ListTuyenDungView()
        {
            return View();
        }
        public ActionResult DetailTuyenDungView()
        {
            return View();
        }

        private readonly TuyenDungDAL TuyenDungDAL = new TuyenDungDAL();

        [HttpPost]
        public JsonResult FilterTuyenDung(TuyenDungModel TuyenDung)
        {
            int totalRows = 0;  
            List<TuyenDungModel> TuyenDungList = new List<TuyenDungModel>();

            try
            {
                TuyenDungList = TuyenDungDAL.TuyenDung_Search(TuyenDung, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = TuyenDungList,
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
        public JsonResult save(TuyenDungModel obj)
        {
            var response = new JsonResponse();
            try
            {
                string newId = null;
                if (string.IsNullOrEmpty(obj.Id))
                {
                    obj.CreatedDate = DateTime.Now.ToString();
                    var result = TuyenDungDAL.TuyenDung_Insert(obj, ref newId);
                    if (!string.IsNullOrEmpty(newId))
                    {
                        response.Success = true;
                        response.Message = "Thêm mới thành công!";
                        response.NewId = newId;
                    }
                    else
                    {
                        response.Success = false;
                        response.Message = "Insert failed.";
                    }
                }
                else
                { 
                    obj.ModifyDate = DateTime.Now.ToString();
                    TuyenDungDAL.TuyenDung_Update(obj);   
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
        public JsonResult GetTuyenDungById(string id)
        {
            var response = new JsonResponse();
            try
            {
                var TuyenDung = TuyenDungDAL.TuyenDung_GetById(id);
                if (TuyenDung != null)
                {
                    response.Success = true;
                    response.Data = TuyenDung;
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
        public JsonResult UpdateStatusId(TuyenDungModel TuyenDung)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(TuyenDung.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (TuyenDung.StatusId <= 0)
                {
                    response.Success = false;
                    response.Message = "StatusId không hợp lệ.";
                    return Json(response);
                }

                TuyenDung.ModifyDate = DateTime.Now.ToString(); 

                TuyenDungDAL.TuyenDung_UpdateStatusId(TuyenDung);
                var trangthai = ""; 
                switch (TuyenDung.StatusId) {
                    case 1:
                        trangthai = "khôi phục trạng thái hoạt động";
                            break;
                    case 2:
                        trangthai = "được chuyển vào thùng rác";
                            break; 
                }

                response.Success = true;
                response.Message = "Tin tuyển dụng đã " + trangthai;
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
        public JsonResult TuyenDung_UpdateTinhTrangYeuCauTD(TuyenDungModel TuyenDung)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(TuyenDung.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (TuyenDung.TinhTrang <= 0)
                {
                    response.Success = false;
                    response.Message = "TinhTrang không hợp lệ.";
                    return Json(response);
                }

                TuyenDung.ModifyDate = DateTime.Now.ToString(); 

                TuyenDungDAL.TuyenDung_UpdateTinhTrangYeuCauTD(TuyenDung);
                var trangthai = ""; 
                switch (TuyenDung.TinhTrang) {
                    case 2:
                        trangthai = "được duyệt";
                            break;
                    case 3:
                        trangthai = "được chuyển hoàn thành";
                            break; 
                    case 4:
                        trangthai = "bị từ chối duyệt";
                            break; 
                }

                response.Success = true;
                response.Message = "Tin tuyển dụng đã " + trangthai;
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
