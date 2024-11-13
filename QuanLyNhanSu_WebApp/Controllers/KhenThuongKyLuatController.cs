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

namespace QuanLyKhenThuongKyLuat_WebApp.Controllers
{
    [CustomAuthorize]
    public class KhenThuongKyLuatController : Controller
    {
        [CustomAuthorize]
        public ActionResult ListKhenThuongKyLuatView()
        {
            return View();
        } 

        private readonly KhenThuongKyLuatDAL KhenThuongKyLuatDAL = new KhenThuongKyLuatDAL();

        [HttpPost]
        public JsonResult FilterKhenThuongKyLuat(KhenThuongKyLuatModel KhenThuongKyLuat)
        {
            int totalRows = 0;
            List<KhenThuongKyLuatModel> KhenThuongKyLuatList = new List<KhenThuongKyLuatModel>();

            try
            {
                KhenThuongKyLuatList = KhenThuongKyLuatDAL.KhenThuongKyLuat_Search(KhenThuongKyLuat, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = KhenThuongKyLuatList,
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
        public JsonResult save(KhenThuongKyLuatModel obj)
        {
            var response = new JsonResponse();
            try
            {
                string newId = null;
                if (string.IsNullOrEmpty(obj.Id))
                {
                    obj.CreatedDate = DateTime.Now.ToString();
                    var result = KhenThuongKyLuatDAL.KhenThuongKyLuat_Insert(obj, ref newId);
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
                    KhenThuongKyLuatDAL.KhenThuongKyLuat_Update(obj);
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
        public JsonResult GetKhenThuongKyLuatById(string id)
        {
            var response = new JsonResponse();
            try
            {
                var KhenThuongKyLuat = KhenThuongKyLuatDAL.KhenThuongKyLuat_GetById(id);
                if (KhenThuongKyLuat != null)
                {
                    response.Success = true;
                    response.Data = KhenThuongKyLuat;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy quyết định với Id này.";
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
        public JsonResult UpdateStatusId(KhenThuongKyLuatModel KhenThuongKyLuat)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(KhenThuongKyLuat.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (KhenThuongKyLuat.StatusId < 0 ||KhenThuongKyLuat.TinhTrang < 0 ||KhenThuongKyLuat.HinhThuc < 0)
                {
                    response.Success = false;
                    response.Message = "Tình trạng không hợp lệ.";
                    return Json(response);
                }

                KhenThuongKyLuat.ModifyDate = DateTime.Now.ToString();

                KhenThuongKyLuatDAL.KhenThuongKyLuat_UpdateStatusId(KhenThuongKyLuat);
                var trangthai = "";
                if (KhenThuongKyLuat.StatusId > 0)
                { 
                    switch (KhenThuongKyLuat.StatusId)
                    {
                        case 1:
                            trangthai = "khôi phục trạng thái hoạt động";
                            break;
                        case 2:
                            trangthai = "được chuyển vào thùng rác";
                            break;
                    }
                }
                if (KhenThuongKyLuat.TinhTrang > 0)
                { 
                    switch (KhenThuongKyLuat.TinhTrang)
                    {
                        case 1:
                            trangthai = "được đề xuất";
                            break;
                        case 2:
                            trangthai = "được duyệt ";
                            break;
                        case 3:
                            trangthai = "bị từ chối duyệt ";
                            break; 
                    }
                }
                if (KhenThuongKyLuat.HinhThuc > 0)
                { 
                    switch (KhenThuongKyLuat.HinhThuc)
                    {
                        case 1:
                            trangthai = "chuyển sang hình thức khen thưởng";
                            break;
                        case 2:
                            trangthai = "chuyển sang hình thức kỷ luật";
                            break; 
                    }
                }

                response.Success = true;
                response.Message = "Quyết định đã " + trangthai;
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
